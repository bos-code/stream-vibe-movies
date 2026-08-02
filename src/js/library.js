const STORAGE_KEYS = {
  history: "streamvibe:history",
  liked: "streamvibe:likes",
  watchlist: "streamvibe:watchlist"
};

const LIMITS = {
  history: 40,
  liked: 50,
  watchlist: 50
};

export function getWatchlist() {
  return getCollection("watchlist");
}

export function getLikedTitles() {
  return getCollection("liked");
}

export function getViewingHistory() {
  return getCollection("history");
}

export function getCollection(name) {
  const key = STORAGE_KEYS[name];
  if (!key) return [];
  const value = readJSON(key, []);
  return Array.isArray(value) ? value.filter(isMediaItem) : [];
}

export function isSaved(name, itemOrId, type) {
  const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
  const mediaType = typeof itemOrId === "object" ? itemOrId.type || itemOrId.media_type : type;
  return getCollection(name).some(
    (item) => String(item.id) === String(id) && item.type === normalizeType(mediaType)
  );
}

export function toggleSaved(name, item, type) {
  if (!STORAGE_KEYS[name] || name === "history") return false;
  const normalized = normalizeMedia(item, type);
  if (!normalized) return false;
  const current = getCollection(name);
  const exists = isSameMedia(normalized);
  const isAlreadySaved = current.some(exists);
  const next = isAlreadySaved
    ? current.filter((entry) => !exists(entry))
    : [normalized, ...current].slice(0, LIMITS[name]);
  writeCollection(name, next);
  return !isAlreadySaved;
}

export function recordHistory(item, type) {
  const normalized = normalizeMedia(item, type);
  if (!normalized) return;
  normalized.viewedAt = new Date().toISOString();
  const next = [
    normalized,
    ...getViewingHistory().filter((entry) => !isSameMedia(normalized)(entry))
  ].slice(0, LIMITS.history);
  writeCollection("history", next);
}

export function removeFromCollection(name, id, type) {
  if (!STORAGE_KEYS[name]) return;
  const next = getCollection(name).filter(
    (item) => !(String(item.id) === String(id) && item.type === normalizeType(type))
  );
  writeCollection(name, next);
}

export function clearCollection(name) {
  if (!STORAGE_KEYS[name]) return;
  writeCollection(name, []);
}

function writeCollection(name, value) {
  try {
    localStorage.setItem(STORAGE_KEYS[name], JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent("streamvibe:library-updated", { detail: { collection: name } })
    );
    if (name === "watchlist") {
      window.dispatchEvent(new CustomEvent("streamvibe:watchlist-updated"));
    }
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

function normalizeMedia(item, type) {
  if (!item?.id) return null;
  return {
    backdrop_path: item.backdrop_path || null,
    id: item.id,
    overview: item.overview || "",
    poster_path: item.poster_path || null,
    title: item.title || item.name || item.original_title || item.original_name || "Untitled",
    type: normalizeType(type || item.type || item.media_type || (item.name ? "tv" : "movie"))
  };
}

function normalizeType(type) {
  return type === "tv" ? "tv" : "movie";
}

function isSameMedia(target) {
  return (item) => String(item.id) === String(target.id) && item.type === target.type;
}

function isMediaItem(item) {
  return Boolean(item && (typeof item.id === "number" || typeof item.id === "string") && item.title && item.type);
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
