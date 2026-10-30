/**
 * Storage-independent transactional outbox dispatcher.
 *
 * The application writes the outbox row in the same transaction as the business
 * mutation. This module only claims and dispatches rows; it deliberately does
 * not own an HTTP server, a database driver, or a second command ledger.
 */

export interface OutboxMessage {
  id: string;
  topic: string;
  payload: unknown;
  idempotencyKey: string;
  /** 1-based attempt number after the store's claim operation. */
  attempt: number;
  maxAttempts: number;
}

export interface OutboxStore {
  /** Atomically claim up to `limit` due rows (for example FOR UPDATE SKIP LOCKED). */
  claim(limit: number, workerId: string): Promise<readonly OutboxMessage[]>;
  complete(message: OutboxMessage): Promise<void>;
  retry(message: OutboxMessage, error: string, nextAttemptAt: Date): Promise<void>;
  deadLetter(message: OutboxMessage, error: string): Promise<void>;
}

export type OutboxHandler = (message: OutboxMessage) => Promise<void> | void;

export interface OutboxDispatcherOptions {
  store: OutboxStore;
  /** Exact topic handlers; "*" is the fallback. */
  handlers: Readonly<Record<string, OutboxHandler>>;
  workerId: string;
  /** Per-run claim bound. Defaults to 10. */
  maxRuns?: number;
  now?: () => Date;
  /** Bounded retry schedule in seconds; the last entry is reused. */
  retryDelaysSeconds?: readonly number[];
  /** Best-effort observability; never changes dispatch outcome. */
  onError?: (event: { message: OutboxMessage; error: string; terminal: boolean }) => void;
}

export interface OutboxDispatcher {
  /** Drain one bounded batch; returns the number of claimed messages. */
  runOnce(limit?: number): Promise<number>;
}

const DEFAULT_RETRY_DELAYS_SECONDS = [60, 300, 1_800] as const;
const MAX_ERROR_BYTES = 2_048;

export function createOutboxDispatcher(options: OutboxDispatcherOptions): OutboxDispatcher {
  const maxRuns = positive(options.maxRuns ?? 10, "maxRuns");
  const retryDelays = (options.retryDelaysSeconds ?? DEFAULT_RETRY_DELAYS_SECONDS)
    .filter((value) => Number.isFinite(value) && value > 0);
  if (retryDelays.length === 0) throw new TypeError("retryDelaysSeconds must contain a positive value");
  const now = options.now ?? (() => new Date());

  return {
    async runOnce(limit = maxRuns) {
      const bounded = positive(limit, "limit");
      const messages = await options.store.claim(bounded, options.workerId);
      for (const message of messages) {
        await dispatchOne(message, options, retryDelays, now);
      }
      return messages.length;
    },
  };
}

async function dispatchOne(
  message: OutboxMessage,
  options: OutboxDispatcherOptions,
  retryDelays: readonly number[],
  now: () => Date,
): Promise<void> {
  const handler = options.handlers[message.topic] ?? options.handlers["*"];
  if (handler === undefined) {
    const error = `OUTBOX_HANDLER_MISSING:${message.topic}`;
    await options.store.deadLetter(message, error);
    report(options, { message, error, terminal: true });
    return;
  }
  try {
    await handler(message);
    await options.store.complete(message);
  } catch (cause) {
    const error = boundedError(cause);
    const terminal = message.attempt >= message.maxAttempts;
    if (terminal) {
      await options.store.deadLetter(message, error);
    } else {
      const delay = retryDelays[Math.min(message.attempt - 1, retryDelays.length - 1)]!;
      await options.store.retry(message, error, new Date(now().getTime() + delay * 1_000));
    }
    report(options, { message, error, terminal });
  }
}

function report(
  options: OutboxDispatcherOptions,
  event: { message: OutboxMessage; error: string; terminal: boolean },
): void {
  try {
    options.onError?.(event);
  } catch { /* Observers are best-effort and never change dispatch outcome. */ }
}

export function boundedOutboxError(error: unknown): string {
  return boundedError(error);
}

export function nextOutboxAttempt(
  attempt: number,
  retryDelaysSeconds: readonly number[] = DEFAULT_RETRY_DELAYS_SECONDS,
): Date {
  const delays = retryDelaysSeconds.filter((value) => Number.isFinite(value) && value > 0);
  const selected = delays[Math.min(Math.max(0, attempt - 1), delays.length - 1)];
  if (selected === undefined) throw new TypeError("retryDelaysSeconds must contain a positive value");
  return new Date(Date.now() + selected * 1_000);
}

function boundedError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const bytes = new TextEncoder().encode(message);
  if (bytes.byteLength <= MAX_ERROR_BYTES) return message;
  return new TextDecoder().decode(bytes.slice(0, MAX_ERROR_BYTES));
}

function positive(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) throw new TypeError(`${field} must be a positive integer`);
  return value;
}
