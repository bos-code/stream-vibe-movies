import "../../sass/main.scss";
import * as model from "../model/model.js"
// import * as view from "../views/heroView.js"
// import discoverView from "../views/discoverView.js";
import "../animations.js";
import { async } from "regenerator-runtime";
import 'core-js/stable';
import {creatSwipers} from "../swiper.js";

creatSwipers();


export default class Controller {
  constructor(model, view) {
      this.model = model;
      this.view = view;
  }

  async loadContent(endpoint, params = {}) {
      const data = await this.model.fetchData('trending/all ');
      this.view.render(data);
  }
}

