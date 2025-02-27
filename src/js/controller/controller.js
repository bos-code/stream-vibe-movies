import "../../sass/main.scss";

import { dataRel, mustWatchData, trendingData } from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import { renderNewRelsease } from "../views/newRelease.js";
import { renderMustWatch } from "../views/mustWatchView.js";

const movies = await datast.results;
const ratedData = await mustWatchData.results;
const relData = await dataRel.results;
const trendData = await trendingData.results;
//
console.log(ratedData);
renderNewRelsease(relData);
renderHero(movies);
rendertrends(trendData);
renderMustWatch(ratedData);
