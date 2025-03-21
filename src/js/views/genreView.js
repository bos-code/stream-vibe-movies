import { createSwiper, SWIPER_SELECTOR_5_CONFIG } from "../swiper";
import { fetchMoviesByGenre, loop } from "../utils";
import { View } from "./view";

async function genreTemplate(item) {
  const img = await fetchMoviesByGenre(item.id);
  return `
     <li class="catItems swiper-slide" data-id="${item.ID}">
            <div class="gridImg">
            ${loop(img)}
              
            </div>
            <div class="title">
              <p class="catName">${item.name}</p>
              <img src="/asset/svg/arrl.svg" alt="" />
            </div>
          </li>
    `;
}
// Initialize the View
const moviesGenreView = View("#categories");
const movie10 = View("#top10");

// Fetch movie trends and render them
export async function renderMoviesGenres(data) {
  if (!moviesGenreView) return;

  moviesGenreView.render(data, genreTemplate);

  createSwiper("#categories-swiper", SWIPER_SELECTOR_5_CONFIG);
}
export async function renderMoviesGenres10(data) {
  if (!movie10) return;

  movie10.render(data, genreTemplate);

  createSwiper("#top10", SWIPER_SELECTOR_5_CONFIG);
}
