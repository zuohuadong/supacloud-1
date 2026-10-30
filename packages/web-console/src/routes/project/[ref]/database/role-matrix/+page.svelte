<script lang="ts">
  import { page } from "$app/state";
  import { untrack } from "svelte";
  import { t } from "svelte-i18n";
  import { AlertTriangle, Loader2, RefreshCw, ShieldCheck } from "lucide-svelte";
  import { apiClient } from "$lib/api";

  type Operation = "select" | "insert" | "update" | "delete";
  interface Cell {
    table: string;
    role: string;
    operation: Operation;
    rlsEnabled: boolean;
    policy: boolean;
    granted: boolean;
    publicGrant: boolean;
    bypassRls: boolean;
    effective: boolean;
  }
  interface Issue {
    severity: "error" | "warn";
    code: string;
    table: string;
    role?: string;
    operation?: Operation;
    message: string;
  }
  interface Report {
    schema: string;
    roles: string[];
    rows: Cell[];
    issues: Issue[];
    ok: boolean;
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }

  const operations: Operation[] = ["select", "insert", "update", "delete"];
  const projectRef = $derived(page.params.ref);
  const pageSize = 50;
  let schema = $state("public");
  let roles = $state("anon,authenticated,service_role");
  let tables = $state("");
  let offset = $state(0);
  let report = $state<Report | null>(null);
  let loading = $state(false);
  let error = $state("");

  function visibleTableCount(): number {
    return new Set(report?.rows.map((row) => row.table) ?? []).size;
  }

  function cell(row: Cell): string {
    if (row.effective) return row.bypassRls ? $t("RoleMatrix.bypass") : $t("RoleMatrix.effective");
    if (row.granted) return $t("RoleMatrix.grant_only");
    if (row.policy) return $t("RoleMatrix.policy_only");
    return "—";
  }

  function cellClass(row: Cell): string {
    if (row.effective) return "text-emerald-600 font-semibold";
    if (row.granted || row.policy) return "text-amber-600";
    return "text-muted-foreground/50";
  }

  async function load() {
    if (!projectRef) return;
    loading = true;
    error = "";
    try {
      const params = new URLSearchParams({
        schema: schema.trim() || "public",
        roles: roles.trim(),
        limit: String(pageSize),
        offset: String(offset),
      });
      if (tables.trim()) params.set("tables", tables.trim());
      const response = await apiClient(`/v1/projects/${projectRef}/database/role-matrix?${params.toString()}`);
      const payload = await response.json() as Report & { message?: string };
      if (!response.ok) throw new Error(payload.message || $t("RoleMatrix.load_failed"));
      report = payload;
    } catch (cause) {
      report = null;
      error = cause instanceof Error ? cause.message : $t("RoleMatrix.load_failed");
    } finally {
      loading = false;
    }
  }

  function resetAndLoad() {
    offset = 0;
    void load();
  }

  $effect(() => {
    void projectRef;
    untrack(() => { void load(); });
  });
</script>

<svelte:head>
  <title>{$t("RoleMatrix.title")} | SupaCloud</title>
</svelte:head>

<div class="h-full space-y-5">
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
        <ShieldCheck class="h-4 w-4" />
        {$t("RoleMatrix.eyebrow")}
      </div>
      <h1 class="text-2xl font-bold tracking-tight">{$t("RoleMatrix.title")}</h1>
      <p class="mt-1 max-w-2xl text-sm text-muted-foreground">{$t("RoleMatrix.subtitle")}</p>
    </div>
    <button onclick={resetAndLoad} disabled={loading}
      class="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50">
      {#if loading}<Loader2 class="h-3.5 w-3.5 animate-spin" />{:else}<RefreshCw class="h-3.5 w-3.5" />{/if}
      {$t("RoleMatrix.refresh")}
    </button>
  </div>

  <div class="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
    <label class="block text-xs">
      <span class="mb-1.5 block font-medium text-muted-foreground">{$t("RoleMatrix.schema")}</span>
      <input bind:value={schema} class="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-brand" />
    </label>
    <label class="block text-xs">
      <span class="mb-1.5 block font-medium text-muted-foreground">{$t("RoleMatrix.roles")}</span>
      <input bind:value={roles} class="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-brand" />
    </label>
    <label class="block text-xs">
      <span class="mb-1.5 block font-medium text-muted-foreground">{$t("RoleMatrix.tables")}</span>
      <input bind:value={tables} placeholder={$t("RoleMatrix.tables_hint")}
        class="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-brand" />
    </label>
  </div>

  {#if error}
    <div class="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700">{error}</div>
  {:else if loading && !report}
    <div class="flex items-center justify-center py-20 text-muted-foreground"><Loader2 class="h-6 w-6 animate-spin" /></div>
  {:else if report}
    <div class="overflow-hidden rounded-lg border bg-card">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[44rem] text-left text-xs">
          <thead class="border-b bg-muted/30 text-muted-foreground">
            <tr>
              <th class="px-4 py-2.5 font-semibold">{$t("RoleMatrix.table")}</th>
              <th class="px-4 py-2.5 font-semibold">{$t("RoleMatrix.role")}</th>
              {#each operations as operation (operation)}
                <th class="px-3 py-2.5 text-center font-semibold uppercase">{operation}</th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40">
            {#each report.roles as role (role)}
              {#each report.rows.filter((row) => row.role === role) as row (row.table)}
                <tr class="hover:bg-muted/20">
                  <td class="px-4 py-2.5 font-mono">{row.table}</td>
                  <td class="px-4 py-2.5 font-mono">{row.role}</td>
                  {#each operations as operation (operation)}
                    {@const current = report.rows.find((candidate) => candidate.table === row.table && candidate.role === role && candidate.operation === operation)}
                    <td class="px-3 py-2.5 text-center {current ? cellClass(current) : ''}">{current ? cell(current) : "—"}</td>
                  {/each}
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
      <div class="flex flex-wrap items-center gap-3">
        <span><strong class="text-emerald-600">{$t("RoleMatrix.effective")}</strong> = {$t("RoleMatrix.effective_hint")}</span>
        <span><strong class="text-amber-600">{$t("RoleMatrix.grant_only")}</strong> = {$t("RoleMatrix.grant_hint")}</span>
        <span><strong class="text-amber-600">{$t("RoleMatrix.policy_only")}</strong> = {$t("RoleMatrix.policy_hint")}</span>
      </div>
      <div class="flex items-center gap-2">
        <span>{report.total === 0 ? 0 : report.offset + 1}-{report.offset + visibleTableCount()} / {report.total}</span>
        <button onclick={() => { offset = Math.max(0, offset - pageSize); void load(); }} disabled={loading || offset === 0}
          class="rounded-md border bg-background px-2 py-1 font-semibold hover:bg-muted disabled:opacity-40">
          {$t("RoleMatrix.prev")}
        </button>
        <button onclick={() => { offset += pageSize; void load(); }} disabled={loading || !report.hasMore}
          class="rounded-md border bg-background px-2 py-1 font-semibold hover:bg-muted disabled:opacity-40">
          {$t("RoleMatrix.next")}
        </button>
      </div>
    </div>
    {#if report.issues.length > 0}
      <section class="rounded-lg border bg-card">
        <div class="flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
          <AlertTriangle class="h-4 w-4 text-amber-500" />
          {$t("RoleMatrix.issues")} ({report.issues.length})
        </div>
        <ul class="divide-y text-xs">
          {#each report.issues as issue}
            <li class="flex flex-wrap items-start gap-2 px-4 py-2.5">
              <span class="rounded px-1.5 py-0.5 font-mono text-[10px] {issue.severity === 'error' ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'}">{issue.code}</span>
              <span class="font-mono text-muted-foreground">{issue.table}{issue.role ? ` / ${issue.role}` : ""}{issue.operation ? ` / ${issue.operation}` : ""}</span>
              <span class="flex-1">{issue.message}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</div>
