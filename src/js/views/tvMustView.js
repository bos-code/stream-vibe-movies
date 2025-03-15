import { formatNumber, runTime } from "../helpers";
import { fetchTvDetails, renderStars, tvDuration } from "../utils";
import { View } from "./view";

async function mustTvTemplate(item) {
  const runtime = await fetchTvDetails(item.id);
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
                <span class="text-xs text-gray60">${runTime(
                  tvDuration(
                    runtime.episode_run_time,
                    runtime.number_of_episodes
                  )
                )}</span>
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

const mustTvView = View("#tvMust");
export async function renderMustWatchTv(data) {
  mustTvView?.render(data, mustTvTemplate);
}
