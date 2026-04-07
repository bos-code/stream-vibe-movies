import { TIMEOUT_SEC } from "./config";

/**
 * AJAX — Fetch an endpoint across N pages in parallel using Promise.all.
 * Both pages fire simultaneously and results are merged once both resolve.
 */
export const AJAX = async function (endpoint, bodyData = null, headers = {}) {
  const PAGES = 2; // number of pages to fetch concurrently

  const buildOptions = () => ({
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...(bodyData ? { body: JSON.stringify(bodyData) } : {})
  });

  try {
    // Fire all page requests simultaneously
    const requests = Array.from({ length: PAGES }, (_, i) =>
      fetch(
        `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=${i + 1}`,
        buildOptions()
      )
    );

    const responses = await Promise.all(requests);

    // Check each response status
    responses.forEach(res => {
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
    });

    // Parse all JSON in parallel
    const pages = await Promise.all(responses.map(r => r.json()));

    // Flatten results across pages
    const allResults = pages.flatMap(page => page.results ?? []);

    return allResults.slice(0, 100);
  } catch (err) {
    console.error("Error in AJAX function:", err);
    throw err;
  }
};

export function formatNumber(num) {
  if (num < 1000) {
    return num.toString();
  } else {
    return Math.ceil(num / 1000) + "k";
  }
}

export async function fetchMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?page=1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjVjOGEwM2E0OTY2NWExNjc4YjQ3YzRlNGE2NTNhZiIsIm5iZiI6MTczNTc1MDQ0MC4wMSwic3ViIjoiNjc3NTczMjgxOTRiNTgxNmQ3NjEzYjAzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rrD9n7tnIMUfuxs3Wh1wWMqzB3dSr4Ds4uiqCeapjTE`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const dat = await response.json();
    return dat.runtime;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export function runTime(minutes) {
  if (!minutes || minutes < 0) return "7h 40min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 ? hours + "h " + mins + "min" : mins + "min";
}


