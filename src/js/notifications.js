import { escapeHTML, getDetailUrl, getImage, rememberSelectedMedia } from "./media";
import {
  clearCollection,
  getCollection,
  getLikedTitles,
  getWatchlist,
  removeFromCollection
} from "./library";
import {
  closeLayer,
  closeWhenAnotherLayerOpens,
  openLayer,
  trapFocus
} from "./ui";

const COLLECTIONS = {
  history: {
    empty: "Titles you open will appear here, ready to continue.",
    label: "Recently Viewed"
  },
  liked: {
    empty: "Like a movie or show from its title page to keep it here.",
    label: "Liked Titles"
  },
  watchlist: {
    empty: "Add movies and shows from a title page, then come back here.",
    label: "Watchlist"
  }
};

let panel;
let listEl;
let countEl;
let titleEl;
let clearButton;
let activeTrigger;
let activeCollection = "watchlist";
let triggerButtons = [];

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

  triggerButtons = triggers.map((trigger) => trigger.closest("li") || trigger);
  triggerButtons.forEach((button) => {
    button.classList.add("nav-action", "library-trigger");
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", "Open your library");
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => openPanel(button));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel(button);
      }
    });
  });

  refreshPanel();
  window.addEventListener("streamvibe:library-updated", refreshPanel);
  closeWhenAnotherLayerOpens("library", closePanel);
}

function ensurePanel() {
  if (panel) return;

  panel = document.createElement("section");
  panel.className = "watchlist-panel library-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <div class="watchlist-panel__backdrop" data-library-close></div>
    <aside class="watchlist-panel__drawer" role="dialog" aria-modal="true" aria-labelledby="library-title">
      <button class="watchlist-panel__close" type="button" aria-label="Close library" data-library-close>&times;</button>
      <p class="watchlist-panel__eyebrow">Your StreamVibe</p>
      <h2 id="library-title">My Library <span>0</span></h2>
      <div class="library-tabs" role="tablist" aria-label="Library collections">
        ${Object.entries(COLLECTIONS)
          .map(
            ([name, collection]) => `
              <button
                type="button"
                role="tab"
                data-library-tab="${name}"
                aria-selected="${name === activeCollection}"
                class="${name === activeCollection ? "is-active" : ""}">${collection.label}</button>`
          )
          .join("")}
      </div>
      <div class="library-panel__heading">
        <h3 data-library-heading>${COLLECTIONS[activeCollection].label}</h3>
        <button type="button" class="library-panel__clear" data-library-clear>Clear</button>
      </div>
      <div class="watchlist-panel__items" role="tabpanel" aria-live="polite"></div>
    </aside>
  `;
  document.body.appendChild(panel);

  listEl = panel.querySelector(".watchlist-panel__items");
  countEl = panel.querySelector("#library-title span");
  titleEl = panel.querySelector("[data-library-heading]");
  clearButton = panel.querySelector("[data-library-clear]");

  panel.querySelectorAll("[data-library-close]").forEach((button) => {
    button.addEventListener("click", closePanel);
  });
  panel.querySelector(".library-tabs").addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-library-tab]") : null;
    if (!target) return;
    activeCollection = target.dataset.libraryTab;
    refreshPanel();
  });
  panel.querySelector(".library-tabs").addEventListener("keydown", handleTabKeys);
  clearButton.addEventListener("click", () => {
    const label = COLLECTIONS[activeCollection].label.toLowerCase();
    if (!window.confirm(`Clear your ${label}? This cannot be undone.`)) return;
    clearCollection(activeCollection);
  });
  listEl.addEventListener("click", handleListClick);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
  });
  panel
    .querySelector(".watchlist-panel__drawer")
    .addEventListener("keydown", (event) =>
      trapFocus(panel.querySelector(".watchlist-panel__drawer"), event)
    );
}

function openPanel(trigger) {
  activeTrigger = trigger;
  refreshPanel();
  openLayer(panel, {
    name: "library",
    trigger,
    focusTarget: panel.querySelector(".watchlist-panel__close")
  });
}

function closePanel({ restoreFocus = true } = {}) {
  closeLayer(panel, { trigger: activeTrigger, restoreFocus });
}

function refreshPanel() {
  if (!panel) return;

  const items = getCollection(activeCollection);
  const totalSaved = getWatchlist().length + getLikedTitles().length;
  countEl.textContent = String(totalSaved);
  titleEl.textContent = COLLECTIONS[activeCollection].label;
  clearButton.hidden = !items.length;
  updateTabs();
  updateTriggerBadges(totalSaved);

  if (!items.length) {
    listEl.innerHTML = `<p class="watchlist-panel__empty">${COLLECTIONS[activeCollection].empty}</p>`;
    return;
  }

  listEl.innerHTML = items.map(itemTemplate).join("");
}

function itemTemplate(item) {
  const meta = item.type === "tv" ? "TV Show" : "Movie";
  const viewed =
    activeCollection === "history" && item.viewedAt
      ? ` · ${formatRelativeDate(item.viewedAt)}`
      : "";
  return `
    <article class="watchlist-item library-item">
      <a href="${getDetailUrl(item.id, item.type)}" data-library-open="${item.id}" data-library-type="${item.type}">
        <img src="${getImage(item.poster_path)}" alt="${escapeHTML(item.title)} poster" loading="lazy" decoding="async" />
        <span>
          <strong>${escapeHTML(item.title)}</strong>
          <small>${meta}${viewed}</small>
        </span>
      </a>
      <button type="button" data-library-remove="${item.id}" data-library-type="${item.type}" aria-label="Remove ${escapeHTML(item.title)} from ${COLLECTIONS[activeCollection].label}">×</button>
    </article>`;
}

function handleListClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const removeButton = target.closest("[data-library-remove]");
  if (removeButton) {
    removeFromCollection(
      activeCollection,
      removeButton.dataset.libraryRemove,
      removeButton.dataset.libraryType
    );
    return;
  }

  const link = target.closest("[data-library-open]");
  if (!link) return;
  const item = getCollection(activeCollection).find(
    (entry) => String(entry.id) === link.dataset.libraryOpen && entry.type === link.dataset.libraryType
  );
  if (item) rememberSelectedMedia(item, item.type);
}

function updateTabs() {
  panel.querySelectorAll("[data-library-tab]").forEach((tab) => {
    const active = tab.dataset.libraryTab === activeCollection;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

function handleTabKeys(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = [...panel.querySelectorAll("[data-library-tab]")];
  const current = tabs.indexOf(document.activeElement);
  let next = current;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabs.length - 1;
  if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  event.preventDefault();
  tabs[next].click();
  tabs[next].focus();
}

function updateTriggerBadges(count) {
  triggerButtons.forEach((button) => {
    let badge = button.querySelector(".library-nav-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "library-nav-badge";
      badge.setAttribute("aria-hidden", "true");
      button.appendChild(badge);
    }
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.hidden = count === 0;
  });
}

function formatRelativeDate(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";
  const elapsed = Date.now() - timestamp;
  const minutes = Math.max(0, Math.floor(elapsed / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(timestamp).toLocaleDateString();
}
