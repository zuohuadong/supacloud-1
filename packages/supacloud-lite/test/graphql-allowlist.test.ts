import { expect, test } from 'bun:test'
import { GraphqlHandler, resolveAllowedGraphqlOperation, sha256Hex, type GraphqlAllowedOperation } from '../src/runtime/graphql.js'
import type { Database } from '../src/runtime/db/database.js'
import type { RequestContext } from '../src/runtime/types.js'

const document = 'query Allowed { __typename }'
const otherDocument = 'query Other { __typename }'
const allowed: GraphqlAllowedOperation[] = [{
  name: 'Allowed',
  sha256: await sha256Hex(document),
  query: document,
}]

function handler(options: { allowlist?: 'off' | 'enforce'; allowed?: GraphqlAllowedOperation[] } = {}) {
  const calls: Array<{ sql: string; params: unknown[] | undefined }> = []
  const db = {
    withContext: async (_context: RequestContext, run: (query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>) => Promise<unknown>) =>
      run(async (sql, params) => {
        calls.push({ sql, params })
        if (sql.includes('graphql.resolve')) {
          return { rows: [{ result: { data: { ok: true } } }] }
        }
        return { rows: [] }
      }),
  } as unknown as Database
  return {
    calls,
    handler: new GraphqlHandler(db, { status: 'supported', extension: 'pg_graphql' }, {
      allowlist: options.allowlist ?? 'enforce',
      allowedOperations: options.allowed ?? allowed,
    }),
  }
}

function request(body: unknown) {
  return new Request('http://localhost/graphql/v1', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('accepts an exact allowlisted document and rejects an unlisted one before SQL', async () => {
  const accepted = handler()
  const ok = await accepted.handler.handle(request({ query: document, operationName: 'Allowed' }), {} as RequestContext)
  expect(ok.status).toBe(200)
  expect(await ok.json()).toEqual({ data: { ok: true } })
  expect(accepted.calls.some((call) => call.sql.includes('graphql.resolve'))).toBe(true)

  const rejected = handler()
  const denied = await rejected.handler.handle(request({ query: otherDocument }), {} as RequestContext)
  expect(denied.status).toBe(403)
  expect(await denied.json()).toMatchObject({
    errors: [{ extensions: { code: 'GRAPHQL_OPERATION_NOT_ALLOWED' } }],
  })
  expect(rejected.calls.some((call) => call.sql.includes('graphql.resolve'))).toBe(false)
})

test('requires the operation name to match the hashed document', async () => {
  const { handler: graphql } = handler()
  const response = await graphql.handle(request({ query: document, operationName: 'Other' }), {} as RequestContext)
  expect(response.status).toBe(403)
})

test('supports APQ-style persisted hashes only when the stored query exists', async () => {
  const { calls, handler: graphql } = handler()
  const response = await graphql.handle(request({
    extensions: { persistedQuery: { version: 1, sha256Hash: await sha256Hex(document) } },
  }), {} as RequestContext)
  expect(response.status).toBe(200)
  const resolve = calls.find((call) => call.sql.includes('graphql.resolve'))
  expect(resolve?.params?.[0]).toBe(document)

  const withoutStored = handler({
    allowed: [{ name: 'Allowed', sha256: await sha256Hex(document) }],
  })
  const missing = await withoutStored.handler.handle(request({
    extensions: { persistedQuery: { version: 1, sha256Hash: await sha256Hex(document) } },
  }), {} as RequestContext)
  expect(missing.status).toBe(403)
})

test('rejects a persisted hash paired with a tampered document', async () => {
  const { handler: graphql } = handler()
  const response = await graphql.handle(request({
    query: otherDocument,
    extensions: { persistedQuery: { version: 1, sha256Hash: await sha256Hex(document) } },
  }), {} as RequestContext)
  expect(response.status).toBe(403)
})

test('allowlist off preserves the previous document behavior', async () => {
  const { handler: graphql } = handler({ allowlist: 'off' })
  const response = await graphql.handle(request({ query: otherDocument }), {} as RequestContext)
  expect(response.status).toBe(200)
})

test('resolver checks both document bytes and operation identity', async () => {
  expect(await resolveAllowedGraphqlOperation({ query: document }, allowed))
    .toEqual({ query: document, operationName: 'Allowed' })
  expect(await resolveAllowedGraphqlOperation({ query: otherDocument }, allowed)).toBeNull()
  expect(await resolveAllowedGraphqlOperation({ query: document, operationName: 'Other' }, allowed)).toBeNull()
})
