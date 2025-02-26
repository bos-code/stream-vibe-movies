import "../../sass/main.scss";

import model, { trendingData } from "../model/model.js";
import { datast } from "../model/model.js";
import { renderHero } from "../views/discoverView.js";
import { rendertrends } from "../views/trendingView.js";
import View from "../views/view.js";
// import { movieTemplate } from "../views/discoverView.js";

const movies = await datast.results;

const trendData = await trendingData.results;
//

console.log(trendData);
renderHero(movies);
rendertrends(trendData)
