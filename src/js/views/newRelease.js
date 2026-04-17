import { escapeHTML, getImage, getTitle } from "../media";
import { formatDateCustom } from "../utils";
import { View } from "./view";

async function trendTemplate(item) {
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
              <div class="release-tag">
                <span class="text-xs text-gray60 "
                  >Released at <span> ${formatDateCustom(
                    item.release_date
                  )}</span></span
                >
              </div>
            </div>
          </li>
    `;
    
}

// Initialize the View
const newReleaseView = View("#newRelease");

// Fetch movie trends 
export async function renderNewRelsease(data) {
  await newReleaseView?.render(data, trendTemplate);
}
