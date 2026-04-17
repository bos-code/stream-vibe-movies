import { openMediaDetail } from "./media";

export function initMediaRouting() {
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
      try {
        sessionStorage.setItem(
          "streamvibe:selected-genre",
          JSON.stringify({
            id: genreCard.dataset.genreId,
            type: genreCard.dataset.genreType || "movie",
            name: genreCard.querySelector(".catName")?.textContent?.trim() || ""
          })
        );
      } catch {
        // The link below still gives users a sensible destination.
      }
      window.location.href = "./movies.html#movies";
    }
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
