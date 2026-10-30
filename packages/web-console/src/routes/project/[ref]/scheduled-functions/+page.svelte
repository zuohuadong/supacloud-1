<script lang="ts">
  import { page } from "$app/state";
  import { t } from "svelte-i18n";
  import { CalendarClock, Loader2, Play, RefreshCw } from "lucide-svelte";
  import { apiClient } from "$lib/api";

  interface Schedule {
    id: string;
    name: string;
    slug: string;
    cron: string;
    method: "GET" | "POST";
    enabled: boolean;
    updated_at: string;
  }
  interface Run {
    id: string;
    scheduled_for: string;
    status: string;
    attempt: number;
    max_attempts: number;
    http_status: number | null;
    error: string | null;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
  }

  const projectRef = $derived(page.params.ref);
  let schedules = $state<Schedule[]>([]);
  let selectedId = $state<string | null>(null);
  let runs = $state<Run[]>([]);
  let loading = $state(false);
  let runsLoading = $state(false);
  let triggering = $state(false);
  let error = $state("");
  let runsError = $state("");

  const selected = $derived(schedules.find((schedule) => schedule.id === selectedId) ?? null);

  function statusClass(status: string): string {
    if (status === "succeeded") return "bg-emerald-500/10 text-emerald-700";
    if (status === "dead_lettered") return "bg-red-500/10 text-red-700";
    if (status === "retry_scheduled") return "bg-amber-500/10 text-amber-700";
    if (status === "running") return "bg-blue-500/10 text-blue-700";
    return "bg-muted text-muted-foreground";
  }

  function formatTime(value: string | null): string {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : value;
  }

  async function loadSchedules() {
    if (!projectRef) return;
    loading = true;
    error = "";
    try {
      const response = await apiClient(`/v1/projects/${projectRef}/scheduled-functions`);
      const payload = await response.json() as { schedules?: Schedule[]; error?: string };
      if (!response.ok) throw new Error(payload.error || $t("ScheduledFunctions.load_failed"));
      schedules = payload.schedules ?? [];
      if (!selectedId || !schedules.some((schedule) => schedule.id === selectedId)) {
        selectedId = schedules[0]?.id ?? null;
      }
      await loadRuns();
    } catch (cause) {
      schedules = [];
      error = cause instanceof Error ? cause.message : $t("ScheduledFunctions.load_failed");
    } finally {
      loading = false;
    }
  }

  async function loadRuns() {
    if (!projectRef || !selectedId) {
      runs = [];
      return;
    }
    runsLoading = true;
    runsError = "";
    try {
      const response = await apiClient(`/v1/projects/${projectRef}/scheduled-functions/${selectedId}/runs?limit=50`);
      const payload = await response.json() as { runs?: Run[]; error?: string };
      if (!response.ok) throw new Error(payload.error || $t("ScheduledFunctions.runs_failed"));
      runs = payload.runs ?? [];
    } catch (cause) {
      runs = [];
      runsError = cause instanceof Error ? cause.message : $t("ScheduledFunctions.runs_failed");
    } finally {
      runsLoading = false;
    }
  }

  async function selectSchedule(id: string) {
    selectedId = id;
    await loadRuns();
  }

  async function runNow() {
    if (!projectRef || !selectedId) return;
    triggering = true;
    runsError = "";
    try {
      const response = await apiClient(`/v1/projects/${projectRef}/scheduled-functions/${selectedId}/trigger`, { method: "POST" });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || $t("ScheduledFunctions.trigger_failed"));
      await loadRuns();
    } catch (cause) {
      runsError = cause instanceof Error ? cause.message : $t("ScheduledFunctions.trigger_failed");
    } finally {
      triggering = false;
    }
  }

  $effect(() => {
    void projectRef;
    void loadSchedules();
  });
</script>

<svelte:head>
  <title>{$t("ScheduledFunctions.title")} | SupaCloud</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-5">
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
        <CalendarClock class="h-4 w-4" />
        {$t("ScheduledFunctions.eyebrow")}
      </div>
      <h1 class="text-2xl font-bold tracking-tight">{$t("ScheduledFunctions.title")}</h1>
      <p class="mt-1 max-w-2xl text-sm text-muted-foreground">{$t("ScheduledFunctions.subtitle")}</p>
    </div>
    <button onclick={loadSchedules} disabled={loading}
      class="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50">
      {#if loading}<Loader2 class="h-3.5 w-3.5 animate-spin" />{:else}<RefreshCw class="h-3.5 w-3.5" />{/if}
      {$t("ScheduledFunctions.refresh")}
    </button>
  </div>

  {#if error}
    <div class="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700">{error}</div>
  {/if}

  <div class="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
    <aside class="overflow-hidden rounded-lg border bg-card">
      <div class="border-b px-4 py-3 text-sm font-semibold">{$t("ScheduledFunctions.schedules")}</div>
      {#if loading && schedules.length === 0}
        <div class="flex justify-center py-10"><Loader2 class="h-5 w-5 animate-spin text-muted-foreground" /></div>
      {:else if schedules.length === 0}
        <p class="px-4 py-8 text-center text-xs text-muted-foreground">{$t("ScheduledFunctions.no_schedules")}</p>
      {:else}
        <ul class="divide-y">
          {#each schedules as schedule (schedule.id)}
            <li>
              <button onclick={() => selectSchedule(schedule.id)}
                class="w-full px-4 py-3 text-left transition-colors hover:bg-muted/40 {selectedId === schedule.id ? 'bg-brand/5' : ''}">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate text-sm font-medium">{schedule.name}</span>
                  <span class="rounded px-1.5 py-0.5 text-[10px] font-mono {schedule.enabled ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted text-muted-foreground'}">{schedule.enabled ? $t("ScheduledFunctions.enabled") : $t("ScheduledFunctions.disabled")}</span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span class="font-mono">{schedule.cron}</span>
                  <span>·</span>
                  <span class="font-mono">{schedule.method} {schedule.slug}</span>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </aside>

    <section class="space-y-4">
      {#if selected}
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold">{selected.name}</div>
            <div class="mt-0.5 font-mono text-[11px] text-muted-foreground">{selected.cron} · {selected.method} {selected.slug}</div>
          </div>
          <button onclick={runNow} disabled={triggering || !selected.enabled}
            class="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand/90 disabled:opacity-50">
            {#if triggering}<Loader2 class="h-3.5 w-3.5 animate-spin" />{:else}<Play class="h-3.5 w-3.5" />{/if}
            {$t("ScheduledFunctions.run_now")}
          </button>
        </div>

        <div class="overflow-hidden rounded-lg border bg-card">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <div class="text-sm font-semibold">{$t("ScheduledFunctions.runs")}</div>
            <button onclick={loadRuns} disabled={runsLoading}
              class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] hover:bg-muted disabled:opacity-50">
              {#if runsLoading}<Loader2 class="h-3 w-3 animate-spin" />{:else}<RefreshCw class="h-3 w-3" />{/if}
              {$t("ScheduledFunctions.refresh")}
            </button>
          </div>
          {#if runsError}
            <div class="border-b border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-700">{runsError}</div>
          {/if}
          {#if runsLoading && runs.length === 0}
            <div class="flex justify-center py-12"><Loader2 class="h-5 w-5 animate-spin text-muted-foreground" /></div>
          {:else if runs.length === 0}
            <p class="px-4 py-12 text-center text-xs text-muted-foreground">{$t("ScheduledFunctions.no_runs")}</p>
          {:else}
            <div class="overflow-x-auto">
              <table class="w-full min-w-[52rem] text-left text-xs">
                <thead class="border-b bg-muted/30 text-muted-foreground">
                  <tr>
                    <th class="px-4 py-2.5 font-semibold">{$t("ScheduledFunctions.scheduled_for")}</th>
                    <th class="px-3 py-2.5 font-semibold">{$t("ScheduledFunctions.status")}</th>
                    <th class="px-3 py-2.5 font-semibold">{$t("ScheduledFunctions.attempt")}</th>
                    <th class="px-3 py-2.5 font-semibold">HTTP</th>
                    <th class="px-3 py-2.5 font-semibold">{$t("ScheduledFunctions.started")}</th>
                    <th class="px-3 py-2.5 font-semibold">{$t("ScheduledFunctions.finished")}</th>
                    <th class="px-3 py-2.5 font-semibold">{$t("ScheduledFunctions.error")}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                  {#each runs as run (run.id)}
                    <tr class="hover:bg-muted/20">
                      <td class="whitespace-nowrap px-4 py-2.5 font-mono">{formatTime(run.scheduled_for)}</td>
                      <td class="px-3 py-2.5"><span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {statusClass(run.status)}">{run.status}</span></td>
                      <td class="px-3 py-2.5 font-mono">{run.attempt}/{run.max_attempts}</td>
                      <td class="px-3 py-2.5 font-mono">{run.http_status ?? "—"}</td>
                      <td class="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{formatTime(run.started_at)}</td>
                      <td class="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{formatTime(run.finished_at)}</td>
                      <td class="max-w-[18rem] truncate px-3 py-2.5 text-red-700" title={run.error ?? ""}>{run.error ?? "—"}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      {:else}
        <div class="rounded-lg border bg-card px-4 py-12 text-center text-sm text-muted-foreground">{$t("ScheduledFunctions.select_hint")}</div>
      {/if}
    </section>
  </div>
</div>
