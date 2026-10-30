import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const en = JSON.parse(readFileSync(new URL("../lib/i18n/locales/en.json", import.meta.url), "utf8"));
const zh = JSON.parse(readFileSync(new URL("../lib/i18n/locales/zh.json", import.meta.url), "utf8"));
const source = readFileSync(
  new URL("project/[ref]/settings/webhooks/+page.svelte", import.meta.url),
  "utf8",
);
const hanCharacters = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;

test("durable webhook settings page uses translated copy", () => {
  expect(source).not.toMatch(hanCharacters);
  for (const [, key] of source.matchAll(/"Hooks\.([A-Za-z_]+)"/g)) {
    expect(en.Hooks[key]).toEqual(expect.any(String));
    expect(zh.Hooks[key]).toEqual(expect.any(String));
  }
});

test("durable webhook page uses the delivery API instead of pg_net triggers", () => {
  expect(source).toContain("/webhooks");
  expect(source).toContain("/deliveries?limit=20");
  expect(source).toContain("/replay");
  expect(source).not.toContain("pg_net");
  expect(source).not.toContain("database/sql");
});
