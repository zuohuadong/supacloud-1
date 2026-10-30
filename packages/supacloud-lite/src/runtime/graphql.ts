import type { Database } from './db/database.js'
import { ApiError, type RequestContext } from './types.js'
import { errorProperty, isRecord } from './validation.js'

export interface GraphqlCapability {
  status: 'supported' | 'unsupported' | 'disabled' | 'unverified'
  extension: 'pg_graphql'
  version?: string
  reason?: string
}

export interface GraphqlAllowedOperation {
  /** Operation name emitted by the compiler manifest. */
  name: string
  /** SHA-256 of the GraphQL printed document. */
  sha256: string
  /** Stored document, required when clients send only a persisted-query hash. */
  query?: string
}

export interface GraphqlOptions {
  /** true requires the extension at startup; false disables the endpoint; omitted auto-detects. */
  enabled?: boolean
  maxRequestBodyBytes?: number
  statementTimeoutMs?: number
  slowQueryThresholdMs?: number
  onRequest?: (metric: GraphqlRequestMetric) => void
  /** Optional persisted-operation allowlist. */
  allowedOperations?: readonly GraphqlAllowedOperation[]
  /** "enforce" rejects unlisted documents and supports APQ-style persisted hashes. */
  allowlist?: "off" | "enforce"
}

export interface GraphqlRequestMetric {
  operationName?: string
  status: number
  durationMs: number
  slow: boolean
}

type GraphqlProbe = { query(sql: string): Promise<{ rows: unknown[] }> }

export async function inspectGraphql(engine: GraphqlProbe): Promise<GraphqlCapability> {
  const result = await engine.query(`
    select e.extversion, exists (
      select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      join pg_depend d on d.classid = 'pg_proc'::regclass and d.objid = p.oid
        and d.refclassid = 'pg_extension'::regclass and d.refobjid = e.oid and d.deptype = 'e'
      where n.nspname = 'graphql' and p.proname = 'resolve' and not p.prosecdef
        and p.oid = to_regprocedure('graphql.resolve(text,jsonb,text,jsonb)')
    ) as resolver from pg_extension e where e.extname = 'pg_graphql'
  `)
  const row = result.rows[0]
  if (row === undefined) {
    return { status: 'unsupported', extension: 'pg_graphql', reason: 'PG_GRAPHQL_NOT_INSTALLED' }
  }
  if (!isRecord(row) || typeof row['extversion'] !== 'string' || !row['extversion'] ||
    typeof row['resolver'] !== 'boolean' || result.rows.length !== 1) {
    return { status: 'unsupported', extension: 'pg_graphql', reason: 'PG_GRAPHQL_INVALID_CATALOG' }
  }
  const version = row['extversion']
  if (row['resolver']) {
    try {
      // Load the real extension library too; a catalog entry alone cannot prove ABI availability.
      const probe = await engine.query(`select graphql.resolve('{ __typename }', '{}'::jsonb, null, '{}'::jsonb) as result`)
      const probeRow = probe.rows[0]
      if (probe.rows.length !== 1 || !isRecord(probeRow) || !isGraphqlEnvelope(probeRow['result'])) {
        throw new Error('Invalid GraphQL probe response')
      }
    } catch {
      return { status: 'unsupported', extension: 'pg_graphql', version, reason: 'PG_GRAPHQL_RESOLVER_FAILED' }
    }
  }
  return row['resolver']
    ? { status: 'supported', extension: 'pg_graphql', version }
    : { status: 'unsupported', extension: 'pg_graphql',
        reason: 'PG_GRAPHQL_RESOLVER_UNAVAILABLE' }
}

export class GraphqlHandler {
  readonly maxBytes: number
  readonly timeoutMs: number
  readonly slowQueryThresholdMs: number
  private readonly onRequest?: (metric: GraphqlRequestMetric) => void
  private readonly allowlistEnforced: boolean
  private readonly allowedOperations: readonly GraphqlAllowedOperation[]

  constructor(private db: Database, private capability: GraphqlCapability, options: GraphqlOptions = {}, private schemas = ['public']) {
    this.maxBytes = positive(options.maxRequestBodyBytes ?? 1024 * 1024)
    this.timeoutMs = positive(options.statementTimeoutMs ?? 30_000)
    this.slowQueryThresholdMs = positive(options.slowQueryThresholdMs ?? 1_000)
    this.onRequest = options.onRequest
    this.allowlistEnforced = options.allowlist === "enforce"
    this.allowedOperations = normalizeAllowedOperations(options.allowedOperations ?? [])
  }

  async handle(request: Request, context: RequestContext): Promise<Response> {
    const startedAt = performance.now()
    let operationName: string | undefined
    const finish = (result: Response): Response => {
      const durationMs = Math.round((performance.now() - startedAt) * 100) / 100
      this.onRequest?.({
        ...(operationName === undefined ? {} : { operationName }),
        status: result.status,
        durationMs,
        slow: durationMs >= this.slowQueryThresholdMs,
      })
      return result
    }
    if (this.capability.status !== 'supported') {
      return finish(response(this.capability.status === 'disabled' ? 404 : 501, {
        errors: [{ message: 'GraphQL requires the real pg_graphql extension and graphql.resolve.',
          extensions: { code: this.capability.reason ?? 'GRAPHQL_DISABLED' } }],
      }))
    }
    if (request.method !== 'POST') return finish(response(405, { errors: [{ message: 'Use POST for GraphQL requests.' }] }, { allow: 'POST' }))
    try {
      if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
        throw new ApiError(415, { message: 'GraphQL requests require application/json' })
      }
      const body: unknown = JSON.parse(await boundedBody(request, this.maxBytes))
      if (!isObject(body) ||
        (body.query != null && typeof body.query !== 'string') ||
        (body.variables != null && !isObject(body.variables)) ||
        (body.extensions != null && !isObject(body.extensions)) ||
        (body.operationName != null && typeof body.operationName !== 'string')) {
        throw new ApiError(400, { message: 'Invalid GraphQL request' })
      }
      let document = typeof body.query === 'string' && body.query.trim() ? body.query : undefined
      operationName = body.operationName ?? undefined
      if (this.allowlistEnforced) {
        const resolved = await resolveAllowedGraphqlOperation({
          ...(document === undefined ? {} : { query: document }),
          ...(operationName === undefined ? {} : { operationName }),
          ...(isObject(body.extensions) ? { extensions: body.extensions } : {}),
        }, this.allowedOperations)
        if (resolved === null) {
          throw new ApiError(403, {
            message: 'GraphQL operation is not in the published allowlist',
            extensions: { code: 'GRAPHQL_OPERATION_NOT_ALLOWED' },
          })
        }
        document = resolved.query
        operationName = resolved.operationName ?? operationName
      }
      if (document === undefined) throw new ApiError(400, { message: 'Invalid GraphQL request' })
      const result = await this.db.withContext(context, async (query) => {
        await query<unknown>(`select set_config('statement_timeout', $1, true)`, [String(this.timeoutMs)])
        await query<unknown>(`select set_config('search_path', $1, true)`, [
          this.schemas.map((schema) => `"${schema.replaceAll('"', '""')}"`).join(','),
        ])
        return query<unknown>(
          'select graphql.resolve($1::text, $2::jsonb, $3::text, $4::jsonb) as result',
          [document, JSON.stringify(body.variables ?? {}), operationName ?? null, JSON.stringify(body.extensions ?? {})]
        )
      })
      const row = result.rows[0]
      if (result.rows.length !== 1 || !isRecord(row) || !isGraphqlEnvelope(row['result'])) {
        throw new Error('Invalid GraphQL resolver response')
      }
      return finish(response(200, row['result']))
    } catch (error) {
      if (error instanceof ApiError) return finish(response(error.status, {
        errors: [{
          message: error.message,
          ...(isObject(error.body.extensions) ? { extensions: error.body.extensions } : {}),
        }],
      }))
      if (error instanceof SyntaxError) return finish(response(400, { errors: [{ message: 'Invalid JSON request' }] }))
      // Never return SQL, connection details or database exception text to callers.
      const code = errorProperty(error, 'errno') ?? errorProperty(error, 'code')
      const status = code === '42501' ? 403 : code === '57014' ? 504 : 500
      return finish(response(status, { errors: [{ message: 'GraphQL execution failed',
        extensions: { code: status === 403 ? 'GRAPHQL_ACCESS_DENIED' : status === 504 ? 'GRAPHQL_TIMEOUT' : 'GRAPHQL_EXECUTION_FAILED' } }] })
      )
    }
  }
}

export interface GraphqlAllowlistRequest {
  query?: string
  operationName?: string
  extensions?: Record<string, unknown>
}

/**
 * Resolve an allowlisted operation from either the document body or an
 * APQ-style sha256 hash. The hash is always checked against the exact document
 * bytes; an operationName alone is never sufficient.
 */
export async function resolveAllowedGraphqlOperation(
  request: GraphqlAllowlistRequest,
  allowed: readonly GraphqlAllowedOperation[],
): Promise<{ query: string; operationName?: string } | null> {
  if (allowed.length === 0) return null
  const persistedHash = persistedQueryHash(request.extensions)
  let entry: GraphqlAllowedOperation | undefined
  if (persistedHash !== undefined) {
    entry = allowed.find((candidate) => candidate.sha256 === persistedHash)
    if (entry === undefined) return null
  }
  if (request.query !== undefined) {
    const queryHash = await sha256Hex(request.query)
    if (entry !== undefined && entry.sha256 !== queryHash) return null
    entry ??= allowed.find((candidate) => candidate.sha256 === queryHash)
  }
  if (entry === undefined) return null
  if (request.operationName !== undefined && request.operationName !== entry.name) return null
  const query = request.query ?? entry.query
  if (query === undefined || query.trim() === "") return null
  return {
    query,
    ...(entry.name === undefined ? {} : { operationName: entry.name }),
  }
}

export async function sha256Hex(value: string): Promise<string> {
  // Bun's native hasher avoids the per-call async overhead of SubtleCrypto on
  // the request hot path. Browser/other runtimes keep the Web Crypto fallback.
  const bun = (globalThis as {
    Bun?: { CryptoHasher: new (algorithm: string) => { update(data: string): void; digest(encoding: 'hex'): string } }
  }).Bun
  if (bun !== undefined) {
    const hasher = new bun.CryptoHasher('sha256')
    hasher.update(value)
    return hasher.digest('hex')
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function persistedQueryHash(extensions: Record<string, unknown> | undefined): string | undefined {
  const persisted = extensions?.['persistedQuery']
  if (!isRecord(persisted)) return undefined
  const hash = persisted['sha256Hash']
  if (typeof hash !== 'string' || !/^[a-f0-9]{64}$/i.test(hash)) return undefined
  return hash.toLowerCase()
}

function normalizeAllowedOperations(entries: readonly GraphqlAllowedOperation[]): readonly GraphqlAllowedOperation[] {
  const byHash = new Map<string, GraphqlAllowedOperation>()
  for (const entry of entries) {
    if (typeof entry.name !== 'string' || entry.name.trim() === '') {
      throw new Error('GraphQL allowlist entries require a non-empty operation name')
    }
    if (typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(entry.sha256)) {
      throw new Error('GraphQL allowlist entries require a lowercase sha256 hash')
    }
    if (entry.query !== undefined && (typeof entry.query !== 'string' || entry.query.trim() === '')) {
      throw new Error('GraphQL allowlist query must be a non-empty string')
    }
    const sha256 = entry.sha256.toLowerCase()
    const previous = byHash.get(sha256)
    if (previous !== undefined && previous.name !== entry.name) {
      throw new Error('GraphQL allowlist cannot map one document hash to multiple operation names')
    }
    byHash.set(sha256, { ...entry, sha256 })
  }
  return [...byHash.values()]
}

async function boundedBody(request: Request, limit: number): Promise<string> {
  if (Number(request.headers.get('content-length')) > limit) throw new ApiError(413, { message: 'GraphQL request too large' })
  const reader = request.body?.getReader()
  if (!reader) throw new ApiError(400, { message: 'GraphQL request body required' })
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      size += chunk.value.byteLength
      if (size > limit) {
        await reader.cancel().catch(() => {})
        throw new ApiError(413, { message: 'GraphQL request too large' })
      }
      chunks.push(chunk.value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks).toString('utf8')
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
function isGraphqlEnvelope(value: unknown): boolean {
  if (!isRecord(value) || (!('data' in value) && !('errors' in value))) return false
  if ('data' in value && value['data'] !== null && !isRecord(value['data'])) return false
  if ('extensions' in value && !isRecord(value['extensions'])) return false
  if ('errors' in value) {
    const errors: unknown = value['errors']
    if (!Array.isArray(errors) || errors.length === 0 ||
      !errors.every((error: unknown) => isRecord(error) && typeof error['message'] === 'string')) return false
  }
  return true
}
function positive(value: number): number {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) throw new Error('GraphQL limits must be positive bounded integers')
  return value
}
function response(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { 'cache-control': 'no-store', ...headers } })
}
