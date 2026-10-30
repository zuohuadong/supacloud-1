import type { ExternalDispatch } from "./external";

/**
 * Typed HTTP adapter for an external action.
 *
 * This is intentionally not a GraphQL resolver. It provides the transport
 * contract that a Command/Function can compose with `createExternalCommand`:
 * stable request shape, idempotency key propagation, bounded timeout/body,
 * protocol/host allowlisting and response parsing.
 *
 * DNS resolution and redirect re-validation are not implemented here because
 * this package has no Node-only dependency. Inject a hardened fetch (for
 * example the Management API's safeOutboundFetch) when the target is not a
 * fixed, pre-validated host. The adapter disables automatic redirect following.
 */

export type HttpActionMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpActionUrl<Input> = string | ((input: Input, dispatch: ExternalDispatch) => string);
export type HttpActionHeaders<Input> =
  | Record<string, string>
  | ((input: Input, dispatch: ExternalDispatch) => Record<string, string> | undefined);
export type HttpActionBody<Input> =
  (input: Input, dispatch: ExternalDispatch) => string | Uint8Array | undefined;

export interface HttpActionLookup<Input> {
  /** URL used for read-only reconciliation. */
  url: HttpActionUrl<Input>;
  /** Defaults to GET. */
  method?: HttpActionMethod;
  headers?: HttpActionHeaders<Input>;
  /** Statuses that mean "no remote record yet". Defaults to [404]. */
  notFoundStatuses?: readonly number[];
}

export interface HttpActionOptions<Input> {
  /** Fixed URL or a function of the validated input. */
  url: HttpActionUrl<Input>;
  /** Defaults to POST. */
  method?: HttpActionMethod;
  headers?: HttpActionHeaders<Input>;
  /** Returned value must already be encoded (for example JSON.stringify). */
  body?: HttpActionBody<Input>;
  /** Total request deadline. Defaults to 30 seconds. */
  timeoutMs?: number;
  /** Buffered response cap. Defaults to 1 MiB. */
  maxResponseBytes?: number;
  /** Optional exact host/host:port allowlist. */
  allowedHosts?: readonly string[];
  /** Permit HTTP only for loopback hosts. HTTPS is always required otherwise. */
  allowInsecureHttp?: boolean;
  /** Header used for the durable dispatch key. Defaults to idempotency-key; null disables it. */
  idempotencyHeader?: string | null;
  /** Injected transport. Use a hardened fetch for untrusted destinations. */
  fetch?: typeof fetch;
  /** Response parser. Defaults to JSON.parse for non-empty bodies. */
  parse?: (body: string, response: Response) => unknown;
  /** Optional read-only reconciliation request. Without it lookup returns null. */
  lookup?: HttpActionLookup<Input>;
  /**
   * HTTP statuses that prove the remote rejected the write before any effect.
   * Leave empty unless the provider contract is explicit; a 401/403/409 can
   * still be returned after a write was applied.
   */
  definitiveRejectionStatuses?: readonly number[];
}

export type HttpActionErrorCode =
  | "HTTP_ACTION_URL_INVALID"
  | "HTTP_ACTION_URL_NOT_ALLOWED"
  | "HTTP_ACTION_REQUEST_INVALID"
  | "HTTP_ACTION_TIMEOUT"
  | "HTTP_ACTION_ABORTED"
  | "HTTP_ACTION_NETWORK"
  | "HTTP_ACTION_STATUS"
  | "HTTP_ACTION_RESPONSE_TOO_LARGE"
  | "HTTP_ACTION_INVALID_RESPONSE";

export class HttpActionError extends Error {
  readonly code: HttpActionErrorCode;
  readonly status: number | undefined;
  readonly retryable: boolean;

  constructor(
    code: HttpActionErrorCode,
    message: string,
    options: { status?: number; retryable?: boolean; cause?: unknown } = {},
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "HttpActionError";
    this.code = code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}

export interface HttpActionAdapter<Input> {
  /** Dispatch once. Never retried by this adapter; the durable command owns ambiguity. */
  send(input: Input, dispatch: ExternalDispatch): Promise<unknown>;
  /** Read-only reconciliation. Returns null when no lookup is configured or the remote has no record. */
  lookup(input: Input, dispatch: ExternalDispatch): Promise<unknown | null>;
  /**
   * Explicit provider-rejection classifier. Defaults to false for every error;
   * configure `definitiveRejectionStatuses` only when the provider contract
   * guarantees no effect was applied.
   */
  isDefinitiveWriteFailure(error: unknown): boolean;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RESPONSE_BYTES = 1_048_576;

export function createHttpAction<Input>(options: HttpActionOptions<Input>): HttpActionAdapter<Input> {
  const timeoutMs = positiveInteger(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, "timeoutMs");
  const maxResponseBytes = positiveInteger(
    options.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES,
    "maxResponseBytes",
  );
  const allowedHosts = (options.allowedHosts ?? []).map((host) => host.trim().toLowerCase()).filter(Boolean);
  const idempotencyHeader = options.idempotencyHeader === undefined
    ? "idempotency-key"
    : options.idempotencyHeader;
  const fetchImpl = options.fetch ?? fetch;
  const parse = options.parse ?? parseJson;
  const definitiveStatuses = new Set(options.definitiveRejectionStatuses ?? []);
  const lookup = options.lookup;

  const request = async (
    input: Input,
    dispatch: ExternalDispatch,
    method: HttpActionMethod,
    rawUrl: string,
    headers: Headers | undefined,
    body: string | ArrayBuffer | undefined,
  ): Promise<{ response: Response; text: string }> => {
    if (dispatch.signal?.aborted) {
      throw new HttpActionError("HTTP_ACTION_ABORTED", "HTTP action was aborted", { retryable: true });
    }
    const url = assertSafeUrl(rawUrl, allowedHosts, options.allowInsecureHttp === true);
    const scope = abortScope(dispatch.signal, timeoutMs);
    try {
      const response = await fetchImpl(url.toString(), {
        method,
        ...(headers === undefined ? {} : { headers }),
        ...(body === undefined ? {} : { body }),
        signal: scope.controller.signal,
        redirect: "error",
      });
      const text = await readCapped(response, maxResponseBytes);
      return { response, text };
    } catch (error) {
      if (scope.timedOut()) {
        throw new HttpActionError("HTTP_ACTION_TIMEOUT", "HTTP action timed out", {
          retryable: true,
          cause: error,
        });
      }
      if (dispatch.signal?.aborted) {
        throw new HttpActionError("HTTP_ACTION_ABORTED", "HTTP action was aborted", {
          retryable: true,
          cause: error,
        });
      }
      if (error instanceof HttpActionError) throw error;
      throw new HttpActionError("HTTP_ACTION_NETWORK", "HTTP action request failed", {
        retryable: true,
        cause: error,
      });
    } finally {
      scope.cleanup();
    }
  };

  return {
    async send(input, dispatch) {
      const url = resolveUrl(options.url, input, dispatch);
      const headers = resolveHeaders(options.headers, input, dispatch);
      if (idempotencyHeader !== null && !headers.has(idempotencyHeader)) {
        headers.set(idempotencyHeader, dispatch.idempotencyKey);
      }
      let encoded: string | Uint8Array | undefined;
      try {
        encoded = options.body?.(input, dispatch);
      } catch (error) {
        throw new HttpActionError("HTTP_ACTION_REQUEST_INVALID", "HTTP action body resolver failed", { cause: error });
      }
      const body = encoded instanceof Uint8Array ? new Uint8Array(encoded).buffer : encoded;
      if (body !== undefined && !headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
      const method = options.method ?? "POST";
      const { response, text } = await request(input, dispatch, method, url, headers, body);
      if (!response.ok) {
        throw new HttpActionError("HTTP_ACTION_STATUS", `HTTP action failed with status ${response.status}`, {
          status: response.status,
          retryable: response.status >= 500 || response.status === 429,
        });
      }
      return parseResponse(parse, text, response);
    },

    async lookup(input, dispatch) {
      if (lookup === undefined) return null;
      const url = resolveUrl(lookup.url, input, dispatch);
      const headers = resolveHeaders(lookup.headers, input, dispatch);
      const method = lookup.method ?? "GET";
      const { response, text } = await request(input, dispatch, method, url, headers, undefined);
      if ((lookup.notFoundStatuses ?? [404]).includes(response.status)) return null;
      if (!response.ok) {
        throw new HttpActionError("HTTP_ACTION_STATUS", `HTTP lookup failed with status ${response.status}`, {
          status: response.status,
          retryable: response.status >= 500 || response.status === 429,
        });
      }
      return parseResponse(parse, text, response);
    },

    isDefinitiveWriteFailure(error) {
      return error instanceof HttpActionError
        && error.code === "HTTP_ACTION_STATUS"
        && error.status !== undefined
        && definitiveStatuses.has(error.status);
    },
  };
}

function resolveUrl<Input>(
  value: HttpActionUrl<Input>,
  input: Input,
  dispatch: ExternalDispatch,
): string {
  try {
    return typeof value === "string" ? value : value(input, dispatch);
  } catch (error) {
    throw new HttpActionError("HTTP_ACTION_URL_INVALID", "HTTP action URL resolver failed", { cause: error });
  }
}

function resolveHeaders<Input>(
  value: HttpActionHeaders<Input> | undefined,
  input: Input,
  dispatch: ExternalDispatch,
): Headers {
  try {
    const source = typeof value === "function" ? value(input, dispatch) : value;
    return new Headers(source ?? {});
  } catch (error) {
    throw new HttpActionError("HTTP_ACTION_REQUEST_INVALID", "HTTP action headers are invalid", { cause: error });
  }
}

function assertSafeUrl(raw: string, allowedHosts: readonly string[], allowInsecureHttp: boolean): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch (error) {
    throw new HttpActionError("HTTP_ACTION_URL_INVALID", "HTTP action URL is invalid", { cause: error });
  }
  if (url.username || url.password) {
    throw new HttpActionError("HTTP_ACTION_URL_NOT_ALLOWED", "HTTP action URL must not embed credentials");
  }
  const loopback = isLoopbackHost(url.hostname);
  if (url.protocol !== "https:") {
    if (url.protocol !== "http:" || !allowInsecureHttp || !loopback) {
      throw new HttpActionError(
        "HTTP_ACTION_URL_NOT_ALLOWED",
        "HTTP action requires HTTPS; HTTP is only allowed for explicit loopback development",
      );
    }
  }
  if (allowedHosts.length > 0) {
    const hostname = url.hostname.toLowerCase();
    const host = url.host.toLowerCase();
    if (!allowedHosts.includes(hostname) && !allowedHosts.includes(host)) {
      throw new HttpActionError("HTTP_ACTION_URL_NOT_ALLOWED", `HTTP action host is not allowed: ${hostname}`);
    }
  }
  return url;
}

function isLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function abortScope(signal: AbortSignal | undefined, timeoutMs: number): {
  controller: AbortController;
  timedOut: () => boolean;
  cleanup: () => void;
} {
  const controller = new AbortController();
  let timedOut = false;
  if (signal?.aborted) controller.abort(signal.reason);
  const onAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort(new Error("HTTP action timeout"));
  }, timeoutMs);
  return {
    controller,
    timedOut: () => timedOut,
    cleanup: () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

async function readCapped(response: Response, maxBytes: number): Promise<string> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    await response.body?.cancel().catch(() => {});
    throw new HttpActionError(
      "HTTP_ACTION_RESPONSE_TOO_LARGE",
      `HTTP action response exceeds ${maxBytes} bytes`,
    );
  }
  if (response.body === null) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new HttpActionError(
          "HTTP_ACTION_RESPONSE_TOO_LARGE",
          `HTTP action response exceeds ${maxBytes} bytes`,
        );
      }
      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function parseResponse(
  parse: (body: string, response: Response) => unknown,
  body: string,
  response: Response,
): unknown {
  try {
    return parse(body, response);
  } catch (error) {
    if (error instanceof HttpActionError) throw error;
    throw new HttpActionError("HTTP_ACTION_INVALID_RESPONSE", "HTTP action response parser failed", {
      cause: error,
    });
  }
}

function parseJson(body: string): unknown {
  if (body.trim() === "") return null;
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new HttpActionError("HTTP_ACTION_INVALID_RESPONSE", "HTTP action response is not valid JSON", {
      cause: error,
    });
  }
}

function positiveInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${field} must be a positive integer`);
  }
  return value;
}