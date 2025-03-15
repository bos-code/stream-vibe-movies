import { formatDateCustom } from "../utils";
import { View } from "./view";

async function trendTemplate(item) {
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

// Fetch movie trends and render them
export async function renderNewRelsease(data) {
  newReleaseView?.render(data, trendTemplate);
}
