import "../../sass/main.scss";

import { dataRel, trendingData } from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import { renderNewRelsease } from "../views/newRelease.js";

const movies = await datast.results;
const relData = await dataRel.results;
const trendData = await trendingData.results;
//
console.log(relData)
renderNewRelsease(relData);
renderHero(movies);
rendertrends(trendData);
