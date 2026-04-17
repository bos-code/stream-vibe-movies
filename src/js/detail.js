import { createSwiper } from "./swiper";
import { renderStars } from "./utils";
import {
  escapeHTML,
  getImage,
  getSelectedMediaFromSession,
  getTitle,
  tmdbFetch
} from "./media";

const WATCHLIST_KEY = "streamvibe:watchlist";

export async function initDetailPage() {
  const hero = document.querySelector(".open-hero");
  if (!hero) return;

  const target = getDetailTarget();
  if (!target?.id) {
    wireWatchlistFromStaticPage();
    return;
  }

  setLoadingState(true);

  try {
    const details = await tmdbFetch(`${target.type}/${target.id}`, {
      append_to_response: "credits,videos"
    });
    hydrateDetailPage(details, target.type);
    wireWatchlist(details, target.type);
  } catch (error) {
    console.error("Unable to load details:", error);
    setDetailMessage("We could not refresh this title right now.");
  } finally {
    setLoadingState(false);
  }
}

function getDetailTarget() {
  const params = new URLSearchParams(window.location.search);
  const stored = getSelectedMediaFromSession();
  const path = window.location.pathname.toLowerCase();
  const fallbackType = path.includes("show") ? "tv" : "movie";

  return {
    id: params.get("id") || stored?.id,
    type: params.get("type") || stored?.type || fallbackType
  };
}

function hydrateDetailPage(details, type) {
  const title = getTitle(details);
  const overview = details.overview || "No description available.";
  const releaseDate = details.release_date || details.first_air_date || "";
  const backdrop = details.backdrop_path || details.poster_path;

  document.title = `${title} | StreamVibe`;
  setText(".open-hero .heading-tertiary", title);
  setText(".open-hero .contDesc", overview);
  setText(".description-text", overview);

  const heroImage = document.querySelector(".heroimages img");
  if (heroImage) {
    heroImage.src = getImage(backdrop, "w1280");
    heroImage.alt = `${title} backdrop`;
  }

  setReleasedYear(releaseDate);
  setPills("Available Languages", getLanguages(details));
  setPills("Genres", (details.genres || []).map((genre) => genre.name));
  setRatings(details.vote_average, details.vote_count);
  setProfiles(details, type);
  setCast(details.credits?.cast || []);
  wireTrailer(details.videos?.results || []);
}

function setReleasedYear(releaseDate) {
  const wrapper = findInfoWrapper("Released Year");
  if (!wrapper) return;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const value = Array.from(wrapper.children).find((child) => child.tagName === "P");
  if (value) value.textContent = String(year);
}

function getLanguages(details) {
  const spoken = details.spoken_languages || [];
  if (spoken.length) return spoken.map((lang) => lang.english_name || lang.name).filter(Boolean);
  return (details.origin_country || []).map((country) => country.toUpperCase());
}

function setPills(label, values) {
  const wrapper = findInfoWrapper(label);
  const list = wrapper?.querySelector(".language-wrapper, .genre-wrapper");
  if (!list) return;

  const safeValues = values?.length ? values : ["N/A"];
  list.innerHTML = safeValues
    .slice(0, 8)
    .map((value) => `<p class="px-3 py-2 bor">${escapeHTML(value)}</p>`)
    .join("");
}

function setRatings(voteAverage = 0, voteCount = 0) {
  const rate = document.querySelector(".rate");
  if (!rate) return;

  const normalized = Number(voteAverage || 0) / 2;
  const display = Number(voteAverage || 0).toFixed(1);
  const count = Intl.NumberFormat("en", { notation: "compact" }).format(voteCount || 0);

  rate.innerHTML = `
    <div class="rating-wrapper flex flex-col gap-1 bor p-4">
      <p class="text-xl">TMDB</p>
      <div class="rating flex items-center justify-center">
        ${renderStars(normalized)}
        <span>${display}</span>
      </div>
    </div>
    <div class="rating-wrapper flex flex-col gap-1 bor p-4">
      <p class="text-xl">Votes</p>
      <div class="rating flex items-center justify-center">
        <span>${count}</span>
      </div>
    </div>
  `;
}

function setProfiles(details, type) {
  const crew = details.credits?.crew || [];
  const director =
    type === "tv"
      ? details.created_by?.[0] || crew.find((person) => person.job === "Director")
      : crew.find((person) => person.job === "Director") || crew[0];
  const music =
    crew.find((person) => /composer|music/i.test(person.job || person.department || "")) ||
    crew.find((person) => person.department === "Sound");

  setProfile("Director", director);
  setProfile("Music", music);
}

function setProfile(label, person) {
  const wrapper = findInfoWrapper(label);
  const profile = wrapper?.querySelector(".profile-wrapper");
  if (!profile || !person) return;

  profile.innerHTML = `
    <img src="${getImage(person.profile_path, "w185", "/asset/svg/director.png")}" alt="${escapeHTML(person.name)}" />
    <div class="profile">
      <p>${escapeHTML(person.name)}</p>
      <span class="text-gray60">${escapeHTML(person.job || person.department || "Crew")}</span>
    </div>
  `;
}

function setCast(cast) {
  const castList = document.querySelector(".casts-slide");
  if (!castList) return;

  const isElementSwiper = castList.tagName.toLowerCase() === "swiper-container";
  const slideTag = isElementSwiper ? "swiper-slide" : "div";
  const slideClass = isElementSwiper ? "w-32 h-36 cast-card" : "w-32 h-36 swiper-slide cast-card";
  const people = cast.filter((person) => person.profile_path).slice(0, 12);

  if (!people.length) return;

  castList.innerHTML = people
    .map(
      (person) => `
        <${slideTag} class="${slideClass}">
          <img src="${getImage(person.profile_path, "w185")}" alt="${escapeHTML(person.name)}" loading="lazy" decoding="async" />
          <span>${escapeHTML(person.name)}</span>
        </${slideTag}>
      `
    )
    .join("");

  if (!isElementSwiper) {
    createSwiper("#casts-swiper", {
      slidesPerView: 8,
      spaceBetween: 12,
      breakpoints: {
        375: { slidesPerView: 3 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 7 }
      }
    });
  }
}

function wireTrailer(videos) {
  const trailer = videos.find((video) => video.site === "YouTube" && video.type === "Trailer");
  const playButton = document.querySelector(".open-hero .btn-def-red");
  if (!playButton || !trailer) return;

  playButton.addEventListener("click", () => {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank", "noopener");
  });
}

function wireWatchlist(details, type) {
  const button = document.querySelector(".open-hero .action li:first-child");
  if (!button) return;

  const item = {
    id: details.id,
    type,
    title: getTitle(details),
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path
  };

  const syncState = () => {
    const saved = getWatchlist().some((entry) => entry.id === item.id && entry.type === item.type);
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-label", saved ? "Remove from watchlist" : "Add to watchlist");
  };

  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.addEventListener("click", () => {
    toggleWatchlist(item);
    syncState();
  });
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleWatchlist(item);
      syncState();
    }
  });

  syncState();
}

function wireWatchlistFromStaticPage() {
  const title = document.querySelector(".open-hero .heading-tertiary")?.textContent?.trim();
  if (!title) return;
  wireWatchlist({ id: title, title }, "movie");
}

function toggleWatchlist(item) {
  const current = getWatchlist();
  const exists = current.some((entry) => entry.id === item.id && entry.type === item.type);
  const next = exists
    ? current.filter((entry) => !(entry.id === item.id && entry.type === item.type))
    : [item, ...current].slice(0, 30);

  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("streamvibe:watchlist-updated"));
  } catch {
    // Local storage is optional; the button simply will not persist.
  }
}

export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function findInfoWrapper(label) {
  const normalizedLabel = label.toLowerCase();
  return Array.from(document.querySelectorAll(".info-wrapper")).find((wrapper) =>
    wrapper
      .querySelector(".info-label")
      ?.textContent?.toLowerCase()
      .replace("gernes", "genres")
      .includes(normalizedLabel)
  );
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setLoadingState(isLoading) {
  document.body.classList.toggle("detail-is-loading", isLoading);
}

function setDetailMessage(message) {
  const el = document.querySelector(".description-text");
  if (el) el.textContent = message;
}
