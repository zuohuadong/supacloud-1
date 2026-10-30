/**
 * Cross-process invalidation for the GraphQL allowlist cache.
 *
 * The authoritative allowlist lives in `projects.config.graphql_allowlist`.
 * Each Management API process keeps a short-lived in-memory cache so GraphQL
 * requests do not read PostgreSQL on every call. After a configuration commit,
 * the writer publishes the project ref on a PostgreSQL NOTIFY channel; every
 * process clears that ref immediately. A small TTL remains as a safety net for
 * notifications missed while a listener reconnects.
 */
import { sql } from "../db";
import { config } from "../config";
import { createPgListener, type PgListenerHandle } from "../lib/pg-listen";
import { logger } from "../utils/logger";

export const GRAPHQL_ALLOWLIST_CHANNEL = "supacloud_graphql_allowlist";

export interface GraphqlAllowlistCacheInvalidation {
  /** Clear one project, or the whole cache when omitted. */
  clear(ref?: string): void;
  /** Returns the currently cached entry, if any. */
  get(ref: string): unknown;
  set(ref: string, value: unknown): void;
}

let listener: PgListenerHandle | null = null;
let invalidateHandler: ((ref?: string) => void) | null = null;

/**
 * Register the local cache callback. Kept separate from the LISTEN lifecycle so
 * the cache owner (sdk-proxy) does not need to import the database module.
 */
export function setGraphqlAllowlistInvalidationHandler(
  handler: ((ref?: string) => void) | null,
): void {
  invalidateHandler = handler;
}

export function startGraphqlAllowlistInvalidation(): void {
  if (listener) return;
  listener = createPgListener({
    url: config.databaseUrl,
    channels: [GRAPHQL_ALLOWLIST_CHANNEL],
    onNotification: (_channel, payload) => {
      const ref = payload.trim();
      if (!ref) {
        invalidateHandler?.();
        return;
      }
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(ref)) {
        logger.warn("[graphql] ignored invalid allowlist invalidation payload");
        return;
      }
      invalidateHandler?.(ref);
    },
    applicationName: "supacloud-graphql-allowlist",
  });
  logger.info("[graphql] allowlist invalidation listener started");
}

export function stopGraphqlAllowlistInvalidation(): void {
  listener?.close();
  listener = null;
}

/**
 * Publish after the configuration transaction has committed. Notification is
 * best-effort: the listener TTL covers missed messages, while correctness never
 * depends on delivery.
 */
export async function publishGraphqlAllowlistInvalidation(ref: string): Promise<void> {
  invalidateHandler?.(ref);
  try {
    await sql`SELECT pg_notify(${GRAPHQL_ALLOWLIST_CHANNEL}, ${ref})`;
  } catch (error) {
    logger.warn("[graphql] allowlist invalidation publish failed; relying on cache TTL", {
      ref,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}