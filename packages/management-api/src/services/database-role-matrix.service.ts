import type { SQL } from "bun";

export type RoleMatrixOperation = "select" | "insert" | "update" | "delete";

export interface RoleMatrixCell {
  table: string;
  role: string;
  operation: RoleMatrixOperation;
  rlsEnabled: boolean;
  policy: boolean;
  granted: boolean;
  publicGrant: boolean;
  bypassRls: boolean;
  effective: boolean;
}

export interface RoleMatrixIssue {
  severity: "error" | "warn";
  code: string;
  table: string;
  role?: string;
  operation?: RoleMatrixOperation;
  message: string;
}

export interface RoleMatrixReport {
  schema: string;
  roles: string[];
  rows: RoleMatrixCell[];
  issues: RoleMatrixIssue[];
  ok: boolean;
}

export interface RoleMatrixPage extends RoleMatrixReport {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface RoleMatrixQueryOptions {
  /** Restrict the matrix to these table names instead of the whole schema. */
  tables?: readonly string[];
  /** Page size, 1-200. Defaults to 100. */
  limit?: number;
  /** Zero-based row offset. Defaults to 0. */
  offset?: number;
}

const OPERATIONS: readonly RoleMatrixOperation[] = ["select", "insert", "update", "delete"];
const PRIVILEGE: Record<RoleMatrixOperation, string> = {
  select: "SELECT", insert: "INSERT", update: "UPDATE", delete: "DELETE",
};

export interface TableRow { name: string; rls_enabled: boolean }
export interface PolicyRow { table: string; name: string; cmd: string; roles: string[] | string }
export interface GrantRow { object_name: string; privilege: string; grantee: string }
export interface RoleRow { rolname: string; rolbypassrls: boolean }

export async function readDatabaseRoleMatrix(
  projectDb: SQL,
  schema: string,
  roles: readonly string[],
  options: RoleMatrixQueryOptions = {},
): Promise<RoleMatrixPage> {
  const limit = Math.min(200, Math.max(1, Math.floor(options.limit ?? 100)));
  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const selectedTables = options.tables?.length ? [...new Set(options.tables)] : null;

  const tableWhere = selectedTables
    ? projectDb`n.nspname = ${schema} AND c.relkind = 'r' AND c.relname = ANY(${projectDb.array(selectedTables, "TEXT")})`
    : projectDb`n.nspname = ${schema} AND c.relkind = 'r'`;

  const [countRows, tables] = await Promise.all([
    projectDb`
      SELECT COUNT(*)::int AS total
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE ${tableWhere}
    ` as Promise<Array<{ total: number }>>,
    projectDb`
      SELECT c.relname AS name, c.relrowsecurity AS rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE ${tableWhere}
      ORDER BY c.relname
      LIMIT ${limit} OFFSET ${offset}
    ` as Promise<TableRow[]>,
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const tableNames = tables.map((table) => table.name);
  const [policies, grants, roleRows] = await Promise.all([
    tableNames.length === 0
      ? Promise.resolve([] as PolicyRow[])
      : projectDb`
        SELECT tablename AS table, policyname AS name, cmd, roles
        FROM pg_policies
        WHERE schemaname = ${schema}
          AND tablename = ANY(${projectDb.array(tableNames, "TEXT")})
      ` as Promise<PolicyRow[]>,
    tableNames.length === 0
      ? Promise.resolve([] as GrantRow[])
      : projectDb`
        SELECT table_name AS object_name, privilege_type AS privilege, grantee
        FROM information_schema.role_table_grants
        WHERE table_schema = ${schema}
          AND table_name = ANY(${projectDb.array(tableNames, "TEXT")})
      ` as Promise<GrantRow[]>,
    projectDb`
      SELECT rolname, rolbypassrls
      FROM pg_roles
      WHERE rolname = ANY(${projectDb.array([...roles], "TEXT")})
    ` as Promise<RoleRow[]>,
  ]);

  return {
    ...buildDatabaseRoleMatrix(schema, roles, tables, policies, grants, roleRows),
    total,
    limit,
    offset,
    hasMore: offset + tables.length < total,
  };
}

export function buildDatabaseRoleMatrix(
  schema: string,
  roles: readonly string[],
  tables: readonly TableRow[],
  policies: readonly PolicyRow[],
  grants: readonly GrantRow[],
  roleRows: readonly RoleRow[],
): RoleMatrixReport {
  const bypass = new Set(roleRows.filter((row) => row.rolbypassrls).map((row) => row.rolname));
  const normalizedRoles = [...new Set(roles)];
  const rows: RoleMatrixCell[] = [];
  const issues: RoleMatrixIssue[] = [];

  for (const table of tables) {
    const tableName = `${schema}.${table.name}`;
    const tablePolicies = policies.filter((policy) => policy.table === table.name);
    if (!table.rls_enabled) {
      issues.push({
        severity: "error", code: "rls-disabled", table: tableName,
        message: `${tableName} 未启用 RLS`,
      });
    } else if (tablePolicies.length === 0) {
      issues.push({
        severity: "warn", code: "rls-no-policy", table: tableName,
        message: `${tableName} 已启用 RLS 但没有策略，所有非 bypass 角色都会被默认拒绝`,
      });
    }

    for (const operation of OPERATIONS) {
      const publicGrant = grants.some((grant) =>
        grant.object_name === table.name
        && grant.grantee.toUpperCase() === "PUBLIC"
        && (grant.privilege.toUpperCase() === PRIVILEGE[operation] || grant.privilege.toUpperCase() === "ALL"),
      );
      if (publicGrant) {
        issues.push({
          severity: "error", code: "public-grant", table: tableName, operation,
          message: `${tableName} 的 ${operation.toUpperCase()} 权限授予了 PUBLIC`,
        });
      }

      for (const role of normalizedRoles) {
        const policy = tablePolicies.some((candidate) => {
          const command = candidate.cmd.toLowerCase();
          return (command === operation || command === "all")
            && policyRoles(candidate).some((entry) => entry === "public" || entry === "PUBLIC" || entry === role);
        });
        const granted = grants.some((grant) =>
          grant.object_name === table.name
          && (grant.grantee === role || grant.grantee.toUpperCase() === "PUBLIC")
          && (grant.privilege.toUpperCase() === PRIVILEGE[operation] || grant.privilege.toUpperCase() === "ALL"),
        );
        const bypassRls = bypass.has(role);
        const effective = granted && (bypassRls || !table.rls_enabled || policy);
        rows.push({
          table: tableName, role, operation, rlsEnabled: table.rls_enabled,
          policy, granted, publicGrant, bypassRls, effective,
        });
        if (table.rls_enabled && granted && !policy && !bypassRls) {
          issues.push({
            severity: "warn", code: "grant-without-policy", table: tableName, role, operation,
            message: `${role} 拥有 ${tableName} 的 ${operation.toUpperCase()} grant，但没有适用策略，实际会被 RLS 拒绝`,
          });
        }
        if (table.rls_enabled && policy && !granted && !bypassRls) {
          issues.push({
            severity: "warn", code: "policy-without-grant", table: tableName, role, operation,
            message: `${role} 有 ${tableName} 的 ${operation.toUpperCase()} 策略，但缺少 grant，实际不可用`,
          });
        }
      }
    }
  }

  return {
    schema,
    roles: normalizedRoles,
    rows,
    issues,
    ok: !issues.some((issue) => issue.severity === "error"),
  };
}

function policyRoles(policy: PolicyRow): string[] {
  if (Array.isArray(policy.roles)) return policy.roles.map(String);
  if (typeof policy.roles === "string") {
    return policy.roles.replace(/^\{|\}$/g, "").split(",").map((value) => value.trim()).filter(Boolean);
  }
  return [];
}
