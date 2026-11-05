import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./+page.svelte", import.meta.url), "utf8");

describe("platform extensions SVAdmin migration", () => {
  test("uses the latest custom mutation hook for install and remove", () => {
    expect(source).toContain("useCustomMutation");
    expect(source).toContain('url: `${extensionsResource}/${action}`');
    expect(source).toContain('method: "post"');
    expect(source).toContain("invalidates: [\"list\"]");
    expect(source).not.toContain("createMutation");
    expect(source).not.toContain("apiClient");
  });

  test("uses the SVAdmin product primitives for page state, filtering, and row actions", () => {
    expect(source).toContain('from "@svadmin/ui/components/PagePattern.svelte"');
    expect(source).toContain('from "@svadmin/ui/components/content/FilterToolbar.svelte"');
    expect(source).toContain('from "@svadmin/ui/components/DataTableShell.svelte"');
    expect(source).toContain('from "@svadmin/ui/components/RowActions.svelte"');
    expect(source).toContain('from "@svadmin/ui/components/content/StatusBadge.svelte"');
    expect(source).toContain('state="filtered-empty"');
    expect(source).toContain("stickyActions");
    expect(source).not.toContain('bind:value={searchQuery}');
  });
});
