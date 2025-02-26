import {fetchMovieDetails, formatNumber, runTime} from "../helpers";


export async function rendertrends(trends) {
  const parentEl = document.getElementById("trends");
  parentEl.innerHTML = "";
  trends.forEach(async (trend) => {
    const runtime = await fetchMovieDetails(trend.id);
    const discoverTemp =  `
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
                <span class="text-xs text-gray60">${formatNumber(trend.vote_count)}</span>
              </div>
            </div>
          </li>
          
        `;
   

    parentEl.innerHtml = "";
    parentEl.innerHTML += discoverTemp;
  });
}
