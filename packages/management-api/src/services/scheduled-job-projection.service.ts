/**
 * Projection of enabled scheduled functions for the platform scheduler.
 *
 * `projects.config.scheduled_functions` remains authoritative. This table is a
 * derived index containing only the fields needed to find due schedules, so the
 * worker can use `next_run_at` instead of scanning every project's JSON config
 * on each minute tick. Project and schedule mutations update it transactionally.
 */
import type { SQL } from "bun";
import { sql } from "../db";
import { logger } from "../utils/logger";
import {
  scheduledFunctionsFromProjectConfig,
  type ScheduledFunctionConfig,
} from "../utils/scheduled-function-config";
import { nextScheduledFunctionRunAt } from "../utils/scheduled-function-cron";

const MAX_DUE_JOBS_PER_TICK = 200;

export interface DueScheduledJob {
  projectRef: string;
  scheduleId: string;
  scheduleName: string;
  cron: string;
  nextRunAt: Date;
}

async function replaceProjectScheduledJobs(
  transaction: SQL,
  ref: string,
  schedules: readonly ScheduledFunctionConfig[],
): Promise<void> {
  const enabled = schedules.filter((schedule) => schedule.enabled);
  const keep = new Set(enabled.map((schedule) => schedule.id));
  const existing = await transaction`
    SELECT schedule_id FROM scheduled_jobs WHERE project_ref = ${ref}
  ` as Array<{ schedule_id: string }>;
  for (const row of existing) {
    if (!keep.has(row.schedule_id)) {
      await transaction`DELETE FROM scheduled_jobs WHERE project_ref = ${ref} AND schedule_id = ${row.schedule_id}`;
    }
  }

  const now = new Date();
  for (const schedule of enabled) {
    const nextRunAt = nextScheduledFunctionRunAt(schedule.cron, now);
    if (nextRunAt === null) continue;
    await transaction`
      INSERT INTO scheduled_jobs (
        project_ref, schedule_id, schedule_name, cron, enabled, next_run_at, updated_at
      ) VALUES (
        ${ref}, ${schedule.id}, ${schedule.name}, ${schedule.cron}, TRUE, ${nextRunAt}, NOW()
      )
      ON CONFLICT (project_ref, schedule_id) DO UPDATE
      SET schedule_name = EXCLUDED.schedule_name,
          cron = EXCLUDED.cron,
          enabled = EXCLUDED.enabled,
          -- Preserve an already-computed occurrence while the cadence is unchanged.
          next_run_at = CASE
            WHEN scheduled_jobs.cron = EXCLUDED.cron THEN scheduled_jobs.next_run_at
            ELSE EXCLUDED.next_run_at
          END,
          updated_at = NOW()
    `;
  }
}

/** Maintain the projection in the same transaction as the JSON config write. */
export async function syncProjectScheduledJobs(
  transaction: SQL,
  ref: string,
  schedules: readonly ScheduledFunctionConfig[],
): Promise<void> {
  await replaceProjectScheduledJobs(transaction, ref, schedules);
}

/**
 * One-time startup backfill for rows created before the projection existed.
 * It still reads all project configs, but only at process start, not every tick.
 */
export async function backfillScheduledJobs(): Promise<{ ok: boolean; projects: number }> {
  try {
    return await sql.begin(async (transaction) => {
      const rows = await transaction`
        SELECT ref, config FROM projects
        WHERE deleted_at IS NULL
          AND jsonb_typeof(config -> 'scheduled_functions') = 'array'
      ` as Array<{ ref: string; config: unknown }>;
      for (const row of rows) {
        await replaceProjectScheduledJobs(
          transaction,
          row.ref,
          scheduledFunctionsFromProjectConfig(row.config),
        );
      }
      return { ok: true, projects: rows.length };
    });
  } catch (error) {
    logger.warn("[scheduled-functions] projection backfill failed; worker will use full scan fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, projects: 0 };
  }
}

export async function listDueScheduledJobs(now: Date): Promise<DueScheduledJob[]> {
  const rows = await sql`
    SELECT project_ref, schedule_id, schedule_name, cron, next_run_at
    FROM scheduled_jobs
    WHERE enabled AND next_run_at <= ${now}
    ORDER BY next_run_at ASC
    LIMIT ${MAX_DUE_JOBS_PER_TICK}
  ` as Array<{
    project_ref: string;
    schedule_id: string;
    schedule_name: string;
    cron: string;
    next_run_at: string | Date;
  }>;
  return rows.map((row) => ({
    projectRef: row.project_ref,
    scheduleId: row.schedule_id,
    scheduleName: row.schedule_name,
    cron: row.cron,
    nextRunAt: new Date(row.next_run_at),
  }));
}

/**
 * Claim one due occurrence by compare-and-swapping its next_run_at. Multiple
 * Management API instances can run the worker; only one advances this row.
 */
export async function removeScheduledJob(job: DueScheduledJob): Promise<void> {
  await sql`
    DELETE FROM scheduled_jobs
    WHERE project_ref = ${job.projectRef}
      AND schedule_id = ${job.scheduleId}
  `;
}

export async function advanceScheduledJob(
  job: DueScheduledJob,
  nextRunAt: Date,
): Promise<boolean> {
  const rows = await sql`
    UPDATE scheduled_jobs
    SET next_run_at = ${nextRunAt}, updated_at = NOW()
    WHERE project_ref = ${job.projectRef}
      AND schedule_id = ${job.scheduleId}
      AND enabled
      AND next_run_at = ${job.nextRunAt}
    RETURNING project_ref
  ` as Array<{ project_ref: string }>;
  return rows.length > 0;
}