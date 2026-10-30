import { sql } from "../db";
import { logger } from "../utils/logger";

const DEFAULT_MAX_ATTEMPTS = 3;
const RETRY_DELAYS_SECONDS = [60, 300, 1_800] as const;
const MAX_ERROR_BYTES = 2_048;

export type ScheduledRunStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "retry_scheduled"
  | "dead_lettered"
  | "skipped";

export interface EnqueueScheduledRunInput {
  ref: string;
  scheduleId: string;
  scheduleName: string;
  scheduledFor: Date;
  maxAttempts?: number;
}

export type EnqueueScheduledRunResult =
  | { kind: "enqueued"; id: string }
  | { kind: "duplicate" }
  | { kind: "unavailable" };

export interface ClaimedScheduledRun {
  id: string;
  projectRef: string;
  scheduleId: string;
  scheduleName: string;
  scheduledFor: string;
  attempt: number;
  maxAttempts: number;
}

export interface ScheduledRunRecord {
  id: string;
  project_ref: string;
  schedule_id: string;
  schedule_name: string;
  scheduled_for: string;
  status: ScheduledRunStatus;
  attempt: number;
  max_attempts: number;
  http_status: number | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

/** The scheduled minute identifies one run, regardless of which worker observes it. */
export function scheduledRunMinute(now: Date): Date {
  return new Date(Math.floor(now.getTime() / 60_000) * 60_000);
}

/** Bounded exponential backoff; attempt is 1-based after claim. */
export function nextScheduledRetryDelaySeconds(attempt: number): number {
  const index = Math.max(0, Math.min(RETRY_DELAYS_SECONDS.length - 1, attempt - 1));
  return RETRY_DELAYS_SECONDS[index]!;
}

export function boundedScheduledRunError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const bytes = new TextEncoder().encode(message);
  if (bytes.byteLength <= MAX_ERROR_BYTES) return message;
  return new TextDecoder().decode(bytes.slice(0, MAX_ERROR_BYTES));
}

export async function enqueueScheduledFunctionRun(
  input: EnqueueScheduledRunInput,
): Promise<EnqueueScheduledRunResult> {
  const maxAttempts = input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  try {
    const rows = await sql`
      INSERT INTO scheduled_function_runs (
        project_ref, schedule_id, schedule_name, scheduled_for,
        status, attempt, max_attempts, next_attempt_at
      ) VALUES (
        ${input.ref}, ${input.scheduleId}, ${input.scheduleName}, ${input.scheduledFor},
        'pending', 0, ${maxAttempts}, NOW()
      )
      ON CONFLICT (project_ref, schedule_id, scheduled_for) DO NOTHING
      RETURNING id
    ` as Array<{ id: string }>;
    return rows[0] ? { kind: "enqueued", id: rows[0].id } : { kind: "duplicate" };
  } catch (error) {
    logger.warn("[scheduled-functions] run ledger unavailable; falling back to direct dispatch", {
      ref: input.ref,
      error: boundedScheduledRunError(error),
    });
    return { kind: "unavailable" };
  }
}

/**
 * Atomically claim one due run. PostgreSQL FOR UPDATE SKIP LOCKED lets multiple
 * scheduler instances drain the same queue without claiming the same row.
 */
/** Start a manual run immediately; it shares the same retry/dead-letter path. */
export async function startManualScheduledFunctionRun(input: {
  ref: string;
  scheduleId: string;
  scheduleName: string;
  maxAttempts?: number;
}): Promise<ClaimedScheduledRun | null> {
  try {
    const rows = await sql`
      INSERT INTO scheduled_function_runs (
        project_ref, schedule_id, schedule_name, scheduled_for,
        status, attempt, max_attempts, next_attempt_at, locked_at, locked_by, started_at
      ) VALUES (
        ${input.ref}, ${input.scheduleId}, ${input.scheduleName}, NOW(),
        'running', 1, ${input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS}, NOW(), NOW(), 'manual', NOW()
      )
      ON CONFLICT (project_ref, schedule_id, scheduled_for) DO NOTHING
      RETURNING id, project_ref, schedule_id, schedule_name, scheduled_for, attempt, max_attempts
    ` as Array<{
      id: string; project_ref: string; schedule_id: string; schedule_name: string;
      scheduled_for: string | Date; attempt: number; max_attempts: number;
    }>;
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      projectRef: row.project_ref,
      scheduleId: row.schedule_id,
      scheduleName: row.schedule_name,
      scheduledFor: new Date(row.scheduled_for).toISOString(),
      attempt: Number(row.attempt),
      maxAttempts: Number(row.max_attempts),
    };
  } catch (error) {
    logger.warn("[scheduled-functions] manual run ledger unavailable", {
      ref: input.ref,
      error: boundedScheduledRunError(error),
    });
    return null;
  }
}

export async function claimScheduledFunctionRun(workerId: string): Promise<ClaimedScheduledRun | null> {
  try {
    return await sql.begin(async (transaction) => {
      const rows = await transaction`
        SELECT id
        FROM scheduled_function_runs
        WHERE status IN ('pending', 'retry_scheduled')
          AND next_attempt_at <= NOW()
        ORDER BY next_attempt_at ASC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      ` as Array<{ id: string }>;
      const row = rows[0];
      if (!row) return null;
      const updated = await transaction`
        UPDATE scheduled_function_runs
        SET status = 'running',
            attempt = attempt + 1,
            locked_at = NOW(),
            locked_by = ${workerId},
            started_at = COALESCE(started_at, NOW()),
            updated_at = NOW()
        WHERE id = ${row.id}
        RETURNING id, project_ref, schedule_id, schedule_name, scheduled_for, attempt, max_attempts
      ` as Array<{
        id: string;
        project_ref: string;
        schedule_id: string;
        schedule_name: string;
        scheduled_for: string | Date;
        attempt: number;
        max_attempts: number;
      }>;
      const claimed = updated[0];
      if (!claimed) return null;
      return {
        id: claimed.id,
        projectRef: claimed.project_ref,
        scheduleId: claimed.schedule_id,
        scheduleName: claimed.schedule_name,
        scheduledFor: new Date(claimed.scheduled_for).toISOString(),
        attempt: Number(claimed.attempt),
        maxAttempts: Number(claimed.max_attempts),
      };
    });
  } catch (error) {
    logger.warn("[scheduled-functions] run claim unavailable", {
      error: boundedScheduledRunError(error),
    });
    return null;
  }
}

export async function completeScheduledFunctionRun(
  run: ClaimedScheduledRun,
  httpStatus: number | null,
): Promise<void> {
  try {
    await sql`
      UPDATE scheduled_function_runs
      SET status = 'succeeded', http_status = ${httpStatus}, error = NULL,
          finished_at = NOW(), locked_at = NULL, locked_by = NULL, updated_at = NOW()
      WHERE id = ${run.id} AND status = 'running'
    `;
  } catch (error) {
    logger.warn("[scheduled-functions] run completion ledger write failed", {
      runId: run.id,
      error: boundedScheduledRunError(error),
    });
  }
}

export async function skipScheduledFunctionRun(
  run: ClaimedScheduledRun,
  reason: string,
): Promise<void> {
  try {
    await sql`
      UPDATE scheduled_function_runs
      SET status = 'skipped', error = ${boundedScheduledRunError(reason)},
          finished_at = NOW(), locked_at = NULL, locked_by = NULL, updated_at = NOW()
      WHERE id = ${run.id} AND status = 'running'
    `;
  } catch (error) {
    logger.warn("[scheduled-functions] run skip ledger write failed", {
      runId: run.id,
      error: boundedScheduledRunError(error),
    });
  }
}

export async function failScheduledFunctionRun(
  run: ClaimedScheduledRun,
  input: { httpStatus?: number | null; error: unknown },
): Promise<"retry_scheduled" | "dead_lettered"> {
  const error = boundedScheduledRunError(input.error);
  if (run.attempt >= run.maxAttempts) {
    await updateFailedRun(run, "dead_lettered", input.httpStatus ?? null, error, null);
    return "dead_lettered";
  }
  const delaySeconds = nextScheduledRetryDelaySeconds(run.attempt);
  const nextAttemptAt = new Date(Date.now() + delaySeconds * 1_000);
  await updateFailedRun(run, "retry_scheduled", input.httpStatus ?? null, error, nextAttemptAt);
  return "retry_scheduled";
}

async function updateFailedRun(
  run: ClaimedScheduledRun,
  status: "retry_scheduled" | "dead_lettered",
  httpStatus: number | null,
  error: string,
  nextAttemptAt: Date | null,
): Promise<void> {
  try {
    await sql`
      UPDATE scheduled_function_runs
      SET status = ${status}, http_status = ${httpStatus}, error = ${error},
          next_attempt_at = ${nextAttemptAt ?? new Date()},
          finished_at = ${status === "dead_lettered" ? new Date() : null},
          locked_at = NULL, locked_by = NULL, updated_at = NOW()
      WHERE id = ${run.id} AND status = 'running'
    `;
  } catch (writeError) {
    logger.warn("[scheduled-functions] failed run ledger write failed", {
      runId: run.id,
      error: boundedScheduledRunError(writeError),
    });
  }
}

export async function listScheduledFunctionRuns(
  ref: string,
  scheduleId: string,
  limit = 50,
): Promise<ScheduledRunRecord[]> {
  const bounded = Math.max(1, Math.min(100, Math.trunc(limit)));
  return await sql`
    SELECT id, project_ref, schedule_id, schedule_name, scheduled_for,
           status, attempt, max_attempts, http_status, error,
           started_at, finished_at, created_at
    FROM scheduled_function_runs
    WHERE project_ref = ${ref} AND schedule_id = ${scheduleId}
    ORDER BY scheduled_for DESC, created_at DESC
    LIMIT ${bounded}
  ` as ScheduledRunRecord[];
}

export const SCHEDULED_RUN_DEFAULT_MAX_ATTEMPTS = DEFAULT_MAX_ATTEMPTS;
export const SCHEDULED_RUN_RETRY_DELAYS_SECONDS = RETRY_DELAYS_SECONDS;