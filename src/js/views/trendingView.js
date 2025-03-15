import { fetchMovieDetails, formatNumber, runTime } from "../helpers";
import { createSwiper, SWIPER_SELECTOR_5_CONFIG } from "../swiper";

export async function rendertrends(trends) {
  const parentEl = document.getElementById("trends");

  if (!parentEl) return;

  const runtimesPromises = [];

  trends.forEach((trend) => {
    const runtimePromise = fetchMovieDetails(trend.id);
    runtimesPromises.push(runtimePromise);
  });

  let finalTemplate = "";

  const runtimeResponses = await Promise.all(runtimesPromises);

  runtimeResponses.forEach((runtime, index) => {
    const trend = trends[index];

    const discoverTemp = `
    <li class="views swiper-slide" data-ID="${trend.id}">
     <figure class="rounded-md  overflow-hidden">
    <img src="${
      trend.poster_path
        ? `https://image.tmdb.org/t/p/w500${trend.poster_path}`
        : "/asset/images/hero.png"
    }" alt="${trend.title}" />
  </figure>
        <div class="details">
          <div class="time-tag">
            <img src="/asset/images/time.svg" alt="" />
            <span class="text-xs text-gray60">${runTime(runtime)}</span>
          </div>
          <div class="views-tag">
            <img src="/asset/images/eye.svg" alt="" />
            <span class="text-xs text-gray60">${formatNumber(
              trend.vote_count
            )}</span>
          </div>
        </div>
      </li>
      
    `;

    finalTemplate += discoverTemp;
  });

  parentEl.innerHtml = "";
  parentEl.innerHTML = finalTemplate;

  createSwiper("#categories-swiper-3", SWIPER_SELECTOR_5_CONFIG);
}
