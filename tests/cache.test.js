import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { installBrowserGlobals } from "./helpers/browser-globals.js";

installBrowserGlobals();

const { clearCache, withCache } = await import("../src/js/cache.js");

beforeEach(() => {
  sessionStorage.clear();
  clearCache();
});

test("concurrent requests share one fetch and cache its result", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return { title: "StreamVibe" };
  };

  const [first, second] = await Promise.all([
    withCache("concurrent", fetcher),
    withCache("concurrent", fetcher)
  ]);
  const third = await withCache("concurrent", fetcher);

  assert.equal(calls, 1);
  assert.deepEqual(first, second);
  assert.deepEqual(second, third);
  assert.ok(sessionStorage.getItem("sv_concurrent"));
});

test("failed requests are not retained in the in-flight cache", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    if (calls === 1) throw new Error("temporary failure");
    return "recovered";
  };

  await assert.rejects(withCache("retry", fetcher, { persist: false }), /temporary failure/);
  assert.equal(await withCache("retry", fetcher, { persist: false }), "recovered");
  assert.equal(calls, 2);
});

test("clearCache removes only StreamVibe cache entries", async () => {
  sessionStorage.setItem("unrelated", "keep");
  await withCache("clear-me", async () => 42);

  clearCache();

  assert.equal(sessionStorage.getItem("sv_clear-me"), null);
  assert.equal(sessionStorage.getItem("unrelated"), "keep");
});
