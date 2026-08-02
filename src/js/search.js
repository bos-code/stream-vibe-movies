import {
  escapeHTML,
  getDetailUrl,
  getImage,
  getMediaType,
  getTitle,
  rememberSelectedMedia,
  tmdbFetch
} from "./media";
import {
  closeLayer,
  closeWhenAnotherLayerOpens,
  openLayer,
  trapFocus
} from "./ui";

let searchRoot;
let searchInput;
let resultsEl;
let statusEl;
let debounceTimer;
let activeRequest = 0;
let activeTrigger;

export function initSearch() {
  const triggers = [
    ...document.querySelectorAll('.navItems img[src*="search.svg"]'),
    ...document.querySelectorAll(".navmobile li")
  ].filter((node) => {
    const text = node.textContent?.trim().toLowerCase();
    return node.matches?.('img[src*="search.svg"]') || text === "search";
  });

  if (!triggers.length) return;
  ensureSearchUI();

  triggers.forEach((trigger) => {
    const button = trigger.closest("li") || trigger;
    button.classList.add("nav-action");
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", "Search movies and shows");
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => openSearch(button));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSearch(button);
      }
    });
  });

  closeWhenAnotherLayerOpens("search", closeSearch);
}

function ensureSearchUI() {
  if (searchRoot) return;

  searchRoot = document.createElement("section");
  searchRoot.className = "search-panel";
  searchRoot.setAttribute("aria-hidden", "true");
  searchRoot.inert = true;
  searchRoot.innerHTML = `
    <div class="search-panel__backdrop" data-search-close></div>
    <div class="search-panel__dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <button class="search-panel__close" type="button" aria-label="Close search" data-search-close>&times;</button>
      <p class="search-panel__eyebrow">Find your next watch</p>
      <h2 id="search-title">Search movies and shows</h2>
      <form class="search-panel__form" role="search">
        <input
          type="search"
          name="query"
          autocomplete="off"
          placeholder="Try Dune, Avatar, Wednesday..."
          aria-label="Search movies and shows"
        />
      </form>
      <p class="search-panel__status">Start typing to search StreamVibe.</p>
      <div class="search-panel__results" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(searchRoot);
  searchInput = searchRoot.querySelector("input");
  resultsEl = searchRoot.querySelector(".search-panel__results");
  statusEl = searchRoot.querySelector(".search-panel__status");

  searchRoot.querySelectorAll("[data-search-close]").forEach((button) => {
    button.addEventListener("click", closeSearch);
  });

  searchRoot.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const firstResult = resultsEl.querySelector("a");
    firstResult?.click();
  });

  searchRoot
    .querySelector(".search-panel__dialog")
    .addEventListener("keydown", (event) =>
      trapFocus(searchRoot.querySelector(".search-panel__dialog"), event)
    );

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(searchInput.value.trim()), 320);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchRoot.classList.contains("is-open")) {
      closeSearch();
    }
  });
}

function openSearch(trigger) {
  activeTrigger = trigger;
  openLayer(searchRoot, {
    name: "search",
    trigger,
    focusTarget: searchInput
  });
}

function closeSearch({ restoreFocus = true } = {}) {
  closeLayer(searchRoot, {
    trigger: activeTrigger,
    restoreFocus
  });
}

async function runSearch(query) {
  activeRequest += 1;
  const requestId = activeRequest;

  if (query.length < 2) {
    resultsEl.innerHTML = "";
    statusEl.textContent = "Start typing to search StreamVibe.";
    return;
  }

  statusEl.textContent = "Searching...";
  resultsEl.innerHTML = "";

  try {
    const data = await tmdbFetch("search/multi", {
      query,
      include_adult: "false",
      page: 1
    });
    if (requestId !== activeRequest) return;

    const results = (data.results || [])
      .filter((item) => ["movie", "tv"].includes(item.media_type))
      .slice(0, 10);

    renderResults(results, query);
  } catch {
    if (requestId !== activeRequest) return;
    statusEl.textContent = "Search is having a moment. Try again.";
    resultsEl.innerHTML = "";
  }
}

function renderResults(results, query) {
  if (!results.length) {
    statusEl.textContent = `No results found for "${query}".`;
    resultsEl.innerHTML = "";
    return;
  }

  statusEl.textContent = `${results.length} result${results.length === 1 ? "" : "s"} found.`;
  resultsEl.innerHTML = results
    .map((item) => {
      const type = getMediaType(item);
      const title = getTitle(item);
      const year = (item.release_date || item.first_air_date || "").slice(0, 4);
      return `
        <a class="search-result" href="${getDetailUrl(item, type)}" data-search-id="${item.id}">
          <img src="${getImage(item.poster_path)}" alt="${escapeHTML(title)} poster" loading="lazy" decoding="async" />
          <span>
            <strong>${escapeHTML(title)}</strong>
            <small>${type === "tv" ? "TV Show" : "Movie"}${year ? ` - ${year}` : ""}</small>
          </span>
        </a>
      `;
    })
    .join("");

  resultsEl.querySelectorAll("[data-search-id]").forEach((link, index) => {
    link.addEventListener("click", () => {
      const item = results[index];
      rememberSelectedMedia(item, getMediaType(item));
    });
  });
}
