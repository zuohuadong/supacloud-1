import { expect, test } from "bun:test";
import { buildDatabaseRoleMatrix } from "../../src/services/database-role-matrix.service";

const tables = [{ name: "orders", rls_enabled: true }];
const grants = [{ object_name: "orders", privilege: "SELECT", grantee: "authenticated" }];
const roles = [{ rolname: "authenticated", rolbypassrls: false }, { rolname: "service_role", rolbypassrls: true }];

test("maps uppercase pg_policies commands and reports effective cells", () => {
  const report = buildDatabaseRoleMatrix("public", ["authenticated", "service_role"], tables, [{
    table: "orders", name: "orders_select", cmd: "SELECT", roles: ["authenticated"],
  }], grants, roles);
  expect(report.rows.find((row) => row.role === "authenticated" && row.operation === "select"))
    .toMatchObject({ policy: true, granted: true, effective: true });
  expect(report.rows.find((row) => row.role === "authenticated" && row.operation === "insert"))
    .toMatchObject({ policy: false, granted: false, effective: false });
});

test("treats PUBLIC policies and grants as applicable and flags them", () => {
  const report = buildDatabaseRoleMatrix("public", ["anon"], tables, [{
    table: "orders", name: "orders_select", cmd: "SELECT", roles: "{public}",
  }], [{ object_name: "orders", privilege: "SELECT", grantee: "PUBLIC" }], [
    { rolname: "anon", rolbypassrls: false },
  ]);
  expect(report.rows.find((row) => row.role === "anon" && row.operation === "select"))
    .toMatchObject({ policy: true, granted: true, publicGrant: true, effective: true });
  expect(report.issues.map((issue) => issue.code)).toContain("public-grant");
});

test("reports grant-only and policy-only cells and bypass roles", () => {
  const grantOnly = buildDatabaseRoleMatrix("public", ["authenticated"], tables, [], grants, roles);
  expect(grantOnly.issues.map((issue) => issue.code)).toContain("grant-without-policy");
  expect(grantOnly.rows[0]).toMatchObject({ granted: true, policy: false, effective: false });

  const policyOnly = buildDatabaseRoleMatrix("public", ["authenticated"], tables, [{
    table: "orders", name: "orders_select", cmd: "SELECT", roles: ["authenticated"],
  }], [], roles);
  expect(policyOnly.issues.map((issue) => issue.code)).toContain("policy-without-grant");

  const bypass = buildDatabaseRoleMatrix("public", ["service_role"], tables, [], [
    { object_name: "orders", privilege: "ALL", grantee: "service_role" },
  ], roles);
  expect(bypass.rows.find((row) => row.role === "service_role" && row.operation === "delete"))
    .toMatchObject({ granted: true, bypassRls: true, effective: true });
});
