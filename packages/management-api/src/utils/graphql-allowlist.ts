import { createHash } from "node:crypto";

export interface GraphqlAllowedOperation {
  name: string;
  sha256: string;
  query?: string;
}

export interface GraphqlAllowlistConfig {
  mode: "off" | "enforce";
  operations: GraphqlAllowedOperation[];
}

const MAX_OPERATIONS = 5_000;
const MAX_QUERY_BYTES = 256 * 1024;

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Parse a project config value into a bounded allowlist. Invalid input is
 * rejected instead of being silently treated as "allow all".
 */
export function parseGraphqlAllowlistConfig(value: unknown): GraphqlAllowlistConfig | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("graphql_allowlist must be an object");
  }
  const record = value as Record<string, unknown>;
  if (record.mode !== "off" && record.mode !== "enforce") {
    throw new Error("graphql_allowlist.mode must be 'off' or 'enforce'");
  }
  if (!Array.isArray(record.operations)) {
    throw new Error("graphql_allowlist.operations must be an array");
  }
  if (record.operations.length > MAX_OPERATIONS) {
    throw new Error(`graphql_allowlist supports at most ${MAX_OPERATIONS} operations`);
  }
  const byHash = new Map<string, GraphqlAllowedOperation>();
  for (const candidate of record.operations) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error("graphql_allowlist operation entries must be objects");
    }
    const entry = candidate as Record<string, unknown>;
    if (typeof entry.name !== "string" || !/^[A-Za-z_][A-Za-z0-9_]{0,199}$/.test(entry.name)) {
      throw new Error("graphql_allowlist operation name is invalid");
    }
    if (typeof entry.sha256 !== "string" || !/^[a-fA-F0-9]{64}$/.test(entry.sha256)) {
      throw new Error("graphql_allowlist operation sha256 is invalid");
    }
    if (entry.query !== undefined && (typeof entry.query !== "string" || !entry.query.trim())) {
      throw new Error("graphql_allowlist operation query must be a non-empty string");
    }
    if (typeof entry.query === "string" && Buffer.byteLength(entry.query) > MAX_QUERY_BYTES) {
      throw new Error(`graphql_allowlist operation query exceeds ${MAX_QUERY_BYTES} bytes`);
    }
    const sha256 = entry.sha256.toLowerCase();
    const previous = byHash.get(sha256);
    if (previous && previous.name !== entry.name) {
      throw new Error("graphql_allowlist cannot map one hash to multiple operation names");
    }
    byHash.set(sha256, {
      name: entry.name,
      sha256,
      ...(typeof entry.query === "string" ? { query: entry.query } : {}),
    });
  }
  return { mode: record.mode, operations: [...byHash.values()] };
}

export interface GraphqlAllowlistRequest {
  query?: string;
  operationName?: string;
  extensions?: Record<string, unknown>;
}

/**
 * Resolve by document hash, or by an APQ-style persisted hash. A request with
 * a persisted hash must also use the same document when it sends both.
 */
export function resolveAllowedGraphqlOperation(
  request: GraphqlAllowlistRequest,
  config: GraphqlAllowlistConfig,
): { query: string; operationName?: string } | null {
  if (config.mode !== "enforce" || config.operations.length === 0) return null;
  const persistedHash = persistedQueryHash(request.extensions);
  let entry: GraphqlAllowedOperation | undefined;
  if (persistedHash !== undefined) {
    entry = config.operations.find((candidate) => candidate.sha256 === persistedHash);
    if (!entry) return null;
  }
  if (request.query !== undefined) {
    const queryHash = sha256Hex(request.query);
    if (entry !== undefined && entry.sha256 !== queryHash) return null;
    entry ??= config.operations.find((candidate) => candidate.sha256 === queryHash);
  }
  if (!entry) return null;
  if (request.operationName !== undefined && request.operationName !== entry.name) return null;
  const query = request.query ?? entry.query;
  if (query === undefined || !query.trim()) return null;
  return {
    query,
    ...(entry.name === undefined ? {} : { operationName: entry.name }),
  };
}

function persistedQueryHash(extensions: Record<string, unknown> | undefined): string | undefined {
  const persisted = extensions?.["persistedQuery"];
  if (!persisted || typeof persisted !== "object" || Array.isArray(persisted)) return undefined;
  const hash = (persisted as Record<string, unknown>)["sha256Hash"];
  if (typeof hash !== "string" || !/^[a-fA-F0-9]{64}$/.test(hash)) return undefined;
  return hash.toLowerCase();
}
