/**
 * Scheduled Function Worker.
 *
 * Polls all projects' scheduled_functions config every 60s, evaluates which
 * cron entries are due, and invokes the corresponding edge function. This is
 * a platform-level scheduler independent of pg_cron, so it works even when the
 * tenant DB has not enabled pg_cron.
 *
 * Cron parsing is intentionally minimal: 5-field expressions with '*', ranges,
 * steps, and comma lists. It computes next-fire semantics by checking whether
 * the current minute matches the expression.
 */
import { sql } from "../db";
import { config } from "../config";
import { logger } from "../utils/logger";
import { normalizeProjectConfig } from "../utils/project-config";
import { projectRepository } from "../repositories/project.repository";
import { nextScheduledFunctionRunAt, scheduledFunctionCronMatches } from "../utils/scheduled-function-cron";
import {
  normalizedScheduledFunctionHeaders,
  SCHEDULE_HEADERS_INVALID,
} from "../utils/scheduled-function-headers";
import {
  isScheduledFunctionConfig,
  scheduledFunctionBodyWithinLimit,
  scheduledFunctionsFromProjectConfig,
  type ScheduledFunctionConfig,
} from "../utils/scheduled-function-config";
import {
  claimScheduledFunctionRun,
  completeScheduledFunctionRun,
  enqueueScheduledFunctionRun,
  failScheduledFunctionRun,
  scheduledRunMinute,
  skipScheduledFunctionRun,
  startManualScheduledFunctionRun,
  type ClaimedScheduledRun,
} from "../services/scheduled-function-run.service";
import {
  advanceScheduledJob,
  backfillScheduledJobs,
  listDueScheduledJobs,
  removeScheduledJob,
  type DueScheduledJob,
} from "../services/scheduled-job-projection.service";

const POLL_INTERVAL_MS = 60_000;
const INVOKE_TIMEOUT_MS = 30_000;
const SCHEDULE_LOAD_FAILED = "SCHEDULE_LOAD_FAILED";
const SCHEDULE_CONFIG_INVALID = "SCHEDULE_CONFIG_INVALID";
const SCHEDULE_PROJECT_NOT_FOUND = "SCHEDULE_PROJECT_NOT_FOUND";
const SCHEDULE_INVOKE_FAILED = "SCHEDULE_INVOKE_FAILED";
const PROJECT_REF_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

interface DueSchedule {
  ref: string;
  schedule: ScheduledFunctionConfig;
}

interface DueProjectionSchedule extends DueSchedule {
  job: DueScheduledJob;
}

function validInvocationSchedule(ref: string, schedule: unknown): schedule is ScheduledFunctionConfig {
  return PROJECT_REF_PATTERN.test(ref)
    && isScheduledFunctionConfig(schedule);
}

export function scheduledFunctionsDueAt(
  rows: { ref: string; config: unknown }[],
  now: Date,
): DueSchedule[] {
  const due: DueSchedule[] = [];
  for (const row of rows) {
    const projectConfig = normalizeProjectConfig(row.config);
    const rawSchedules = projectConfig.scheduled_functions;
    if (!Array.isArray(rawSchedules)) continue;
    for (const candidate of rawSchedules) {
      if (!validInvocationSchedule(row.ref, candidate) || !candidate.enabled) continue;
      if (isDue(candidate.cron, now)) due.push({ ref: row.ref, schedule: candidate });
    }
  }
  return due;
}

export function isDue(cronExpr: string, date: Date): boolean {
  return scheduledFunctionCronMatches(cronExpr, date);
}

async function loadAllSchedules(): Promise<DueSchedule[]> {
  let rows: { ref: string; config: unknown }[] = [];
  try {
    rows = (await sql`
      SELECT ref, config FROM projects
      WHERE deleted_at IS NULL
    `) as { ref: string; config: unknown }[];
  } catch {
    logger.debug("[scheduled-functions] failed to load projects", { error: SCHEDULE_LOAD_FAILED });
    return [];
  }

  return scheduledFunctionsDueAt(rows, new Date());
}

async function loadDueProjectionSchedules(now: Date): Promise<DueProjectionSchedule[]> {
  const jobs = await listDueScheduledJobs(now);
  const due: DueProjectionSchedule[] = [];
  for (const job of jobs) {
    let project: Awaited<ReturnType<typeof projectRepository.findByRef>>;
    try {
      project = await projectRepository.findByRef(job.projectRef);
    } catch {
      continue;
    }
    if (!project) {
      await removeScheduledJob(job);
      continue;
    }
    const schedule = scheduledFunctionsFromProjectConfig(project.config)
      .find((candidate) => candidate.id === job.scheduleId);
    if (!schedule || !schedule.enabled) {
      const nextRunAt = nextScheduledFunctionRunAt(job.cron, now);
      if (nextRunAt) await advanceScheduledJob(job, nextRunAt);
      else await removeScheduledJob(job);
      continue;
    }
    due.push({ ref: job.projectRef, schedule, job });
  }
  return due;
}

export interface TriggerResult {
  ok: boolean;
  status?: number;
  error?: string;
}

function invocationHeaders(
  ref: string,
  serviceRoleKey: string,
  userHeaders: Record<string, string>,
): Record<string, string> {
  // Platform headers are applied last so tenant schedules cannot redirect or
  // re-authenticate the internal runtime request.
  return {
    ...userHeaders,
    "x-project-ref": ref,
    "apikey": serviceRoleKey,
    "authorization": `Bearer ${serviceRoleKey}`,
  };
}

function invocationRequest(
  schedule: ScheduledFunctionConfig,
  headers: Record<string, string>,
): RequestInit {
  const sendsJsonBody = schedule.method === "POST" && schedule.body !== undefined;
  return {
    method: schedule.method,
    headers: sendsJsonBody ? { ...headers, "content-type": "application/json" } : headers,
    signal: AbortSignal.timeout(INVOKE_TIMEOUT_MS),
    ...(sendsJsonBody ? { body: JSON.stringify(schedule.body) } : {}),
  };
}

async function invokeEdgeFunction(ref: string, schedule: ScheduledFunctionConfig): Promise<TriggerResult> {
  if (!validInvocationSchedule(ref, schedule)) return { ok: false, error: SCHEDULE_CONFIG_INVALID };
  if (!scheduledFunctionBodyWithinLimit(schedule.body)) return { ok: false, error: SCHEDULE_CONFIG_INVALID };
  const url = `${config.edgeRuntimeUrl}/functions/v1/${encodeURIComponent(schedule.slug)}`;
  const userHeaders = normalizedScheduledFunctionHeaders(schedule.headers ?? {});
  if (!userHeaders) return { ok: false, error: SCHEDULE_HEADERS_INVALID };
  try {
    const project = await projectRepository.findByRef(ref);
    if (!project) return { ok: false, error: SCHEDULE_PROJECT_NOT_FOUND };
    const headers = invocationHeaders(ref, project.service_role_key, userHeaders);
    const response = await fetch(url, invocationRequest(schedule, headers));
    // Only the HTTP status is used; release unread bodies without buffering them.
    // Cleanup failure must not replace the status already received from the function.
    await response.body?.cancel().catch(() => {});
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, error: SCHEDULE_INVOKE_FAILED };
  }
}

class ScheduledFunctionWorker {
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private projectionReady = false;
  private readonly workerId = `scheduled-function:${process.pid}:${crypto.randomUUID()}`;

  start(): void {
    if (this.timer) return;
    // Align to minute boundary, then poll every 60s.
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000;
    setTimeout(() => {
      this.tick();
      this.timer = setInterval(() => this.tick(), POLL_INTERVAL_MS);
      this.timer.unref?.();
    }, msToNextMinute);
    logger.info("[scheduled-functions] worker started");
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Force a config reload on next tick. We don't keep an in-memory cache of
  // schedules, so reload is a no-op that simply lets the next poll pick up
  // the latest DB state. Exposed for API routes to signal freshness.
  reload(): void {
    // no-op: schedules are always read fresh from DB on each tick.
  }

  private async ensureProjection(): Promise<void> {
    if (this.projectionReady) return;
    const result = await backfillScheduledJobs();
    this.projectionReady = result.ok;
    if (result.ok) {
      logger.info("[scheduled-functions] job projection ready", { projects: result.projects });
    }
  }

  private async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      await this.ensureProjection();
      const now = new Date();
      const scheduledFor = scheduledRunMinute(now);
      const directFallback: Array<DueSchedule & { scheduledFor: Date }> = [];

      if (this.projectionReady) {
        let projectionDue: DueProjectionSchedule[] = [];
        try {
          projectionDue = await loadDueProjectionSchedules(now);
        } catch (error) {
          logger.warn("[scheduled-functions] projection lookup failed; using full scan fallback", {
            error: error instanceof Error ? error.message : String(error),
          });
          this.projectionReady = false;
        }
        if (projectionDue.length > 0) {
          logger.debug(`[scheduled-functions] ${projectionDue.length} projected schedule(s) due`);
        }
        for (const item of projectionDue) {
          const nextRunAt = nextScheduledFunctionRunAt(item.schedule.cron, now);
          if (!nextRunAt) {
            await removeScheduledJob(item.job);
            continue;
          }
          // Compare-and-swap the due occurrence so only one process handles it.
          if (!(await advanceScheduledJob(item.job, nextRunAt))) continue;
          const enqueued = await enqueueScheduledFunctionRun({
            ref: item.ref,
            scheduleId: item.schedule.id,
            scheduleName: item.schedule.name,
            scheduledFor: item.job.nextRunAt,
          });
          // A duplicate means the ledger already owns this occurrence.
          if (enqueued.kind === "unavailable") {
            directFallback.push({ ...item, scheduledFor: item.job.nextRunAt });
          }
        }
      }

      if (!this.projectionReady) {
        const due = await loadAllSchedules();
        if (due.length > 0) {
          logger.debug(`[scheduled-functions] ${due.length} schedule(s) due`);
        }
        for (const item of due) {
          const enqueued = await enqueueScheduledFunctionRun({
            ref: item.ref,
            scheduleId: item.schedule.id,
            scheduleName: item.schedule.name,
            scheduledFor,
          });
          // A duplicate means another scheduler instance already owns this
          // (schedule, minute) run. An unavailable ledger keeps the old direct
          // dispatch behavior instead of silently dropping the schedule.
          if (enqueued.kind === "unavailable") directFallback.push({ ...item, scheduledFor });
        }
      }

      await this.dispatchPendingRuns(10);

      if (directFallback.length > 0) {
        await Promise.allSettled(
          directFallback.map(async ({ ref, schedule }) => {
            const invocation = await invokeEdgeFunction(ref, schedule);
            if (!invocation.ok) {
              logger.warn(`[scheduled-functions] invoke failed for ${ref}/${schedule.slug}`, {
                status: invocation.status,
                error: invocation.error,
              });
            }
          }),
        );
      }
    } finally {
      this.running = false;
    }
  }

  /**
   * Drain a bounded number of pending/retry runs. The database claim uses
   * FOR UPDATE SKIP LOCKED, so multiple Management API instances may call this
   * concurrently without double-dispatching one run.
   */
  async dispatchPendingRuns(maxRuns = 10): Promise<number> {
    let processed = 0;
    while (processed < maxRuns) {
      const run = await claimScheduledFunctionRun(this.workerId);
      if (run === null) break;
      await this.executeClaimedRun(run);
      processed += 1;
    }
    return processed;
  }

  private async executeClaimedRun(run: ClaimedScheduledRun): Promise<void> {
    let project: Awaited<ReturnType<typeof projectRepository.findByRef>>;
    try {
      project = await projectRepository.findByRef(run.projectRef);
    } catch {
      await failScheduledFunctionRun(run, { error: SCHEDULE_PROJECT_NOT_FOUND });
      return;
    }
    if (!project) {
      await skipScheduledFunctionRun(run, SCHEDULE_PROJECT_NOT_FOUND);
      return;
    }
    const schedule = scheduledFunctionsFromProjectConfig(project.config)
      .find((candidate) => candidate.id === run.scheduleId);
    if (!schedule || !schedule.enabled) {
      await skipScheduledFunctionRun(run, SCHEDULE_CONFIG_INVALID);
      return;
    }

    const invocation = await invokeEdgeFunction(run.projectRef, schedule);
    if (invocation.ok) {
      await completeScheduledFunctionRun(run, invocation.status ?? null);
      return;
    }
    const outcome = await failScheduledFunctionRun(run, {
      httpStatus: invocation.status ?? null,
      error: invocation.error ?? SCHEDULE_INVOKE_FAILED,
    });
    logger.warn(`[scheduled-functions] run ${run.id} failed (${outcome})`, {
      ref: run.projectRef,
      schedule: run.scheduleName,
      attempt: run.attempt,
      maxAttempts: run.maxAttempts,
      status: invocation.status,
      error: invocation.error,
    });
  }

  async triggerOnce(ref: string, schedule: ScheduledFunctionConfig): Promise<TriggerResult> {
    return invokeEdgeFunction(ref, schedule);
  }

  /** Manual trigger with the same durable run/retry path as a cron occurrence. */
  async triggerOnceWithRun(ref: string, schedule: ScheduledFunctionConfig): Promise<TriggerResult> {
    const run = await startManualScheduledFunctionRun({
      ref,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
    });
    if (run === null) return invokeEdgeFunction(ref, schedule);
    const invocation = await invokeEdgeFunction(ref, schedule);
    if (invocation.ok) {
      await completeScheduledFunctionRun(run, invocation.status ?? null);
    } else {
      await failScheduledFunctionRun(run, {
        httpStatus: invocation.status ?? null,
        error: invocation.error ?? SCHEDULE_INVOKE_FAILED,
      });
    }
    return invocation;
  }
}

export const scheduledFunctionWorker = new ScheduledFunctionWorker();
