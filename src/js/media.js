import { API_CONFIG } from "./config";

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
  rememberSelectedMedia(item, type);
  window.location.href = getDetailUrl(item, type);
}

export async function tmdbFetch(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  Object.entries({ language: "en-US", ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: API_CONFIG.authorization
    }
  });

  if (!response.ok) throw new Error(`TMDB request failed (${response.status})`);
  return response.json();
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
