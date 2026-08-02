import { escapeHTML, getImage, getTitle, openMediaDetail, tmdbFetch } from "./media";
import { showToast } from "./ui";

const PAGE_SIZE = 20;
const state = {
  genreId: "",
  genreName: "",
  page: 1,
  requestId: 0,
  type: "movie",
  totalPages: 1
};

export function initDiscoveryPage() {
  if (!document.getElementById("movies") || !document.getElementById("shows")) return;

  initSectionSwitcher();
  initHeroActions();
  document.addEventListener("streamvibe:genre-select", handleGenreSelection);
  document.addEventListener("click", handleResultsAction);

  const params = new URLSearchParams(window.location.search);
  const genreId = params.get("genre");
  if (genreId) {
    selectGenre({
      id: genreId,
      name: params.get("genreName") || "Selected genre",
      type: params.get("type") === "tv" ? "tv" : "movie"
    });
  }
}

function initSectionSwitcher() {
  const switcher = document.querySelector(".discovery-switcher");
  if (!switcher) return;

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-discovery-target]");
    if (!button) return;
    setActiveSection(button.dataset.discoveryTarget, true);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id, false);
    },
    { rootMargin: "-30% 0px -55%", threshold: [0, 0.15, 0.5] }
  );
  observer.observe(document.getElementById("movies"));
  observer.observe(document.getElementById("shows"));
}

function setActiveSection(id, shouldScroll) {
  document.querySelectorAll("[data-discovery-target]").forEach((button) => {
    const active = button.dataset.discoveryTarget === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (shouldScroll) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initHeroActions() {
  document.getElementById("heroSlides")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hero-action='open']");
    if (!button) return;
    const slide = button.closest("[data-media-id]");
    if (!slide) return;
    openMediaDetail(mediaFromDataset(slide), slide.dataset.mediaType || "movie");
  });
}

function handleGenreSelection(event) {
  event.preventDefault();
  selectGenre(event.detail);
}

async function selectGenre({ id, name, type }) {
  state.genreId = String(id);
  state.genreName = name || "Selected genre";
  state.type = type === "tv" ? "tv" : "movie";
  state.page = 1;
  state.totalPages = 1;

  document.querySelectorAll("[data-genre-results]").forEach((section) => {
    section.hidden = true;
  });
  markSelectedGenre();
  updateGenreUrl();
  setActiveSection(state.type === "tv" ? "shows" : "movies", true);
  await loadGenreResults(false);
}

async function loadGenreResults(append) {
  const requestId = ++state.requestId;
  const section = ensureResultsSection(state.type);
  const grid = section.querySelector("[data-genre-grid]");
  const status = section.querySelector("[data-genre-status]");
  const loadMore = section.querySelector("[data-genre-load-more]");

  section.hidden = false;
  section.querySelector("[data-genre-title]").textContent = `${state.genreName} ${state.type === "tv" ? "Shows" : "Movies"}`;
  status.textContent = append ? "Loading more titles…" : "Loading titles…";
  loadMore.hidden = true;
  if (!append) grid.innerHTML = renderSkeletons();

  try {
    const data = await tmdbFetch(`discover/${state.type}`, {
      include_adult: false,
      page: state.page,
      sort_by: "popularity.desc",
      with_genres: state.genreId
    });
    if (requestId !== state.requestId) return;

    const results = (data.results || []).slice(0, PAGE_SIZE);
    state.totalPages = Math.min(Number(data.total_pages) || 1, 500);
    if (!append) grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", results.map(resultTemplate).join(""));

    status.textContent = results.length
      ? `${Number(data.total_results || results.length).toLocaleString()} titles found`
      : "No titles found in this genre.";
    loadMore.hidden = !results.length || state.page >= state.totalPages;
    if (!append) section.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    if (requestId !== state.requestId) return;
    if (append) {
      state.page = Math.max(1, state.page - 1);
      status.textContent = "More titles could not be loaded.";
      loadMore.hidden = false;
    } else {
      grid.innerHTML = `<div class="discovery-empty"><p>${escapeHTML(error.message || "Unable to load titles.")}</p><button type="button" data-genre-retry>Try again</button></div>`;
      status.textContent = "Titles could not be loaded.";
    }
    showToast("We couldn’t load that genre. Please try again.");
  }
}

function ensureResultsSection(type) {
  const parent = document.getElementById(type === "tv" ? "shows" : "movies");
  let section = parent.querySelector("[data-genre-results]");
  if (section) return section;

  section = document.createElement("section");
  section.className = "genre-results";
  section.dataset.genreResults = "";
  section.hidden = true;
  section.innerHTML = `
    <div class="genre-results__header">
      <div>
        <p class="genre-results__eyebrow">Filtered collection</p>
        <h2 class="heading-secondary" data-genre-title></h2>
        <p class="section-description" data-genre-status aria-live="polite"></p>
      </div>
      <button type="button" class="genre-results__clear" data-genre-clear>Clear filter</button>
    </div>
    <div class="genre-results__grid" data-genre-grid></div>
    <button type="button" class="genre-results__more" data-genre-load-more hidden>Load more</button>
  `;
  parent.querySelector(".label").insertAdjacentElement("afterend", section);
  return section;
}

function handleResultsAction(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (target.closest("[data-genre-load-more]")) {
    if (state.page < state.totalPages) {
      state.page += 1;
      loadGenreResults(true);
    }
    return;
  }

  if (target.closest("[data-genre-retry]")) {
    loadGenreResults(false);
    return;
  }

  if (target.closest("[data-genre-clear]")) clearGenreFilter();
}

function clearGenreFilter() {
  state.requestId += 1;
  state.genreId = "";
  document.querySelectorAll("[data-genre-results]").forEach((section) => {
    section.hidden = true;
  });
  document.querySelectorAll("[data-genre-id]").forEach((card) => {
    card.classList.remove("is-selected");
    card.removeAttribute("aria-current");
  });
  const url = new URL(window.location.href);
  ["genre", "genreName", "type"].forEach((key) => url.searchParams.delete(key));
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function markSelectedGenre() {
  document.querySelectorAll("[data-genre-id]").forEach((card) => {
    const selected =
      card.dataset.genreId === state.genreId &&
      (card.dataset.genreType || "movie") === state.type;
    card.classList.toggle("is-selected", selected);
    if (selected) card.setAttribute("aria-current", "true");
    else card.removeAttribute("aria-current");
  });
}

function updateGenreUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("genre", state.genreId);
  url.searchParams.set("genreName", state.genreName);
  url.searchParams.set("type", state.type);
  url.hash = state.type === "tv" ? "shows" : "movies";
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function resultTemplate(item) {
  const title = getTitle(item);
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = Number(item.vote_average || 0).toFixed(1);
  return `
    <article
      class="discovery-result-card"
      data-media-id="${item.id}"
      data-media-type="${state.type}"
      data-media-title="${escapeHTML(title)}"
      data-media-poster="${item.poster_path || ""}"
      data-media-backdrop="${item.backdrop_path || ""}"
      data-media-overview="${escapeHTML(item.overview || "")}">
      <figure>
        <img src="${getImage(item.poster_path)}" alt="${escapeHTML(title)} poster" loading="lazy" decoding="async" width="342" height="513" />
      </figure>
      <div class="discovery-result-card__body">
        <h3>${escapeHTML(title)}</h3>
        <p><span>${year || "Coming soon"}</span><span aria-label="Rated ${rating} out of 10">★ ${rating}</span></p>
      </div>
    </article>`;
}

function renderSkeletons() {
  return Array.from({ length: 5 }, () => '<div class="discovery-skeleton" aria-hidden="true"></div>').join("");
}

function mediaFromDataset(card) {
  return {
    id: Number(card.dataset.mediaId),
    media_type: card.dataset.mediaType,
    title: card.dataset.mediaTitle,
    name: card.dataset.mediaTitle,
    poster_path: card.dataset.mediaPoster || null,
    backdrop_path: card.dataset.mediaBackdrop || null,
    overview: card.dataset.mediaOverview || ""
  };
}
