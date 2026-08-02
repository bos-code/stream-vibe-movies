/**
 * cache.js — Two-tier caching: in-memory (fast) + sessionStorage (survives page nav)
 *
 * - Memory cache: instant reads, cleared when tab closes
 * - Session cache: persists across page navigations within the same session
 * - TTL: 10 minutes — TMDB data doesn't change that frequently
 */

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const memoryCache = new Map();
const inflightRequests = new Map();

/**
 * Get or fetch data, checking memory → sessionStorage → network (in that order).
 * @param {string} key - Unique cache key (e.g. the TMDB endpoint string)
 * @param {() => Promise<any>} fetcher - Async function that returns the data
 * @returns {Promise<any>}
 */
export async function withCache(
  key,
  fetcher,
  { ttl = CACHE_TTL_MS, persist = true } = {}
) {
  // 1. Check in-memory cache (fastest — same page)
  const memHit = memoryCache.get(key);
  if (memHit && Date.now() - memHit.ts < ttl) {
    return memHit.data;
  }

  if (inflightRequests.has(key)) return inflightRequests.get(key);

  // 2. Check sessionStorage (survives page navigations)
  try {
    const raw = persist ? sessionStorage.getItem(`sv_${key}`) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < ttl) {
        // Populate memory cache for subsequent calls
        memoryCache.set(key, parsed);
        return parsed.data;
      }
      sessionStorage.removeItem(`sv_${key}`);
    }
  } catch {
    // sessionStorage unavailable (private browsing, storage full) — skip silently
  }

  // 3. Fetch from network
  const request = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      const entry = { data, ts: Date.now() };
      memoryCache.set(key, entry);
      if (persist) {
        try {
          sessionStorage.setItem(`sv_${key}`, JSON.stringify(entry));
        } catch {
          // Ignore storage quota errors.
        }
      }
      return data;
    })
    .finally(() => inflightRequests.delete(key));

  inflightRequests.set(key, request);
  return request;
}

/** Clear all StreamVibe entries from sessionStorage (useful for debugging) */
export function clearCache() {
  memoryCache.clear();
  inflightRequests.clear();
  for (const key of Object.keys(sessionStorage)) {
    if (key.startsWith("sv_")) sessionStorage.removeItem(key);
  }
}
