import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const en = JSON.parse(readFileSync(new URL("../lib/i18n/locales/en.json", import.meta.url), "utf8"));
const zh = JSON.parse(readFileSync(new URL("../lib/i18n/locales/zh.json", import.meta.url), "utf8"));
const source = readFileSync(new URL("project/[ref]/scheduled-functions/+page.svelte", import.meta.url), "utf8");
const cjk = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;

describe("scheduled functions console i18n", () => {
  test("keeps the page free of hardcoded CJK copy", () => {
    expect(source.replace(/<!--[\s\S]*?-->/g, "")).not.toMatch(cjk);
  });

  test("resolves each static translation key in both locales", () => {
    for (const [, key] of source.matchAll(/\$t\("([A-Za-z]+\.[A-Za-z_]+)"/g)) {
      const [section, name] = key.split(".");
      expect(en[section][name]).toEqual(expect.any(String));
      expect(zh[section][name]).toEqual(expect.any(String));
    }
  });
});
