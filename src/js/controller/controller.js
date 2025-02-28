import "../../sass/main.scss";

import { dataRel, mustWatchData, trendingData, trendingTv } from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import { renderNewRelsease } from "../views/newRelease.js";
import { renderMustWatch } from "../views/mustWatchView.js";
import { renderTv } from "../views/trendingTvView.js";

const movies =  datast;
const ratedData =  mustWatchData;
const relData =  dataRel;
const trendData =  trendingData;
const trendingTvData = trendingTv;
renderNewRelsease(relData);
renderHero(movies);
rendertrends(trendData);
renderMustWatch(ratedData);
renderTv(trendingTvData)