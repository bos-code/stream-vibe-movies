import { fetchMovieDetails, formatNumber, runTime } from "../helpers";
import { escapeHTML, getImage, getTitle } from "../media";
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
    <li
      class="views swiper-slide"
      data-media-id="${trend.id}"
      data-media-type="movie"
      data-media-title="${escapeHTML(getTitle(trend))}"
      data-media-poster="${trend.poster_path || ""}"
      data-media-backdrop="${trend.backdrop_path || ""}"
      data-media-overview="${escapeHTML(trend.overview || "")}"
    >
     <figure class="rounded-md  overflow-hidden">
    <img
      src="${getImage(trend.poster_path)}"
      alt="${escapeHTML(getTitle(trend))}"
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

  parentEl.innerHTML = "";
  parentEl.innerHTML = finalTemplate;

  createSwiper("#categories-swiper-3", SWIPER_SELECTOR_5_CONFIG);
}
