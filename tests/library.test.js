import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { installBrowserGlobals } from "./helpers/browser-globals.js";

installBrowserGlobals();

const {
  clearCollection,
  getCollection,
  getViewingHistory,
  getWatchlist,
  isSaved,
  recordHistory,
  toggleSaved
} = await import("../src/js/library.js");

beforeEach(() => {
  localStorage.clear();
});

test("watchlist items can be added and removed", () => {
  const movie = { id: 858485, title: "Kantara", poster_path: "/kantara.jpg" };

  assert.equal(toggleSaved("watchlist", movie, "movie"), true);
  assert.equal(isSaved("watchlist", movie, "movie"), true);
  assert.deepEqual(getWatchlist(), [
    {
      backdrop_path: null,
      id: 858485,
      overview: "",
      poster_path: "/kantara.jpg",
      title: "Kantara",
      type: "movie"
    }
  ]);

  assert.equal(toggleSaved("watchlist", movie, "movie"), false);
  assert.deepEqual(getWatchlist(), []);
});

test("history is deduplicated and keeps the most recent item first", () => {
  recordHistory({ id: 1, title: "First" }, "movie");
  recordHistory({ id: 2, name: "Second" }, "tv");
  recordHistory({ id: 1, title: "First" }, "movie");

  const history = getViewingHistory();
  assert.deepEqual(history.map(({ id, type }) => ({ id, type })), [
    { id: 1, type: "movie" },
    { id: 2, type: "tv" }
  ]);
  assert.ok(history.every((item) => !Number.isNaN(Date.parse(item.viewedAt))));
});

test("malformed storage and unknown collections fail safely", () => {
  localStorage.setItem("streamvibe:watchlist", "not-json");
  assert.deepEqual(getWatchlist(), []);
  assert.deepEqual(getCollection("unknown"), []);
  assert.equal(toggleSaved("history", { id: 1, title: "Ignored" }), false);
  clearCollection("unknown");
});
