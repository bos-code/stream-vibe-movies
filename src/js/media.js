import {
  API_URL,
  TIMEOUT_SEC,
  TMDB_API_KEY,
  TMDB_READ_TOKEN
} from "./config";
import { withCache } from "./cache";
import { recordHistory } from "./library";

const IMAGE_BASE = "https://image.tmdb.org/t/p/";
const SELECTED_MEDIA_KEY = "streamvibe:selected-media";

export function getMediaType(item, fallback = "movie") {
  if (!item) return fallback;
  if (item.media_type === "tv" || item.first_air_date || item.name) return "tv";
  return item.media_type || fallback;
}

export function getTitle(item) {
  return item?.title || item?.name || item?.original_title || item?.original_name || "Untitled";
}

export function getImage(path, size = "w342", fallback = "/asset/images/hero.png") {
  return path ? `${IMAGE_BASE}${size}${path}` : fallback;
}

export function getDetailUrl(itemOrId, type = "movie") {
  const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
  const mediaType = typeof itemOrId === "object" ? getMediaType(itemOrId, type) : type;
  const page = mediaType === "tv" ? "show.html" : "display.html";
  return `./${page}?type=${mediaType}&id=${id}`;
}

export function rememberSelectedMedia(item, type = getMediaType(item)) {
  if (!item?.id) return;

  const payload = {
    id: item.id,
    type,
    title: getTitle(item),
    poster_path: item.poster_path || null,
    backdrop_path: item.backdrop_path || null,
    overview: item.overview || "",
    vote_average: item.vote_average || 0,
    vote_count: item.vote_count || 0
  };

  try {
    sessionStorage.setItem(SELECTED_MEDIA_KEY, JSON.stringify(payload));
  } catch {
    // Session storage is optional; query params still carry the detail target.
  }
}

export function getSelectedMediaFromSession() {
  try {
    const raw = sessionStorage.getItem(SELECTED_MEDIA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function openMediaDetail(item, type = getMediaType(item)) {
  if (!item?.id) return;
  recordHistory(item, type);
  rememberSelectedMedia(item, type);
  window.location.href = getDetailUrl(item, type);
}

export async function tmdbFetch(path, params = {}, options = {}) {
  const {
    cache = true,
    cacheTtl,
    persist = true,
    retries = 1,
    signal
  } = options;
  const url = new URL(path.replace(/^\//, ""), API_URL);
  Object.entries({ language: "en-US", ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  if (!TMDB_READ_TOKEN && TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }

  const cacheKey = `tmdb:${url.pathname}?${url.searchParams.toString()}`;
  const request = () => requestTMDB(url, { retries, signal });
  return cache
    ? withCache(cacheKey, request, { ttl: cacheTtl, persist })
    : request();
}

async function requestTMDB(url, { retries, signal }) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const abortFromParent = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abortFromParent, { once: true });
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_SEC * 1000);

    try {
      const headers = { accept: "application/json" };
      if (TMDB_READ_TOKEN) headers.Authorization = `Bearer ${TMDB_READ_TOKEN}`;

      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        const error = new Error(`TMDB request failed (${response.status})`);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      const retryable =
        !signal?.aborted &&
        error.name !== "AbortError" &&
        (!error.status || error.status === 429 || error.status >= 500);

      if (!retryable || attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abortFromParent);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error("TMDB request timed out. Please try again.");
  }
  throw lastError || new Error("TMDB request failed.");
}

export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}
