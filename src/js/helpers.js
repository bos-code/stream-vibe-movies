import { tmdbFetch } from "./media";

/**
 * AJAX — Fetch an endpoint across N pages in parallel using Promise.all.
 * Both pages fire simultaneously and results are merged once both resolve.
 */
export const AJAX = async function (endpoint) {
  const PAGES = 2; // number of pages to fetch concurrently
  const pages = await Promise.allSettled(
    Array.from({ length: PAGES }, (_, index) =>
      tmdbFetch(endpoint, { page: index + 1 })
    )
  );
  const successful = pages
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value.results ?? []);

  if (!successful.length) {
    const firstFailure = pages.find((result) => result.status === "rejected");
    throw firstFailure?.reason || new Error(`Unable to load ${endpoint}`);
  }

  return successful.slice(0, 100);
};

export function formatNumber(num) {
  if (num < 1000) {
    return num.toString();
  } else {
    return Math.ceil(num / 1000) + "k";
  }
}

export async function fetchMovieDetails(movieId) {
  try {
    const data = await tmdbFetch(`movie/${movieId}`);
    return data.runtime;
  } catch (error) {
    return null;
  }
}

export function runTime(minutes) {
  if (!minutes || minutes < 0) return "7h 40min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 ? hours + "h " + mins + "min" : mins + "min";
}

