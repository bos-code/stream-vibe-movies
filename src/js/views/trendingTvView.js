import { runTime } from "../helpers";
import { fetchTvDetails } from "../utils";
import { View } from "./view";

async function TvTemplate(item) {
  const details = await fetchTvDetails(item.id);
  return `
        <li class="views swiper-slide" data-ID="${item.id}>
               <figure class="rounded-lg  overflow-hidden">
        <img src="${
          item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "/asset/images/hero.png"
        }" alt="${item.title}" class="rounded-lg" />
      </figure>
            <div class="details">
              <div class="time-tag">
                <img src="/asset/images/time.svg" alt="" />
                <span class="text-xs text-gray60">1h 30min</span>
              </div>
              <div class="views-tag">
                <img src="/asset/svg/videos.svg" alt="" />
                <span class="text-xs text-gray60">${details.number_of_seasons} Season</span>
              </div>
            </div>
          </li>

    `;
}

const tvView = View("#tvView");
export async function renderTv(data) {
  tvView.render(data, TvTemplate);
}
