import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const pages = [
  "index.html",
  "movies.html",
  "display.html",
  "show.html",
  "support.html",
  "subscription.html"
];

test("all public pages load the shared application entry", async () => {
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    assert.match(html, /<title>[^<]+<\/title>/, `${page} needs a title`);
    assert.match(html, /src="(?:\.\/|\/)src\/js\/main\.js"/, `${page} needs the app entry`);
  }
});

test("support and subscription routes include their functional controls", async () => {
  const support = await readFile(new URL("../support.html", import.meta.url), "utf8");
  const subscription = await readFile(new URL("../subscription.html", import.meta.url), "utf8");

  assert.match(support, /class="support-form"/);
  assert.match(support, /name="message"/);
  assert.match(support, /class="accordion-item/);
  assert.match(subscription, /data-billing="yearly"/);
  assert.match(subscription, /data-plan-action="choose"/);
  assert.match(subscription, /id="comparison"/);
});

test("the pnpm workspace remains installable by Vercel", async () => {
  const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
  assert.match(workspace, /^packages:\s*\n\s+-\s+["']?\.["']?/m);
});

test("legacy subscription anchors cannot override the dedicated route", async () => {
  const navigation = await readFile(new URL("../src/js/navigation.js", import.meta.url), "utf8");
  assert.doesNotMatch(navigation, /index\.html#subscription/);
  assert.match(navigation, /subscription:\s*"\.\/subscription\.html"/);
});
