import { escapeHTML, getImage, getTitle } from "../media";

export function renderHero(movies) {
  const parentEl = document.getElementById("heroSlides");
  if (!parentEl) return;

  // Build all HTML upfront then write once (avoids repeated innerHTML += redraws)
  const html = movies
    .map(
      dataVal => `
      <div
        class="swiper-slide w-1/12 mx-auto"
        data-media-id="${dataVal.id}"
        data-media-type="movie"
        data-media-title="${escapeHTML(getTitle(dataVal))}"
        data-media-poster="${dataVal.poster_path || ""}"
        data-media-backdrop="${dataVal.backdrop_path || ""}"
        data-media-overview="${escapeHTML(dataVal.overview || "")}"
      >
        <figure>
          <img
            src="${getImage(dataVal.poster_path)}"
            alt="${escapeHTML(getTitle(dataVal))}"
            loading="lazy"
            decoding="async"
            width="342"
            height="513"
          />
        </figure>
        <div class="overlay">
          <div class="textbox">
            <h1 class="heading-primary">${escapeHTML(getTitle(dataVal))}</h1>
            <p class="section-description text-center">
              ${escapeHTML(dataVal.overview || "No description available.")}
            </p>
          </div>
          <div class="pagination-hero">
            <img src="/asset/svg/ButtonR.svg" alt="button right" id="prev-slide" />
            <div class="dots flex justify-center items-center" id="pagination"></div>
            <img src="/asset/svg/ButtonL.svg" alt="button left" id="next-slide" />
          </div>
        </div>
      </div>
    `
    )
    .join("");

  parentEl.innerHTML = html;
}
