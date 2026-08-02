import { openMediaDetail } from "./media";

export function initMediaRouting() {
  decorateInteractiveCards(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) decorateInteractiveCards(node);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (!target) return;

    const interactive = target.closest("a, button, input, textarea, select");
    if (interactive) return;

    const mediaCard = target.closest("[data-media-id]");
    if (mediaCard) {
      openMediaDetail(datasetToMedia(mediaCard), mediaCard.dataset.mediaType || "movie");
      return;
    }

    const genreCard = target.closest("[data-genre-id]");
    if (genreCard) {
      selectGenre(genreCard);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target instanceof Element ? event.target : null;
    const card = target?.closest("[data-media-id], [data-genre-id]");
    if (!card || target.closest("a, button, input, textarea, select")) return;

    event.preventDefault();
    if (card.matches("[data-media-id]")) {
      openMediaDetail(datasetToMedia(card), card.dataset.mediaType || "movie");
    } else {
      selectGenre(card);
    }
  });
}

function selectGenre(genreCard) {
  const detail = {
    id: genreCard.dataset.genreId,
    type: genreCard.dataset.genreType || "movie",
    name: genreCard.querySelector(".catName")?.textContent?.trim() || ""
  };

  try {
    sessionStorage.setItem("streamvibe:selected-genre", JSON.stringify(detail));
  } catch {
    // Query parameters still preserve the selection.
  }

  const selectEvent = new CustomEvent("streamvibe:genre-select", {
    bubbles: true,
    cancelable: true,
    detail
  });
  document.dispatchEvent(selectEvent);
  if (selectEvent.defaultPrevented) return;

  const params = new URLSearchParams({ type: detail.type, genre: detail.id });
  if (detail.name) params.set("genreName", detail.name);
  window.location.href = `./movies.html?${params.toString()}#${detail.type === "tv" ? "shows" : "movies"}`;
}

function decorateInteractiveCards(root) {
  const descendants = root.querySelectorAll?.("[data-media-id], [data-genre-id]") || [];
  const cards = [
    ...(root.matches?.("[data-media-id], [data-genre-id]") ? [root] : []),
    ...descendants
  ];

  cards.forEach((card) => {
    if (card.matches("a, button") || card.hasAttribute("tabindex")) return;
    const title =
      card.dataset.mediaTitle ||
      card.querySelector(".catName")?.textContent?.trim() ||
      "item";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", card.dataset.genreId ? `Browse ${title}` : `Open ${title}`);
  });
}

function datasetToMedia(card) {
  return {
    id: Number(card.dataset.mediaId),
    media_type: card.dataset.mediaType || "movie",
    title: card.dataset.mediaTitle,
    name: card.dataset.mediaTitle,
    poster_path: card.dataset.mediaPoster || null,
    backdrop_path: card.dataset.mediaBackdrop || null,
    overview: card.dataset.mediaOverview || ""
  };
}
