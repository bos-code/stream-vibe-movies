import { escapeHTML, getDetailUrl, getImage, rememberSelectedMedia } from "./media";
import { getWatchlist } from "./detail";

let panel;
let listEl;
let countEl;

export function initNotifications() {
  const triggers = [
    ...document.querySelectorAll('.navItems img[src*="notification.svg"]'),
    ...document.querySelectorAll(".navmobile li")
  ].filter((node) => {
    const text = node.textContent?.trim().toLowerCase();
    return node.matches?.('img[src*="notification.svg"]') || text === "notification";
  });

  if (!triggers.length) return;
  ensurePanel();

  triggers.forEach((trigger) => {
    const button = trigger.closest("li") || trigger;
    button.classList.add("nav-action");
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", "Open watchlist");
    button.addEventListener("click", openPanel);
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel();
      }
    });
  });

  refreshPanel();
  window.addEventListener("streamvibe:watchlist-updated", refreshPanel);
}

function ensurePanel() {
  if (panel) return;

  panel = document.createElement("section");
  panel.className = "watchlist-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <div class="watchlist-panel__backdrop" data-watchlist-close></div>
    <aside class="watchlist-panel__drawer" role="dialog" aria-modal="true" aria-labelledby="watchlist-title">
      <button class="watchlist-panel__close" type="button" aria-label="Close watchlist" data-watchlist-close>&times;</button>
      <p class="watchlist-panel__eyebrow">Saved for later</p>
      <h2 id="watchlist-title">Your watchlist <span>0</span></h2>
      <div class="watchlist-panel__items"></div>
    </aside>
  `;
  document.body.appendChild(panel);

  listEl = panel.querySelector(".watchlist-panel__items");
  countEl = panel.querySelector("#watchlist-title span");
  panel.querySelectorAll("[data-watchlist-close]").forEach((button) => {
    button.addEventListener("click", closePanel);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
  });
}

function openPanel() {
  refreshPanel();
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
}

function closePanel() {
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}

function refreshPanel() {
  if (!panel) return;

  const items = getWatchlist();
  countEl.textContent = String(items.length);

  if (!items.length) {
    listEl.innerHTML = `
      <p class="watchlist-panel__empty">
        Add movies and shows from a title page, then come back here.
      </p>
    `;
    return;
  }

  listEl.innerHTML = items
    .map(
      (item, index) => `
        <a class="watchlist-item" href="${getDetailUrl(item.id, item.type)}" data-watchlist-index="${index}">
          <img src="${getImage(item.poster_path)}" alt="" loading="lazy" decoding="async" />
          <span>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${item.type === "tv" ? "TV Show" : "Movie"}</small>
          </span>
        </a>
      `
    )
    .join("");

  listEl.querySelectorAll("[data-watchlist-index]").forEach((link) => {
    link.addEventListener("click", () => {
      const item = items[Number(link.dataset.watchlistIndex)];
      rememberSelectedMedia(item, item.type);
    });
  });
}
