import { expect, test } from "bun:test";
import { createOutboxDispatcher, type OutboxMessage, type OutboxStore } from "./outbox";

function memoryStore(messages: OutboxMessage[]) {
  const events: string[] = [];
  const store: OutboxStore = {
    async claim(limit) {
      return messages.slice(0, limit);
    },
    async complete(message) { events.push(`complete:${message.id}`); },
    async retry(message, error, nextAttemptAt) {
      events.push(`retry:${message.id}:${error}:${nextAttemptAt.toISOString()}`);
    },
    async deadLetter(message, error) { events.push(`dead:${message.id}:${error}`); },
  };
  return { store, events };
}

function message(overrides: Partial<OutboxMessage> = {}): OutboxMessage {
  return {
    id: "m-1", topic: "order.paid", payload: { orderId: "o-1" },
    idempotencyKey: "order.paid:o-1", attempt: 1, maxAttempts: 3, ...overrides,
  };
}

test("dispatches a claimed message and completes it", async () => {
  const { store, events } = memoryStore([message()]);
  const seen: string[] = [];
  const dispatcher = createOutboxDispatcher({
    store, workerId: "w-1",
    handlers: { "order.paid": (row) => { seen.push(row.idempotencyKey); } },
  });
  expect(await dispatcher.runOnce()).toBe(1);
  expect(seen).toEqual(["order.paid:o-1"]);
  expect(events).toEqual(["complete:m-1"]);
});

test("retries with a bounded backoff and dead-letters at the limit", async () => {
  const retry = memoryStore([message({ attempt: 1, maxAttempts: 3 })]);
  const retryDispatcher = createOutboxDispatcher({
    store: retry.store, workerId: "w-1",
    retryDelaysSeconds: [10, 60],
    now: () => new Date("2026-10-01T00:00:00Z"),
    handlers: { "order.paid": () => { throw new Error("temporary"); } },
  });
  await retryDispatcher.runOnce();
  expect(retry.events).toEqual(["retry:m-1:temporary:2026-10-01T00:00:10.000Z"]);

  const dead = memoryStore([message({ attempt: 3, maxAttempts: 3 })]);
  const deadDispatcher = createOutboxDispatcher({
    store: dead.store, workerId: "w-1",
    handlers: { "order.paid": () => { throw new Error("terminal"); } },
  });
  await deadDispatcher.runOnce();
  expect(dead.events).toEqual(["dead:m-1:terminal"]);
});

test("unknown topics are terminal and never retried forever", async () => {
  const { store, events } = memoryStore([message({ topic: "unknown" })]);
  const errors: string[] = [];
  const dispatcher = createOutboxDispatcher({
    store, workerId: "w-1", handlers: {}, onError: (event) => errors.push(`${event.terminal}:${event.error}`),
  });
  await dispatcher.runOnce();
  expect(events).toEqual(["dead:m-1:OUTBOX_HANDLER_MISSING:unknown"]);
  expect(errors).toEqual(["true:OUTBOX_HANDLER_MISSING:unknown"]);
});

test("uses the wildcard fallback and never lets observer failures change outcomes", async () => {
  const { store, events } = memoryStore([message({ attempt: 1, maxAttempts: 3 })]);
  const dispatcher = createOutboxDispatcher({
    store, workerId: "w-1",
    retryDelaysSeconds: [10],
    handlers: { "*": () => { throw new Error("delivery failed"); } },
    onError: () => { throw new Error("observer down"); },
  });
  expect(await dispatcher.runOnce()).toBe(1);
  expect(events[0]).toStartWith("retry:m-1:delivery failed:");
});
