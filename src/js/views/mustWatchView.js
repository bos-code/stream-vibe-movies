import { fetchMovieDetails, formatNumber, runTime } from "../helpers";
import {
  createSwiper,
  creatSwipers,
  SWIPER_SELECTOR_4_CONFIG
} from "../swiper";
import { renderStars } from "../utils";
import { View } from "./view";

async function mustTemplate(item) {
  const runtime = await fetchMovieDetails(item.id);
  return `
      <li class="views swiper-slide" data-ID="${item.id}">
           <figure class="rounded-md  overflow-hidden">
        <img src="${
          item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "/asset/images/hero.png"
        }" alt="${item.title}" />
      </figure>
            <div class="details">
              <div class="time-tag">
                <img src="/asset/images/time.svg" alt="" />
                <span class="text-xs text-gray60">${runTime(runtime)}</span>
              </div>
              <div class="views-tag">
                <div class="rating flex items-center justify-center">
                ${renderStars(item.vote_average / 2)}            
                </div>
                <span class="text-xs text-gray60">${formatNumber(
                  item.vote_count
                )}</span>
              </div>
            </div>
          </li>
    `;
}

const mustWatchView = View("#mustWatch");
export async function renderMustWatch(data) {
  mustWatchView?.render(data, mustTemplate);
  createSwiper("#categories-swiper-5", SWIPER_SELECTOR_4_CONFIG);
}
