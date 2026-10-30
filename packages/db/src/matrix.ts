import type { DatabaseCatalog } from "./catalog.js";
import type { DatabaseModule } from "./module.js";
import { splitQualifiedName } from "./reconcile.js";

export type RoleMatrixOperation = "select" | "insert" | "update" | "delete";

export interface RoleMatrixOptions {
  /** Roles to report. Defaults to the standard Supabase-compatible roles. */
  roles?: readonly string[];
  /**
   * Roles that bypass RLS (for example service_role in a Supabase-compatible
   * database). This is an explicit input, not inferred from a role name.
   */
  bypassRlsRoles?: readonly string[];
}

export interface RoleMatrixCell {
  table: string;
  role: string;
  operation: RoleMatrixOperation;
  rlsEnabled: boolean;
  /** A policy for this table/operation applies to the role (including PUBLIC policies). */
  policy: boolean;
  /** A table privilege for this operation is granted to the role (including PUBLIC grants). */
  granted: boolean;
  /** A PUBLIC grant contributes to this cell. */
  publicGrant: boolean;
  /** The role bypasses RLS, so the grant is effective without a policy. */
  bypassRls: boolean;
  /** The privilege is actually usable under RLS. */
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
  roles: string[];
  rows: RoleMatrixCell[];
  issues: RoleMatrixIssue[];
  ok: boolean;
}

export const DEFAULT_ROLE_MATRIX_ROLES = ["anon", "authenticated", "service_role"] as const;
export const ROLE_MATRIX_OPERATIONS: readonly RoleMatrixOperation[] = [
  "select", "insert", "update", "delete",
] as const;

const PRIVILEGE_BY_OPERATION: Record<RoleMatrixOperation, string> = {
  select: "SELECT",
  insert: "INSERT",
  update: "UPDATE",
  delete: "DELETE",
};

function normalizedRoles(options: RoleMatrixOptions): string[] {
  const roles = options.roles ?? DEFAULT_ROLE_MATRIX_ROLES;
  const normalized = roles.map((role) => role.trim()).filter(Boolean);
  if (normalized.some((role) => role === "PUBLIC")) {
    throw new TypeError("PUBLIC is not a concrete role; report concrete roles instead");
  }
  return [...new Set(normalized)];
}

function policyApplies(
  policy: DatabaseCatalog["policies"][number],
  role: string,
  operation: RoleMatrixOperation,
): boolean {
  if (policy.command !== "all" && policy.command !== operation) return false;
  return policy.roles.includes("PUBLIC") || policy.roles.includes(role);
}

function grantApplies(
  grant: DatabaseCatalog["grants"][number],
  schema: string,
  table: string,
  role: string,
  operation: RoleMatrixOperation,
): boolean {
  if (grant.objectSchema !== schema || grant.objectName !== table) return false;
  if (grant.privilege.toUpperCase() !== PRIVILEGE_BY_OPERATION[operation]
    && grant.privilege.toUpperCase() !== "ALL") return false;
  return grant.grantee === role || grant.grantee.toUpperCase() === "PUBLIC";
}

/**
 * Build a role x table x operation matrix from the PostgreSQL catalog.
 *
 * This is a read-only diagnostic. It never changes policies or grants, and it
 * does not replace RLS. A `yes` means the catalog currently shows a usable
 * privilege; it is not proof that a particular row is authorized.
 */
export function buildRoleMatrix(
  modules: readonly DatabaseModule[],
  catalog: DatabaseCatalog,
  options: RoleMatrixOptions = {},
): RoleMatrixReport {
  const roles = normalizedRoles(options);
  const bypass = new Set(options.bypassRlsRoles ?? []);
  const tables = [...new Set(modules.flatMap((module) => module.tables))];
  const rows: RoleMatrixCell[] = [];
  const issues: RoleMatrixIssue[] = [];

  for (const table of tables) {
    const [schema, name] = splitQualifiedName(table);
    const catalogTable = catalog.tables.find((candidate) => candidate.schema === schema && candidate.name === name);
    if (catalogTable === undefined) {
      issues.push({
        severity: "error",
        code: "missing-table",
        table,
        message: `归属表 ${table} 在 catalog 中不存在`,
      });
      continue;
    }

    const tablePolicies = catalog.policies.filter(
      (policy) => policy.schema === schema && policy.table === name,
    );
    if (catalogTable.rlsEnabled && tablePolicies.length === 0) {
      issues.push({
        severity: "warn",
        code: "rls-no-policy",
        table,
        message: `${table} 已启用 RLS 但没有任何策略；所有非 bypass 角色都会被默认拒绝`,
      });
    }
    if (!catalogTable.rlsEnabled) {
      issues.push({
        severity: "error",
        code: "rls-disabled",
        table,
        message: `${table} 未启用 RLS`,
      });
    }

    for (const operation of ROLE_MATRIX_OPERATIONS) {
      const publicGrant = catalog.grants.some((grant) =>
        grantApplies(grant, schema, name, "PUBLIC", operation)
        && grant.grantee.toUpperCase() === "PUBLIC",
      );
      if (publicGrant) {
        issues.push({
          severity: "error",
          code: "public-grant",
          table,
          operation,
          message: `${table} 的 ${operation.toUpperCase()} 权限授予了 PUBLIC`,
        });
      }

      for (const role of roles) {
        const policy = tablePolicies.some((candidate) => policyApplies(candidate, role, operation));
        const granted = catalog.grants.some((grant) =>
          grantApplies(grant, schema, name, role, operation),
        );
        const bypassRls = bypass.has(role);
        const effective = granted && (bypassRls || !catalogTable.rlsEnabled || policy);
        rows.push({
          table,
          role,
          operation,
          rlsEnabled: catalogTable.rlsEnabled,
          policy,
          granted,
          publicGrant,
          bypassRls,
          effective,
        });

        if (catalogTable.rlsEnabled && granted && !policy && !bypassRls) {
          issues.push({
            severity: "warn",
            code: "grant-without-policy",
            table,
            role,
            operation,
            message: `${role} 拥有 ${table} 的 ${operation.toUpperCase()} grant，但没有适用策略，实际会被 RLS 拒绝`,
          });
        }
        if (catalogTable.rlsEnabled && policy && !granted && !bypassRls) {
          issues.push({
            severity: "warn",
            code: "policy-without-grant",
            table,
            role,
            operation,
            message: `${role} 有 ${table} 的 ${operation.toUpperCase()} 策略，但缺少 grant，实际不可用`,
          });
        }
      }
    }
  }

  return {
    roles,
    rows,
    issues,
    ok: !issues.some((issue) => issue.severity === "error"),
  };
}

function cellLabel(cell: RoleMatrixCell): string {
  if (cell.effective) return cell.bypassRls ? "bypass" : "yes";
  if (cell.granted) return "grant";
  if (cell.policy) return "policy";
  return "-";
}

/**
 * Render a stable, text-friendly matrix for CLI output or review comments.
 * Legend: yes=effective, bypass=effective via explicit RLS bypass,
 * grant=privilege without a policy, policy=policy without a privilege, -=none.
 */
export function formatRoleMatrix(report: RoleMatrixReport): string {
  const header = ["table", "role", ...ROLE_MATRIX_OPERATIONS];
  const lines = [header.join("\t")];
  for (const row of report.rows) {
    const cells: string[] = [];
    for (const operation of ROLE_MATRIX_OPERATIONS) {
      const cell = report.rows.find((candidate) =>
        candidate.table === row.table
        && candidate.role === row.role
        && candidate.operation === operation,
      );
      cells.push(cell === undefined ? "-" : cellLabel(cell));
    }
    lines.push([row.table, row.role, ...cells].join("\t"));
  }
  if (report.issues.length > 0) {
    lines.push("");
    lines.push("issues:");
    for (const issue of report.issues) {
      const target = issue.role === undefined
        ? issue.table
        : `${issue.table}/${issue.role}${issue.operation === undefined ? "" : `/${issue.operation}`}`;
      lines.push(`${issue.severity}\t${issue.code}\t${target}\t${issue.message}`);
    }
  }
  return lines.join("\n");
}