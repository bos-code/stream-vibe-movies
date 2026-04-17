import { fetchMovieDetails, formatNumber, runTime } from "../helpers";
import { escapeHTML, getImage, getTitle } from "../media";
import {
  createSwiper,
  SWIPER_SELECTOR_4_CONFIG
} from "../swiper";
import { renderStars } from "../utils";
import { View } from "./view";

async function mustTemplate(item) {
  const runtime = await fetchMovieDetails(item.id);
  return `
      <li
        class="views swiper-slide"
        data-media-id="${item.id}"
        data-media-type="movie"
        data-media-title="${escapeHTML(getTitle(item))}"
        data-media-poster="${item.poster_path || ""}"
        data-media-backdrop="${item.backdrop_path || ""}"
        data-media-overview="${escapeHTML(item.overview || "")}"
      >
       <figure class="rounded-md  overflow-hidden">
        <img
          src="${getImage(item.poster_path)}"
          alt="${escapeHTML(getTitle(item))}"
          loading="lazy"
          decoding="async"
          width="342"
          height="513"
        />
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
  await mustWatchView?.render(data, mustTemplate);
  createSwiper("#categories-swiper-5", SWIPER_SELECTOR_4_CONFIG);
}
