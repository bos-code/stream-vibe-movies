import { getImage, tmdbFetch } from "./media";

export function formatDateCustom(dateInput) {
  var date = new Date(dateInput);

  if (isNaN(date.getTime())) return "Invalid date"; // Check if the date is valid

  var day = date.getDate();
  var month = date.toLocaleString("en-GB", { month: "long" }); // Get full month name
  var year = date.getFullYear();

  return day + " " + month + " " + year;
}

export function renderStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStar = `
      <svg width="18" height="17" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.38 0.5L12.5 5.21l5.44 1.51-3.52 4.42.25 5.64-5.29-1.98-5.29 1.98.25-5.64L.82 6.72 6.26 5.21 9.38 0.5Z" fill="#E60000"/>
      </svg>`;

  const emptyStar = `
      <svg width="18" height="17" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.38 0.5L12.5 5.21l5.44 1.51-3.52 4.42.25 5.64-5.29-1.98-5.29 1.98.25-5.64L.82 6.72 6.26 5.21 9.38 0.5Z" fill="gray"/>
      </svg>`;

  const fullStars = Math.floor(safeRating);
  const fraction = safeRating % 1; // Get decimal part for precise coloring
  let starsHTML = "";

  // Render full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += fullStar;
  }

  // Render fractional star (precise fill percentage)
  if (fraction > 0) {
    const gradientId = `star-fill-${Math.random().toString(36).substring(7)}`; // Unique ID for gradient

    starsHTML += `
        <svg width="18" height="17" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="0">
              <stop offset="${fraction * 100}%" stop-color="#E60000"/>
              
              <stop offset="${fraction * 100}%" stop-color="gray"/>
            </linearGradient>
          </defs>
          <path d="M9.38 0.5L12.5 5.21l5.44 1.51-3.52 4.42.25 5.64-5.29-1.98-5.29 1.98.25-5.64L.82 6.72 6.26 5.21 9.38 0.5Z" fill="url(#${gradientId})"/>
        </svg>`;
  }
  // Render remaining empty stars
  const renderedStars = fullStars + (fraction > 0 ? 1 : 0);
  for (let i = renderedStars; i < 5; i++) {
    starsHTML += emptyStar;
  }

  return `<div class="rating flex items-center justify-center">${starsHTML}</div>`;
}

export async function fetchTvDetails(tvId) {
  try {
    return await tmdbFetch(`tv/${tvId}`);
  } catch {
    return null;
  }
}

export function tvDuration(r, nE) {
  const rtime = r;
 
  if (Array.isArray(rtime)) {
    const rTA = rtime.reduce((sum, num) => sum + num, 0) / rtime.length;
    return rTA * nE;
  } else {
    return r * nE;
  }

}



export async function fetchMediaByGenre(genreId, type = "movie") {
  try {
    const data = await tmdbFetch(`discover/${type}`, { with_genres: genreId });

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Shuffle the array and pick four random movies
    const shuffledMovies = data.results
      .filter((item) => item.poster_path)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    // Map out and log their poster paths
    const imageUrls = shuffledMovies.map((movie) =>
      getImage(movie.poster_path, "w500")
    );

    return imageUrls;
  } catch {
    return [];
  }
}

export function fetchMoviesByGenre(genreId) {
  return fetchMediaByGenre(genreId, "movie");
}

export function loop(arr = []){
  let imgTemp = ''

  arr.forEach(img => {
    imgTemp += `<img src="${img}" alt="">`
  });

  return imgTemp
}
