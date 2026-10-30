<script lang="ts">
  import { apiClient } from "$lib/api";
  import { page } from "$app/state";
  import { t } from "svelte-i18n";
  import { Webhook, Plus, Loader2, Trash2, RefreshCw, Play, RotateCcw, History, TestTube2 } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";

  const projectRef = $derived(page.params.ref);

  interface WebhookEndpoint {
    id: string;
    url: string;
    events: string[];
    enabled: boolean;
    has_secret: boolean;
    signing_key_id?: string;
    created_at?: string;
  }
  interface Delivery {
    id: string;
    status: string;
    status_code: number | null;
    attempt: number;
    error_message: string | null;
    response_preview: string | null;
    event_type: string;
    created_at: string;
  }

  let showAdd = $state(false);
  let selectedId = $state<string | null>(null);
  let newUrl = $state("");
  let newEvents = $state("*");

  const queryClient = useQueryClient();

  const webhooksQuery = createQuery(() => ({
    queryKey: ["durable-webhooks", projectRef],
    queryFn: async () => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.load_failed"));
      return data as { items: WebhookEndpoint[]; total: number };
    },
  }));

  const deliveriesQuery = createQuery(() => ({
    queryKey: ["webhook-deliveries", projectRef, selectedId],
    enabled: Boolean(selectedId),
    queryFn: async () => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks/${selectedId}/deliveries?limit=20`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.deliveries_failed"));
      return data as { items: Delivery[]; total: number; next_cursor: string | null };
    },
  }));

  const endpoints = $derived(webhooksQuery.data?.items ?? []);
  const deliveries = $derived(deliveriesQuery.data?.items ?? []);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["durable-webhooks", projectRef] });
    queryClient.invalidateQueries({ queryKey: ["webhook-deliveries", projectRef] });
  }

  const createWebhookMutation = createMutation(() => ({
    mutationFn: async () => {
      const events = newEvents.split(",").map((event) => event.trim()).filter(Boolean);
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl.trim(), events }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.create_failed"));
      return data;
    },
    onSuccess: () => {
      showAdd = false;
      newUrl = "";
      newEvents = "*";
      invalidate();
      toast.success($t("Hooks.created"));
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.create_failed")),
  }));

  const updateWebhookMutation = createMutation(() => ({
    mutationFn: async (input: { id: string; enabled: boolean }) => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks/${input.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: input.enabled }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.update_failed"));
      return data;
    },
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.update_failed")),
  }));

  const deleteWebhookMutation = createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || $t("Hooks.delete_failed"));
      }
      return response.json();
    },
    onSuccess: () => {
      if (selectedId) selectedId = null;
      invalidate();
      toast.success($t("Hooks.deleted"));
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.delete_failed")),
  }));

  const testWebhookMutation = createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks/${id}/test`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.test_failed"));
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success($t("Hooks.test_queued"));
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.test_failed")),
  }));

  const rotateWebhookMutation = createMutation(() => ({
    mutationFn: async (id: string) => {
      const response = await apiClient(`/v1/projects/${projectRef}/webhooks/${id}/rotate-secret`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.rotate_failed"));
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success($t("Hooks.rotated"));
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.rotate_failed")),
  }));

  const replayWebhookMutation = createMutation(() => ({
    mutationFn: async (delivery: Delivery) => {
      if (!selectedId) throw new Error($t("Hooks.no_endpoint_selected"));
      const response = await apiClient(
        `/v1/projects/${projectRef}/webhooks/${selectedId}/deliveries/${delivery.id}/replay`,
        { method: "POST" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || $t("Hooks.replay_failed"));
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success($t("Hooks.replay_queued"));
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : $t("Hooks.replay_failed")),
  }));

  function createWebhook() {
    if (!newUrl.trim()) {
      toast.error($t("Hooks.required_fields"));
      return;
    }
    createWebhookMutation.mutate();
  }

  function deleteWebhook(endpoint: WebhookEndpoint) {
    if (!confirm($t("Hooks.delete_confirm", { values: { name: endpoint.url } }))) return;
    deleteWebhookMutation.mutate(endpoint.id);
  }

  function toggleHistory(id: string) {
    selectedId = selectedId === id ? null : id;
  }
</script>

<svelte:head>
  <title>{$t("Hooks.title")} | SupaCloud</title>
</svelte:head>

<div class="h-full flex flex-col space-y-4">
  <div class="flex items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold">{$t("Hooks.title")}</h1>
      <p class="text-sm text-muted-foreground mt-1">{$t("Hooks.subtitle")}</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold">
        {$t("Hooks.count", { values: { count: endpoints.length } })}
      </span>
      <button onclick={() => showAdd = !showAdd}
        class="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors">
        <Plus size={14} /> {$t("Hooks.add")}
      </button>
    </div>
  </div>

  {#if showAdd}
    <div class="rounded-xl border bg-card p-5 space-y-4">
      <h3 class="text-sm font-semibold">{$t("Hooks.new_hook")}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block md:col-span-2">
          <span class="text-xs text-muted-foreground">{$t("Hooks.url")}</span>
          <input type="url" bind:value={newUrl} placeholder="https://your-server.com/webhook"
            class="w-full mt-1 px-3 py-2 text-xs font-mono rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-brand" />
        </label>
        <label class="block md:col-span-2">
          <span class="text-xs text-muted-foreground">{$t("Hooks.events")}</span>
          <input type="text" bind:value={newEvents} placeholder="order.created, order.updated"
            class="w-full mt-1 px-3 py-2 text-xs font-mono rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-brand" />
          <span class="mt-1 block text-[10px] text-muted-foreground">{$t("Hooks.events_hint")}</span>
        </label>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick={() => showAdd = false} class="px-4 py-2 text-xs rounded-lg border hover:bg-muted/50 transition-colors">
          {$t("Hooks.cancel")}
        </button>
        <button onclick={createWebhook} disabled={createWebhookMutation.isPending}
          class="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-50">
          {#if createWebhookMutation.isPending}<Loader2 size={12} class="animate-spin" />{/if} {$t("Hooks.save")}
        </button>
      </div>
    </div>
  {/if}

  <div class="flex-1 rounded-xl border border-border/50 bg-background shadow-sm overflow-hidden">
    {#if webhooksQuery.isPending}
      <div class="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Loader2 size={32} class="animate-spin text-brand opacity-50" />
        <p class="text-xs font-mono uppercase tracking-widest">{$t("Hooks.loading")}</p>
      </div>
    {:else if webhooksQuery.isError}
      <div class="p-6 text-sm text-red-600">
        {webhooksQuery.error instanceof Error ? webhooksQuery.error.message : $t("Hooks.load_failed")}
      </div>
    {:else if endpoints.length === 0}
      <div class="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Webhook size={40} class="opacity-20" />
        <p class="text-sm">{$t("Hooks.no_hooks_title")}</p>
        <p class="text-xs">{$t("Hooks.no_hooks_description")}</p>
      </div>
    {:else}
      <div class="divide-y divide-border/20">
        {#each endpoints as endpoint (endpoint.id)}
          <div class="px-5 py-4 hover:bg-muted/10 transition-colors">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-start gap-3 min-w-0">
                <Webhook size={16} class="text-brand mt-0.5 shrink-0" />
                <div class="min-w-0">
                  <div class="font-mono text-xs font-semibold break-all">{endpoint.url}</div>
                  <div class="flex flex-wrap items-center gap-1 mt-1.5">
                    {#each endpoint.events as event}
                      <span class="px-1.5 py-0.5 rounded text-[8px] bg-brand/10 text-brand">{event}</span>
                    {/each}
                    <span class="text-[9px] text-muted-foreground">
                      {$t("Hooks.key_id", { values: { id: endpoint.signing_key_id || "v1" } })}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                {#if endpoint.enabled}
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-600">{$t("Hooks.enabled")}</span>
                {:else}
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-muted text-muted-foreground">{$t("Hooks.disabled")}</span>
                {/if}
                <button onclick={() => updateWebhookMutation.mutate({ id: endpoint.id, enabled: !endpoint.enabled })}
                  disabled={updateWebhookMutation.isPending} title={$t("Hooks.toggle")}
                  class="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors disabled:opacity-50">
                  <RefreshCw size={13} />
                </button>
                <button onclick={() => testWebhookMutation.mutate(endpoint.id)} disabled={testWebhookMutation.isPending}
                  title={$t("Hooks.test")}
                  class="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors disabled:opacity-50">
                  <TestTube2 size={13} />
                </button>
                <button onclick={() => rotateWebhookMutation.mutate(endpoint.id)} disabled={rotateWebhookMutation.isPending}
                  title={$t("Hooks.rotate")}
                  class="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors disabled:opacity-50">
                  <RotateCcw size={13} />
                </button>
                <button onclick={() => toggleHistory(endpoint.id)}
                  title={$t("Hooks.history")}
                  class="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors">
                  <History size={13} />
                </button>
                <button onclick={() => deleteWebhook(endpoint)} disabled={deleteWebhookMutation.isPending}
                  title={$t("Hooks.delete")}
                  class="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-muted-foreground transition-colors disabled:opacity-50">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {#if selectedId === endpoint.id}
              <div class="mt-4 rounded-lg border bg-muted/10">
                <div class="flex items-center justify-between border-b px-3 py-2 text-[11px] font-semibold">
                  <span>{$t("Hooks.deliveries")}</span>
                  <span class="text-muted-foreground">{deliveriesQuery.data?.total ?? 0}</span>
                </div>
                {#if deliveriesQuery.isPending}
                  <div class="flex justify-center py-6"><Loader2 size={18} class="animate-spin text-brand" /></div>
                {:else if deliveriesQuery.isError}
                  <div class="p-3 text-xs text-red-600">
                    {deliveriesQuery.error instanceof Error ? deliveriesQuery.error.message : $t("Hooks.deliveries_failed")}
                  </div>
                {:else if deliveries.length === 0}
                  <div class="px-3 py-6 text-center text-xs text-muted-foreground">{$t("Hooks.no_deliveries")}</div>
                {:else}
                  <div class="divide-y">
                    {#each deliveries as delivery (delivery.id)}
                      <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[10px]">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="font-mono font-semibold">{delivery.event_type}</span>
                          <span class="rounded px-1.5 py-0.5 {delivery.status === 'delivered' ? 'bg-green-500/10 text-green-700' : delivery.status === 'dead_lettered' ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'}">
                            {delivery.status}
                          </span>
                          <span class="text-muted-foreground">{$t("Hooks.attempt", { values: { attempt: delivery.attempt } })}</span>
                          {#if delivery.status_code !== null}
                            <span class="text-muted-foreground">HTTP {delivery.status_code}</span>
                          {/if}
                          <span class="text-muted-foreground">{new Date(delivery.created_at).toLocaleString()}</span>
                        </div>
                        <button onclick={() => replayWebhookMutation.mutate(delivery)} disabled={replayWebhookMutation.isPending}
                          class="inline-flex items-center gap-1 rounded border px-2 py-1 font-semibold hover:bg-muted disabled:opacity-50">
                          <Play size={10} /> {$t("Hooks.replay")}
                        </button>
                        {#if delivery.error_message}
                          <div class="w-full truncate font-mono text-red-600" title={delivery.error_message}>{delivery.error_message}</div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
