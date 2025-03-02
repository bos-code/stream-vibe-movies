import "../../sass/main.scss";

import { dataRel, MustTv, mustWatchData, newTv, trendingData, trendingTv } from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import { renderNewRelsease } from "../views/newRelease.js";
import { renderMustWatch } from "../views/mustWatchView.js";
import { renderTv } from "../views/trendingTvView.js";
import { renderNewTv } from "../views/tvnewView.js";
import { renderMustWatchTv } from "../views/tvMustView.js";


renderNewRelsease(dataRel);
renderHero(datast);
rendertrends(trendingData);
renderMustWatch(mustWatchData);
renderTv(trendingTv)
renderNewTv(newTv)
renderMustWatchTv(MustTv)