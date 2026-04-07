import { AJAX } from "../helpers";
import { API_CONFIG, TMDB_ENDPOINTS } from "../config";
import { withCache } from "../cache";

// ─── Auth header used for every TMDB call ────────────────────────────────────
const AUTH = API_CONFIG;

/**
 * cachedFetch — wraps AJAX with the two-tier cache.
 * The cache key is the endpoint string so the same data is never fetched twice
 * within a session.
 */
async function cachedFetch(endpoint) {
  return withCache(endpoint, () => AJAX(endpoint, null, AUTH));
}

/**
 * fetchGenres — fetches genre lists, also cached.
 */
async function fetchGenres(type) {
  return withCache(`genre_${type}`, async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?language=en`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: AUTH.authorization
        }
      }
    );
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data.genres;
  });
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
  cachedFetch(TMDB_ENDPOINTS[1]),
  cachedFetch(TMDB_ENDPOINTS[5]),
  cachedFetch(TMDB_ENDPOINTS[0]),
  cachedFetch(TMDB_ENDPOINTS[3]),
  cachedFetch(TMDB_ENDPOINTS[6]),
  cachedFetch(TMDB_ENDPOINTS[7]),
  cachedFetch(TMDB_ENDPOINTS[8]),
  fetchGenres("movie"),
  fetchGenres("tv")
]);

export { datast, dataRel, trendingData, mustWatchData, trendingTv, newTv, MustTv, genDDta, genDDtatv };
