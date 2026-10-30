import { expect, test } from "bun:test";
import { createHttpAction, HttpActionError } from "./http-action";
import type { DurableCommandReceipt } from "@supacloud/contracts";
import { createExternalCommand } from "./external";
import { plaintextCommandInput } from "./context";

function captureFetch(response: () => Response = () => Response.json({ ok: true })) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return response();
  }) as typeof fetch;
  return { calls, fetchImpl };
}

test("dispatches a typed action with idempotency and JSON body", async () => {
  const { calls, fetchImpl } = captureFetch(() => Response.json({ id: "remote-1" }));
  const action = createHttpAction<{ orderId: string }>({
    url: "https://api.example.com/refund",
    allowedHosts: ["api.example.com"],
    headers: () => ({ authorization: "Bearer token" }),
    body: (input) => JSON.stringify({ orderId: input.orderId }),
    fetch: fetchImpl,
  });

  expect(await action.send({ orderId: "o-1" }, { idempotencyKey: "op-1" }))
    .toEqual({ id: "remote-1" });
  expect(calls).toHaveLength(1);
  const call = calls[0]!;
  expect(call.url).toBe("https://api.example.com/refund");
  expect(call.init.method).toBe("POST");
  expect(new Headers(call.init.headers).get("idempotency-key")).toBe("op-1");
  expect(new Headers(call.init.headers).get("authorization")).toBe("Bearer token");
  expect(new Headers(call.init.headers).get("content-type")).toBe("application/json");
  expect(call.init.body).toBe(JSON.stringify({ orderId: "o-1" }));
});

test("custom idempotency header and caller value are preserved", async () => {
  const { calls, fetchImpl } = captureFetch();
  const action = createHttpAction<null>({
    url: "https://api.example.com/action",
    idempotencyHeader: "x-operation-id",
    headers: { "x-operation-id": "caller-value" },
    fetch: fetchImpl,
  });
  await action.send(null, { idempotencyKey: "dispatch-key" });
  expect(new Headers(calls[0]!.init.headers).get("x-operation-id")).toBe("caller-value");
});

test("rejects insecure and unlisted destinations before fetch", async () => {
  const { calls, fetchImpl } = captureFetch();
  const action = createHttpAction<null>({ url: "http://api.example.com/action", fetch: fetchImpl });
  await expect(action.send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_URL_NOT_ALLOWED",
  });

  const loopback = createHttpAction<null>({
    url: "http://127.0.0.1:8080/action",
    allowInsecureHttp: true,
    fetch: fetchImpl,
  });
  await expect(loopback.send(null, { idempotencyKey: "op" })).resolves.toEqual({ ok: true });

  const unlisted = createHttpAction<null>({
    url: "https://other.example.com/action",
    allowedHosts: ["api.example.com"],
    fetch: fetchImpl,
  });
  await expect(unlisted.send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_URL_NOT_ALLOWED",
  });
  expect(calls).toHaveLength(1);
});

test("rejects embedded credentials and invalid URL resolvers", async () => {
  const { fetchImpl } = captureFetch();
  await expect(createHttpAction<null>({
    url: "https://user:pass@api.example.com/action",
    fetch: fetchImpl,
  }).send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_URL_NOT_ALLOWED",
  });
  await expect(createHttpAction<null>({
    url: () => { throw new Error("no target"); },
    fetch: fetchImpl,
  }).send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_URL_INVALID",
  });
});

test("classifies HTTP status errors and only configured definitive rejections", async () => {
  const action = createHttpAction<null>({
    url: "https://api.example.com/action",
    fetch: captureFetch(() => new Response(null, { status: 422 })).fetchImpl,
    definitiveRejectionStatuses: [422],
  });
  const error = await action.send(null, { idempotencyKey: "op" }).catch((value: unknown) => value);
  expect(error).toBeInstanceOf(HttpActionError);
  expect(error).toMatchObject({ code: "HTTP_ACTION_STATUS", status: 422, retryable: false });
  expect(action.isDefinitiveWriteFailure(error)).toBe(true);
  expect(action.isDefinitiveWriteFailure(new Error("other"))).toBe(false);
});

test("times out and aborts the underlying request", async () => {
  const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    await new Promise<never>((_, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
    return new Response();
  }) as typeof fetch;
  const action = createHttpAction<null>({
    url: "https://api.example.com/action",
    timeoutMs: 5,
    fetch: fetchImpl,
  });
  await expect(action.send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_TIMEOUT",
    retryable: true,
  });
});

test("honors an already-aborted dispatch signal", async () => {
  const controller = new AbortController();
  controller.abort();
  const { calls, fetchImpl } = captureFetch();
  const action = createHttpAction<null>({ url: "https://api.example.com/action", fetch: fetchImpl });
  await expect(action.send(null, { idempotencyKey: "op", signal: controller.signal }))
    .rejects.toMatchObject({ code: "HTTP_ACTION_ABORTED" });
  expect(calls).toHaveLength(0);
});

test("caps response bodies and rejects invalid JSON", async () => {
  const large = createHttpAction<null>({
    url: "https://api.example.com/action",
    maxResponseBytes: 4,
    fetch: captureFetch(() => new Response("12345")).fetchImpl,
  });
  await expect(large.send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_RESPONSE_TOO_LARGE",
  });

  const invalid = createHttpAction<null>({
    url: "https://api.example.com/action",
    fetch: captureFetch(() => new Response("not json")).fetchImpl,
  });
  await expect(invalid.send(null, { idempotencyKey: "op" })).rejects.toMatchObject({
    code: "HTTP_ACTION_INVALID_RESPONSE",
  });
});

test("lookup is optional, read-only and treats configured statuses as missing", async () => {
  const none = createHttpAction<null>({
    url: "https://api.example.com/action",
    fetch: captureFetch().fetchImpl,
  });
  expect(await none.lookup(null, { idempotencyKey: "op" })).toBeNull();

  const { calls, fetchImpl } = captureFetch(() => new Response(null, { status: 404 }));
  const action = createHttpAction<{ id: string }>({
    url: "https://api.example.com/action",
    lookup: { url: (input) => `https://api.example.com/refunds/${input.id}` },
    fetch: fetchImpl,
  });
  expect(await action.lookup({ id: "r-1" }, { idempotencyKey: "op" })).toBeNull();
  expect(calls[0]!.init.method).toBe("GET");
  expect(calls[0]!.url).toBe("https://api.example.com/refunds/r-1");
});

test("validates bounded configuration at construction", () => {
  expect(() => createHttpAction({ url: "https://api.example.com", timeoutMs: 0 })).toThrow("timeoutMs");
  expect(() => createHttpAction({ url: "https://api.example.com", maxResponseBytes: -1 })).toThrow("maxResponseBytes");
});
test("composes with createExternalCommand without a second retry loop", async () => {
  const calls: string[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(`${init?.method ?? "GET"} ${String(input)}`);
    return init?.method === "POST"
      ? Response.json({ orderId: "o-1", refunded: true })
      : Response.json({ orderId: "o-1", refunded: true });
  }) as typeof fetch;
  const action = createHttpAction<{ orderId: string }>({
    url: "https://api.example.com/refunds",
    body: (input) => JSON.stringify(input),
    lookup: { url: (input) => `https://api.example.com/refunds/${input.orderId}` },
    fetch: fetchImpl,
  });
  const records = new Map<string, import("./store").StoredCommand>();
  const keyOf = (ref: import("./store").OperationReference) =>
    JSON.stringify([ref.tenantId, ref.actorId, ref.command, ref.operationId]);
  const store: import("./store").CommandStore<null> = {
    async transaction(run) {
      const pending = new Map(records);
      const value = await run({
        transaction: null,
        lock: async () => {},
        read: async (ref) => pending.get(keyOf(ref)) ?? null,
        insert: async (record) => { pending.set(keyOf(record.receipt), record); },
        confirm: async (ref, result) => {
          const record = pending.get(keyOf(ref));
          if (record !== undefined) {
            const receipt: DurableCommandReceipt<unknown> = {
              ...ref, dispatchKey: record.receipt.dispatchKey, status: "confirmed", audit: "pending", result,
            };
            record.receipt = receipt;
          }
        },
        markUnknown: async (ref) => {
          const record = pending.get(keyOf(ref));
          if (record !== undefined) {
            const receipt: DurableCommandReceipt<unknown> = {
              ...record.receipt, status: "unknown", audit: "pending",
            };
            record.receipt = receipt;
          }
        },
        audit: async () => {},
        completeAudit: async (ref) => {
          const record = pending.get(keyOf(ref));
          if (record !== undefined && record.receipt.status === "confirmed") {
            const receipt: DurableCommandReceipt<unknown> = {
              ...record.receipt, audit: "complete",
            };
            record.receipt = receipt;
          }
        },
      });
      records.clear();
      for (const [key, value] of pending) records.set(key, value);
      return value;
    },
  };
  const input = (value: unknown) => {
    if (value === null || typeof value !== "object" || !("orderId" in value)
      || typeof value.orderId !== "string") throw new TypeError("invalid");
    return { orderId: value.orderId };
  };
  const command = createExternalCommand({
    store,
    name: "refund",
    input,
    result: input,
    inputCodec: plaintextCommandInput,
    authorize: () => "allow",
    send: action.send,
    lookup: action.lookup,
    matches: (request, result) => request.orderId === result.orderId,
    audit: { event: "refunded", details: () => ({}) },
  });

  const receipt = await command.execute({ tenantId: "t", actorId: "a" }, "op-1", { orderId: "o-1" });
  expect(receipt).toMatchObject({ status: "confirmed", audit: "complete", result: { orderId: "o-1" } });
  expect(calls).toEqual([
    "POST https://api.example.com/refunds",
    "GET https://api.example.com/refunds/o-1",
  ]);
});
