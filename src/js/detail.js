import { createSwiper } from "./swiper";
import { renderStars } from "./utils";
import {
  escapeHTML,
  getImage,
  getSelectedMediaFromSession,
  getTitle,
  tmdbFetch
} from "./media";
import { showToast } from "./ui";

const WATCHLIST_KEY = "streamvibe:watchlist";
const LIKES_KEY = "streamvibe:likes";
const REVIEWS_KEY = "streamvibe:user-reviews";
let activeDetails;
let activeType = "movie";
let activeTrailer;
let seasonRequestId = 0;

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
      append_to_response: "credits,videos,reviews,similar"
    });
    activeDetails = details;
    activeType = target.type;
    hydrateDetailPage(details, target.type);
    wireWatchlist(details, target.type);
    wireLike(details, target.type);
    renderReviews(details, target.type);
    wireReviewForm(details, target.type);
    if (target.type === "tv") renderSeasons(details);
  } catch (error) {
    console.error("Unable to load details:", error);
    setDetailMessage("We could not refresh this title right now.");
    const fallbackTitle = document.querySelector(".open-hero .heading-tertiary")?.textContent?.trim() || "This title";
    activeDetails = { id: Number(target.id), title: fallbackTitle, name: fallbackTitle, reviews: { results: [] } };
    activeType = target.type;
    wireWatchlist(activeDetails, activeType);
    wireLike(activeDetails, activeType);
    wireTrailer([]);
    renderReviews(activeDetails, activeType);
    wireReviewForm();
  } finally {
    setLoadingState(false);
  }
}

function getDetailTarget() {
  const params = new URLSearchParams(window.location.search);
  const stored = getSelectedMediaFromSession();
  const path = window.location.pathname.toLowerCase();
  const fallbackType = path.includes("show") ? "tv" : "movie";
  const queryId = params.get("id");
  const canUseStored = stored?.id && stored?.type === fallbackType;
  const requestedId = queryId || (canUseStored ? stored.id : fallbackType === "tv" ? 66732 : 858485);
  const requestedType = queryId ? params.get("type") || fallbackType : fallbackType;
  return {
    id: /^\d+$/.test(String(requestedId || "")) ? String(requestedId) : null,
    type: requestedType === "tv" ? "tv" : "movie"
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
  let castList = document.querySelector(".casts-slide");
  if (!castList) return;

  const content = castList.closest(".content");
  if (!content) return;
  content.id = "casts-swiper";
  const navigation = content.querySelector(".navigation");
  const navigationButtons = navigation?.querySelectorAll("img");
  navigationButtons?.[0]?.setAttribute("id", "prev-slide");
  navigationButtons?.[1]?.setAttribute("id", "next-slide");

  if (castList.tagName.toLowerCase() === "swiper-container") {
    const replacement = document.createElement("div");
    replacement.className = "mySwiper casts-slide flex swiper-wrapper";
    castList.replaceWith(replacement);
    castList = replacement;
  }

  const people = cast.filter((person) => person.profile_path).slice(0, 12);

  if (!people.length) {
    castList.innerHTML = '<p class="detail-empty">Cast information is not available.</p>';
    return;
  }

  castList.innerHTML = people
    .map(
      (person) => `
        <div class="w-32 h-36 swiper-slide cast-card">
          <img src="${getImage(person.profile_path, "w185")}" alt="${escapeHTML(person.name)}" loading="lazy" decoding="async" />
          <span>${escapeHTML(person.name)}</span>
        </div>
      `
    )
    .join("");

  createSwiper("#casts-swiper", {
    slidesPerView: 3,
    spaceBetween: 12,
    breakpoints: {
      375: { slidesPerView: 3 },
      768: { slidesPerView: 5 },
      1024: { slidesPerView: 7 }
    }
  });
}

function wireTrailer(videos) {
  const trailer =
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
    videos.find((video) => video.site === "YouTube" && video.type === "Teaser");
  const playButton = document.querySelector(".open-hero .btn-def-red");
  const trailerButton = document.querySelector("[data-detail-action='trailer']");
  activeTrailer = trailer;

  if (!trailer) {
    [playButton, trailerButton].forEach((button) => {
      if (!button) return;
      button.addEventListener("click", openTrailerSearch);
    });
    return;
  }

  [playButton, trailerButton].forEach((button) => {
    button?.addEventListener("click", () => openTrailerDialog(trailer));
  });
}

function openTrailerSearch() {
  const title = getTitle(activeDetails);
  const query = encodeURIComponent(`${title} official trailer`);
  window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank", "noopener,noreferrer");
  showToast("Opening trailer results on YouTube.");
}

function wireWatchlist(details, type) {
  const button = document.querySelector("[data-detail-action='watchlist']");
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

  button.addEventListener("click", () => {
    toggleWatchlist(item);
    syncState();
  });

  syncState();
}

function wireWatchlistFromStaticPage() {
  const title = document.querySelector(".open-hero .heading-tertiary")?.textContent?.trim();
  if (!title) return;
  const type = window.location.pathname.toLowerCase().includes("show") ? "tv" : "movie";
  wireWatchlist({ id: title, title }, type);
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

function wireLike(details, type) {
  const button = document.querySelector("[data-detail-action='like']");
  if (!button) return;
  const key = `${type}:${details.id}`;

  const syncState = () => {
    const liked = getLikes().includes(key);
    button.classList.toggle("is-liked", liked);
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-label", liked ? "Remove like" : "Like this title");
  };

  button.addEventListener("click", () => {
    const likes = getLikes();
    const next = likes.includes(key) ? likes.filter((item) => item !== key) : [key, ...likes];
    writeJSON(LIKES_KEY, next);
    syncState();
    showToast(next.includes(key) ? "Added to your liked titles." : "Removed from your liked titles.");
  });
  syncState();
}

function getLikes() {
  const likes = readJSON(LIKES_KEY, []);
  return Array.isArray(likes) ? likes : [];
}

function openTrailerDialog(trailer = activeTrailer) {
  if (!trailer?.key) {
    showToast("A trailer is not available for this title yet.");
    return;
  }

  let dialog = document.querySelector("[data-trailer-dialog]");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "detail-dialog trailer-dialog";
    dialog.dataset.trailerDialog = "";
    dialog.innerHTML = `
      <button class="detail-dialog__close" type="button" aria-label="Close trailer">×</button>
      <div class="trailer-dialog__frame" data-trailer-frame></div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector(".detail-dialog__close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      dialog.querySelector("[data-trailer-frame]").innerHTML = "";
    });
  }

  const title = getTitle(activeDetails);
  dialog.querySelector("[data-trailer-frame]").innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?autoplay=1"
      title="${escapeHTML(title)} trailer"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen></iframe>
  `;
  dialog.showModal();
}

function renderReviews(details, type) {
  const content = findContentSection("Reviews");
  if (!content) return;

  content.querySelector("#detail-review-swiper")?.swiper?.destroy(true, true);
  const apiReviews = (details.reviews?.results || []).slice(0, 8).map((review) => ({
    author: review.author || review.author_details?.username || "TMDB member",
    content: review.content || "",
    location: "TMDB member",
    rating: Math.max(0, Math.min(5, Number(review.author_details?.rating || details.vote_average || 0) / 2))
  }));
  const localReviews = getLocalReviews(details.id, type);
  const reviews = [...localReviews, ...apiReviews];

  content.innerHTML = `
    <div class="head-box items-start">
      <div>
        <h3 class="section-description">Reviews</h3>
        <p class="detail-section-meta">${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}</p>
      </div>
      <button class="bttn flex justify-center items-center gap-2" type="button" data-add-review>
        <img class="btnRight" src="/asset/svg/plus-white.svg" alt="" />
        <span>Add Your Review</span>
      </button>
    </div>
    ${
      reviews.length
        ? `<div class="myreview-wrapper" id="detail-review-swiper">
            <div class="myreview swiper-wrapper" data-review-list>${reviews.map(reviewTemplate).join("")}</div>
            <div class="navigation flex justify-center items-center gap-2 mt-10">
              <button type="button" id="prev-slide" aria-label="Previous review"><img src="/asset/svg/btn_left.svg" alt="" /></button>
              <div class="dots flex justify-center items-center"></div>
              <button type="button" id="next-slide" aria-label="Next review"><img src="/asset/svg/btn_right.svg" alt="" /></button>
            </div>
          </div>`
        : '<p class="detail-empty">No reviews yet. Be the first to share your thoughts.</p>'
    }
  `;

  content.querySelector("[data-add-review]")?.addEventListener("click", openReviewDialog);
  if (reviews.length) {
    createSwiper("#detail-review-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: { 920: { slidesPerView: 2 } }
    });
  }
}

function reviewTemplate(review) {
  const safeContent = review.content.length > 520 ? `${review.content.slice(0, 517)}…` : review.content;
  return `
    <article class="detail-review swiper-slide">
      <div class="reviewHeader flex items-center justify-between">
        <div class="profile">
          <p>${escapeHTML(review.author)}</p>
          <span class="from">${escapeHTML(review.location || "StreamVibe member")}</span>
        </div>
        <div class="rating flex items-center justify-center">
          ${renderStars(review.rating)}
          <span>${Number(review.rating).toFixed(1)}</span>
        </div>
      </div>
      <p class="review">${escapeHTML(safeContent || "No written review was provided.")}</p>
    </article>`;
}

function wireReviewForm() {
  ensureReviewDialog();
}

function ensureReviewDialog() {
  let dialog = document.querySelector("[data-review-dialog]");
  if (dialog) return dialog;

  dialog = document.createElement("dialog");
  dialog.className = "detail-dialog review-dialog";
  dialog.dataset.reviewDialog = "";
  dialog.innerHTML = `
    <form method="dialog" class="review-form" data-review-form>
      <button class="detail-dialog__close" type="button" aria-label="Close review form">×</button>
      <p class="genre-results__eyebrow">Your review</p>
      <h2>Share what you thought</h2>
      <label>Name<input name="name" type="text" maxlength="60" autocomplete="name" required /></label>
      <label>Rating
        <select name="rating" required>
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Great</option>
          <option value="3">3 — Good</option>
          <option value="2">2 — Fair</option>
          <option value="1">1 — Poor</option>
        </select>
      </label>
      <label>Review<textarea name="review" rows="5" minlength="10" maxlength="1000" required></textarea></label>
      <button class="review-form__submit" type="submit">Publish review</button>
    </form>
  `;
  document.body.appendChild(dialog);
  dialog.querySelector(".detail-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector("[data-review-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !activeDetails) return;
    const values = new FormData(form);
    const review = {
      author: String(values.get("name") || "StreamVibe member").trim(),
      content: String(values.get("review") || "").trim(),
      createdAt: new Date().toISOString(),
      id: activeDetails.id,
      location: "StreamVibe member",
      rating: Number(values.get("rating") || 5),
      type: activeType
    };
    const allReviews = readJSON(REVIEWS_KEY, []);
    writeJSON(REVIEWS_KEY, [review, ...(Array.isArray(allReviews) ? allReviews : [])].slice(0, 50));
    form.reset();
    dialog.close();
    renderReviews(activeDetails, activeType);
    showToast("Your review has been published on this device.");
  });
  return dialog;
}

function openReviewDialog() {
  ensureReviewDialog().showModal();
}

function getLocalReviews(id, type) {
  const reviews = readJSON(REVIEWS_KEY, []);
  return (Array.isArray(reviews) ? reviews : []).filter(
    (review) => String(review.id) === String(id) && review.type === type
  );
}

function renderSeasons(details) {
  const mainContent = document.querySelector(".open-main .main-content");
  if (!mainContent) return;
  const seasons = (details.seasons || []).filter((season) => season.season_number > 0);
  if (!seasons.length) return;

  const section = document.createElement("section");
  section.className = "content detail-seasons";
  section.innerHTML = `
    <div class="detail-seasons__header">
      <div>
        <h2 class="section-description">Seasons and Episodes</h2>
        <p class="detail-section-meta">${details.number_of_seasons || seasons.length} seasons</p>
      </div>
      <label>
        <span class="sr-only">Choose a season</span>
        <select data-season-select>
          ${seasons
            .map((season) => `<option value="${season.season_number}">Season ${String(season.season_number).padStart(2, "0")}</option>`)
            .join("")}
        </select>
      </label>
    </div>
    <div class="detail-episodes" data-episode-list aria-live="polite"></div>
  `;
  mainContent.prepend(section);

  const select = section.querySelector("[data-season-select]");
  select.addEventListener("change", () => loadSeasonEpisodes(details.id, select.value, section));
  section.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-episode-preview]")) openTrailerDialog();
  });
  loadSeasonEpisodes(details.id, select.value, section);
}

async function loadSeasonEpisodes(showId, seasonNumber, section) {
  const requestId = ++seasonRequestId;
  const list = section.querySelector("[data-episode-list]");
  list.innerHTML = renderEpisodeSkeletons();
  try {
    const season = await tmdbFetch(`tv/${showId}/season/${seasonNumber}`);
    if (requestId !== seasonRequestId) return;
    const episodes = season.episodes || [];
    list.innerHTML = episodes.length
      ? episodes.map(episodeTemplate).join("")
      : '<p class="detail-empty">Episode information is not available.</p>';
  } catch (error) {
    if (requestId !== seasonRequestId) return;
    list.innerHTML = `<div class="detail-empty"><p>${escapeHTML(error.message || "Unable to load episodes.")}</p><button type="button" data-season-retry>Try again</button></div>`;
    list.querySelector("[data-season-retry]")?.addEventListener("click", () =>
      loadSeasonEpisodes(showId, seasonNumber, section)
    );
  }
}

function episodeTemplate(episode) {
  const runtime = episode.runtime
    ? episode.runtime >= 60
      ? `${Math.floor(episode.runtime / 60)}h ${episode.runtime % 60}min`
      : `${episode.runtime}min`
    : "Runtime unavailable";
  return `
    <article class="detail-episode">
      <span class="detail-episode__number">${String(episode.episode_number).padStart(2, "0")}</span>
      <figure><img src="${getImage(episode.still_path, "w300", "/asset/images/hero.png")}" alt="${escapeHTML(episode.name)}" loading="lazy" decoding="async" /></figure>
      <div class="detail-episode__content">
        <div><h3>${escapeHTML(episode.name || `Episode ${episode.episode_number}`)}</h3><span>${runtime}</span></div>
        <p>${escapeHTML(episode.overview || "No episode description is available.")}</p>
      </div>
      <button type="button" data-episode-preview aria-label="Preview ${escapeHTML(episode.name || `episode ${episode.episode_number}`)}">▶</button>
    </article>`;
}

function renderEpisodeSkeletons() {
  return Array.from({ length: 3 }, () => '<div class="episode-skeleton" aria-hidden="true"></div>').join("");
}

function findContentSection(label) {
  return Array.from(document.querySelectorAll(".main-content .content")).find(
    (content) => content.querySelector(".head-box h3")?.textContent?.trim() === label
  );
}

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("This browser could not save your change.");
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
