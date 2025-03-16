import "../../sass/main.scss";
import "core-js/stable";
import "regenerator-runtime/runtime";

import {
  dataRel,
  genDDta,
  genDDtatv,
  MustTv,
  mustWatchData,
  newTv,
  trendingData,
  trendingTv
} from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import { renderNewRelsease } from "../views/newRelease.js";
import { renderMustWatch } from "../views/mustWatchView.js";
import { renderTv } from "../views/trendingTvView.js";
import { renderNewTv } from "../views/tvnewView.js";
import { renderMustWatchTv } from "../views/tvMustView.js";
import { creatSwipers } from "../swiper.js";
import { populateHeroImages } from "../views/heroView.js";
import {
  renderMoviesGenres,
  renderMoviesGenres10
} from "../views/genreView.js";
import { renderTvGenres, renderTvGenres10 } from "../views/genreTv.js";

const imagePaths = [
  ...dataRel,
  ...datast,
  ...trendingData,
  ...trendingTv,
  ...MustTv,
  ...mustWatchData
].flatMap((image) => image.poster_path); // Extract `poster_path` from each object
populateHeroImages(imagePaths);

export function moviesInit() {
  renderNewRelsease(dataRel);
  renderHero(datast);
  rendertrends(trendingData);
  renderMustWatch(mustWatchData);
  renderTv(trendingTv);
  renderNewTv(newTv);
  renderMustWatchTv(MustTv);
  renderMoviesGenres(genDDta);
  renderMoviesGenres10(genDDta);
  renderTvGenres(genDDtatv);
  renderTvGenres10(genDDtatv);
  creatSwipers();
}

document.querySelectorAll(".cat").forEach((ul) => {
  ul.addEventListener("click", (event) => {
    const listItem = event.target.closest("li"); // Finds the nearest <li> ancestor
    if (listItem) windowChange();
  });
});

function windowChange() {
  const currentUrl = window.location.href; // Get full URL
  const newUrl =
    currentUrl.slice(0, currentUrl.lastIndexOf("/") + 1) + "display.html"; // Replace movies.html with display.html
  window.location.href = newUrl; // Redirect to the new URL
}
