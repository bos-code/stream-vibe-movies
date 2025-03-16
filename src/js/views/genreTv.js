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
const tvGenresView = View("#tvgenre");
const tvGenresView10 = View("#tvtop10");

// Fetch movie trends and render them
export async function renderTvGenres(data) {
  if (!tvGenresView) return;

  tvGenresView.render(data, genreTemplate);

  createSwiper("#categories-swiper-6", SWIPER_SELECTOR_5_CONFIG);
}
export async function renderTvGenres10(data) {
  if (!tvGenresView10) return;

  tvGenresView10.render(data, genreTemplate);

  createSwiper("#categories-swiper-7", SWIPER_SELECTOR_5_CONFIG);
}
