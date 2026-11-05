import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";

const appPath = fileURLToPath(new URL("./app.css", import.meta.url));
const appSource = readFileSync(appPath, "utf8");
const appCss = postcss.parse(appSource);
const uiThemeSource = readFileSync(
  fileURLToPath(import.meta.resolve("@svadmin/ui/app.css")),
  "utf8",
);
const aiThemeSource = readFileSync(
  fileURLToPath(import.meta.resolve("@svadmin/ai-elements/ai.css")),
  "utf8",
);

describe("SVAdmin stylesheet migration", () => {
  test("uses public component entries without the AdminApp stylesheet side effect", () => {
    const root = fileURLToPath(new URL("./", import.meta.url));
    const files = new Bun.Glob("**/*.svelte").scanSync({ cwd: root, absolute: true });
    for (const file of files) {
      if (file.includes(".test-")) continue;
      expect(readFileSync(file, "utf8")).not.toMatch(/from\s+["']@svadmin\/ui["']/);
    }
  });

  test("imports the precompiled SVAdmin entries without source scanning", () => {
    const imports: string[] = [];
    const sources: string[] = [];
    appCss.walkAtRules("import", (rule) => { imports.push(rule.params); });
    appCss.walkAtRules("source", (rule) => { sources.push(rule.params); });

    expect(imports).toEqual([
      '"tailwindcss"',
      '"@svadmin/ui/app.css"',
      '"@svadmin/ai-elements/ai.css"',
    ]);
    expect(sources).toEqual([]);
    expect(aiThemeSource).toContain(".svadmin-ai");
    expect(appSource).toContain("@theme inline");
    expect(appSource).toContain("--color-border: var(--border)");
  });

  test("preserves light and dark colors as complete semantic color values", () => {
    const themes = new Map<string, Map<string, string>>();
    appCss.walkRules((rule) => {
      if (rule.selector !== ":root" && rule.selector !== ".dark") return;
      const tokens = new Map<string, string>();
      rule.walkDecls((declaration) => {
        if (declaration.prop.startsWith("--") && declaration.prop !== "--radius") {
          expect(declaration.value).toMatch(/^hsl\([^)]+\)$/);
          tokens.set(declaration.prop, declaration.value);
        }
      });
      themes.set(rule.selector, tokens);
    });

    expect(themes.get(":root")?.get("--background")).toBe("hsl(0 0% 100%)");
    expect(themes.get(".dark")?.get("--background")).toBe("hsl(240 10% 3.9%)");
    expect(themes.get(":root")?.size).toBe(19);
    expect(themes.get(".dark")?.size).toBe(19);
    expect(appSource).not.toContain("hsl(var(");
    expect(appSource).toContain("@custom-variant dark (&:where(.dark, .dark *))");
  });

  test("compiles published component and table aliases without host UI scanning", async () => {
    const result = await postcss([
      tailwindcss({ base: fileURLToPath(new URL("../", import.meta.url)), optimize: false }),
    ]).process(appSource, { from: appPath });
    const css = result.css;
    const tableSource = readFileSync(
      fileURLToPath(import.meta.resolve("@svadmin/ui/components/AutoTable.svelte")),
      "utf8",
    );
    // SVAdmin publishes readable component utilities and precompiled aliases;
    // the host must consume the published stylesheet without scanning sources.
    expect(tableSource).not.toMatch(/\bsvadmin-u-[a-f0-9]+\b/);
    expect(tableSource).toContain("svadmin-auto-table__desktop");
    const aliases = new Set(uiThemeSource.match(/\.svadmin-u-[a-f0-9]+\b/g) ?? []);
    expect(aliases.size).toBeGreaterThan(0);
    for (const alias of aliases) {
      expect(css).toContain(alias);
    }
    expect(css).toContain(".svadmin-button");
    expect(css).toContain(".svadmin-table");
    expect(css).toContain(".h-7");
    expect(css).toContain(".space-y-3");
    expect(css).toContain("--color-background: var(--background)");
    expect(css).toContain("--background: hsl(0 0% 100%)");
    expect(css).toContain("--background: hsl(240 10% 3.9%)");
    expect(css).not.toContain('@import "@svadmin/');
  }, 30_000);
});
