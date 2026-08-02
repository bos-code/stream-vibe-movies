import { AJAX } from "../helpers";
import { TMDB_ENDPOINTS } from "../config";
import { tmdbFetch } from "../media";

/**
 * cachedFetch — wraps AJAX with the two-tier cache.
 * The cache key is the endpoint string so the same data is never fetched twice
 * within a session.
 */
async function cachedFetch(endpoint) {
  return AJAX(endpoint);
}

/**
 * fetchGenres — fetches genre lists, also cached.
 */
async function fetchGenres(type) {
  const data = await tmdbFetch(`genre/${type}/list`);
  return data.genres || [];
}

async function safeFetch(label, fetcher) {
  try {
    return await fetcher();
  } catch (error) {
    console.warn(`Unable to load ${label}:`, error.message);
    return [];
  }
}

// ─── Fire ALL endpoints simultaneously ───────────────────────────────────────
// Previously these were sequential awaits — each one blocked the next.
// Now they all start at the same time and we wait for all of them together.
const [
  datast,       // discover/movie          (TMDB_ENDPOINTS[1])
  dataRel,      // movie/now_playing        (TMDB_ENDPOINTS[5])
  trendingData, // trending/movie/day       (TMDB_ENDPOINTS[0])
  mustWatchData,// movie/top_rated          (TMDB_ENDPOINTS[3])
  trendingTv,   // trending/tv/week         (TMDB_ENDPOINTS[6])
  newTv,        // tv/airing_today          (TMDB_ENDPOINTS[7])
  MustTv,       // tv/top_rated             (TMDB_ENDPOINTS[8])
  genDDta,      // genre/movie/list
  genDDtatv     // genre/tv/list
] = await Promise.all([
  safeFetch("movies", () => cachedFetch(TMDB_ENDPOINTS[1])),
  safeFetch("new releases", () => cachedFetch(TMDB_ENDPOINTS[5])),
  safeFetch("trending movies", () => cachedFetch(TMDB_ENDPOINTS[0])),
  safeFetch("top rated movies", () => cachedFetch(TMDB_ENDPOINTS[3])),
  safeFetch("trending shows", () => cachedFetch(TMDB_ENDPOINTS[6])),
  safeFetch("new shows", () => cachedFetch(TMDB_ENDPOINTS[7])),
  safeFetch("top rated shows", () => cachedFetch(TMDB_ENDPOINTS[8])),
  safeFetch("movie genres", () => fetchGenres("movie")),
  safeFetch("show genres", () => fetchGenres("tv"))
]);

export { datast, dataRel, trendingData, mustWatchData, trendingTv, newTv, MustTv, genDDta, genDDtatv };
