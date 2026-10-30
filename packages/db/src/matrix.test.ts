import { describe, expect, test } from "bun:test";
import type { DatabaseCatalog } from "./catalog.js";
import { buildRoleMatrix, formatRoleMatrix } from "./matrix.js";
import { defineDatabaseModule } from "./module.js";

const orders = defineDatabaseModule({
  name: "orders",
  tables: ["public.orders"],
  policies: [
    {
      name: "orders_select",
      table: "public.orders",
      operation: "select",
      roles: ["authenticated"],
      source: "db/policies/orders_select.sql",
      tests: ["db/tests/orders_select.sql"],
    },
  ],
  grants: [
    { object: "public.orders", privilege: "SELECT", role: "authenticated", source: "db/grants.sql" },
  ],
});

function catalog(overrides: Partial<DatabaseCatalog> = {}): DatabaseCatalog {
  return {
    tables: [{ schema: "public", name: "orders", rlsEnabled: true, rlsForced: false }],
    policies: [
      {
        schema: "public",
        table: "orders",
        name: "orders_select",
        command: "select",
        roles: ["authenticated"],
      },
    ],
    functions: [],
    triggers: [],
    grants: [
      {
        objectSchema: "public",
        objectName: "orders",
        privilege: "SELECT",
        grantee: "authenticated",
      },
    ],
    ...overrides,
  };
}

function cells(report: ReturnType<typeof buildRoleMatrix>, role: string, operation: string) {
  return report.rows.find((row) => row.role === role && row.operation === operation);
}

describe("buildRoleMatrix", () => {
  test("reports effective, policy-only and grant-only cells", () => {
    const report = buildRoleMatrix([orders], catalog(), {
      roles: ["anon", "authenticated"],
    });
    expect(report.ok).toBe(true);
    expect(cells(report, "authenticated", "select")).toMatchObject({
      policy: true,
      granted: true,
      effective: true,
    });
    expect(cells(report, "authenticated", "insert")).toMatchObject({
      policy: false,
      granted: false,
      effective: false,
    });
    expect(cells(report, "anon", "select")).toMatchObject({
      policy: false,
      granted: false,
      effective: false,
    });
  });

  test("detects PUBLIC grants and grant-without-policy", () => {
    const report = buildRoleMatrix([orders], catalog({
      grants: [
        { objectSchema: "public", objectName: "orders", privilege: "SELECT", grantee: "PUBLIC" },
        { objectSchema: "public", objectName: "orders", privilege: "UPDATE", grantee: "authenticated" },
      ],
    }), { roles: ["anon", "authenticated"] });
    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toContain("public-grant");
    expect(report.issues.map((issue) => issue.code)).toContain("grant-without-policy");
    expect(cells(report, "authenticated", "update")).toMatchObject({
      granted: true,
      policy: false,
      effective: false,
    });
  });

  test("detects policy-without-grant and RLS disabled", () => {
    const noGrant = buildRoleMatrix([orders], catalog({ grants: [] }), { roles: ["authenticated"] });
    expect(noGrant.issues.map((issue) => issue.code)).toContain("policy-without-grant");
    expect(cells(noGrant, "authenticated", "select")).toMatchObject({
      granted: false,
      policy: true,
      effective: false,
    });

    const noRls = buildRoleMatrix([orders], catalog({
      tables: [{ schema: "public", name: "orders", rlsEnabled: false, rlsForced: false }],
    }), { roles: ["authenticated"] });
    expect(noRls.ok).toBe(false);
    expect(noRls.issues.map((issue) => issue.code)).toContain("rls-disabled");
    expect(cells(noRls, "authenticated", "select")).toMatchObject({ effective: true });
  });

  test("honors an explicit RLS bypass role", () => {
    const report = buildRoleMatrix([orders], catalog({
      grants: [{ objectSchema: "public", objectName: "orders", privilege: "ALL", grantee: "service_role" }],
    }), { roles: ["service_role"], bypassRlsRoles: ["service_role"] });
    const reportCell = cells(report, "service_role", "delete");
    expect(reportCell).toMatchObject({ granted: true, policy: false, bypassRls: true, effective: true });
    expect(report.issues.some((issue) => issue.code === "grant-without-policy")).toBe(false);
  });

  test("reports missing tables and rejects PUBLIC as a concrete role", () => {
    const missing = buildRoleMatrix([orders], catalog({ tables: [] }), { roles: ["authenticated"] });
    expect(missing.issues).toContainEqual(expect.objectContaining({ code: "missing-table" }));
    expect(() => buildRoleMatrix([orders], catalog(), { roles: ["PUBLIC"] })).toThrow("PUBLIC");
  });

  test("formats a stable review table with a legend", () => {
    const text = formatRoleMatrix(buildRoleMatrix([orders], catalog(), {
      roles: ["anon", "authenticated"],
    }));
    expect(text).toContain("table\trole\tselect\tinsert\tupdate\tdelete");
    expect(text).toContain("public.orders\tauthenticated\tyes\t-\t-\t-");
    expect(text).toContain("public.orders\tanon\t-\t-\t-\t-");
  });
});