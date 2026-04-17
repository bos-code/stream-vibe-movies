import { escapeHTML, getImage, getTitle } from "../media";
import { fetchTvDetails } from "../utils";
import { View } from "./view";

async function TvNewTemplate(item) {
  const details = await fetchTvDetails(item.id);
  return `
        <li
          class="views swiper-slide"
          data-media-id="${item.id}"
          data-media-type="tv"
          data-media-title="${escapeHTML(getTitle(item))}"
          data-media-poster="${item.poster_path || ""}"
          data-media-backdrop="${item.backdrop_path || ""}"
          data-media-overview="${escapeHTML(item.overview || "")}"
        >
               <figure class="rounded-lg  overflow-hidden">
        <img
          src="${getImage(item.poster_path)}"
          alt="${escapeHTML(getTitle(item))}"
          class="rounded-lg"
          loading="lazy"
          decoding="async"
          width="342"
          height="513"
        />
      </figure>
            <div class="details">
              <div class="time-tag">
                <img src="/asset/images/time.svg" alt="" />
                <span class="text-xs text-gray60">1h 30min</span>
              </div>
              <div class="views-tag">
                <img src="/asset/svg/videos.svg" alt="" />
                <span class="text-xs text-gray60">${
                  details?.number_of_seasons || 1
                } Season</span>
              </div>
            </div>
          </li>

    `;
}

const tvNewView = View("#tvNewView");
export async function renderNewTv(data) {
  await tvNewView?.render(data, TvNewTemplate);
}
