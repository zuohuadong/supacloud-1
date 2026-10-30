/**
 * Generic outbox worker template for an application `app-worker` Function.
 *
 * The SQL template is in ./outbox.sql. This worker only drains rows that were
 * committed with the business mutation; it never performs a business write
 * before the outbox row exists.
 */
import { createClient } from "@supabase/supabase-js";
import type { OutboxMessage, OutboxStore } from "@supacloud/commands";
import { createOutboxDispatcher } from "@supacloud/commands";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");

const client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
const schema = () => client.schema("app");

const store: OutboxStore = {
  async claim(limit, workerId) {
    const { data, error } = await schema().rpc("outbox_claim", {
      p_limit: limit,
      p_worker: workerId,
    });
    if (error) throw new Error(`outbox_claim failed: ${error.code ?? "unknown"}`);
    return (data ?? []).map((row: Record<string, unknown>): OutboxMessage => ({
      id: String(row.id),
      topic: String(row.topic),
      payload: row.payload,
      idempotencyKey: String(row.idempotency_key),
      attempt: Number(row.attempts),
      maxAttempts: Number(row.max_attempts),
    }));
  },
  async complete(message) {
    const { error } = await schema().rpc("outbox_complete", { p_id: message.id });
    if (error) throw new Error("outbox_complete failed");
  },
  async retry(message, error, nextAttemptAt) {
    const { error: rpcError } = await schema().rpc("outbox_retry", {
      p_id: message.id,
      p_error: error,
      p_available_at: nextAttemptAt.toISOString(),
    });
    if (rpcError) throw new Error("outbox_retry failed");
  },
  async deadLetter(message, error) {
    const { error: rpcError } = await schema().rpc("outbox_dead_letter", {
      p_id: message.id,
      p_error: error,
    });
    if (rpcError) throw new Error("outbox_dead_letter failed");
  },
};

const dispatcher = createOutboxDispatcher({
  store,
  workerId: `app-worker:${crypto.randomUUID()}`,
  maxRuns: 10,
  handlers: {
    "order.paid": async (message) => {
      // Resolve current authoritative data by ID; do not trust a mutable
      // business snapshot embedded in the outbox payload.
      const payload = message.payload as { orderId?: unknown };
      if (typeof payload.orderId !== "string") throw new Error("OUTBOX_PAYLOAD_INVALID");
      // Call your domain service or an allowlisted external endpoint here.
      // Use message.idempotencyKey for downstream idempotency.
    },
  },
  onError: (event) => {
    console.error("[outbox] delivery failed", {
      id: event.message.id,
      topic: event.message.topic,
      attempt: event.message.attempt,
      terminal: event.terminal,
      error: event.error,
    });
  },
});

let stopping = false;
process.once("SIGTERM", () => { stopping = true; });
process.once("SIGINT", () => { stopping = true; });

while (!stopping) {
  const processed = await dispatcher.runOnce();
  if (processed === 0) await new Promise((resolve) => setTimeout(resolve, 1_000));
}
