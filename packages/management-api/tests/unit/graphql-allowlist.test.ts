import { expect, test } from "bun:test";
import {
  parseGraphqlAllowlistConfig,
  resolveAllowedGraphqlOperation,
  sha256Hex,
} from "../../src/utils/graphql-allowlist";

const document = "query Orders { ordersCollection { edges { node { id } } } }";
const other = "query Other { otherCollection { edges { node { id } } } }";

function config(mode: "off" | "enforce" = "enforce") {
  return parseGraphqlAllowlistConfig({
    mode,
    operations: [{ name: "Orders", sha256: sha256Hex(document), query: document }],
  })!;
}

test("parses and normalizes a bounded allowlist", () => {
  const parsed = config();
  expect(parsed.mode).toBe("enforce");
  expect(parsed.operations).toEqual([{
    name: "Orders", sha256: sha256Hex(document), query: document,
  }]);
  expect(parseGraphqlAllowlistConfig(undefined)).toBeNull();
  expect(() => parseGraphqlAllowlistConfig({ mode: "allow", operations: [] })).toThrow("mode");
  expect(() => parseGraphqlAllowlistConfig({ mode: "enforce", operations: [{ name: "x", sha256: "bad" }] })).toThrow("sha256");
});

test("resolves document hashes and rejects operation-name mismatches", () => {
  const allowlist = config();
  expect(resolveAllowedGraphqlOperation({ query: document }, allowlist))
    .toEqual({ query: document, operationName: "Orders" });
  expect(resolveAllowedGraphqlOperation({ query: other }, allowlist)).toBeNull();
  expect(resolveAllowedGraphqlOperation({ query: document, operationName: "Other" }, allowlist)).toBeNull();
});

test("supports persisted hashes only with a stored document", () => {
  expect(resolveAllowedGraphqlOperation({
    extensions: { persistedQuery: { version: 1, sha256Hash: sha256Hex(document) } },
  }, config())).toEqual({ query: document, operationName: "Orders" });

  const withoutQuery = parseGraphqlAllowlistConfig({
    mode: "enforce",
    operations: [{ name: "Orders", sha256: sha256Hex(document) }],
  })!;
  expect(resolveAllowedGraphqlOperation({
    extensions: { persistedQuery: { version: 1, sha256Hash: sha256Hex(document) } },
  }, withoutQuery)).toBeNull();
});

test("rejects a persisted hash paired with a different document and fails closed", () => {
  expect(resolveAllowedGraphqlOperation({
    query: other,
    extensions: { persistedQuery: { version: 1, sha256Hash: sha256Hex(document) } },
  }, config())).toBeNull();
  expect(resolveAllowedGraphqlOperation({ query: document }, config("off"))).toBeNull();
  expect(resolveAllowedGraphqlOperation({ query: document }, {
    mode: "enforce", operations: [],
  })).toBeNull();
});
