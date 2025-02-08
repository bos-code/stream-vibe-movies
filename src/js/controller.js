import "../sass/main.scss";
// import '../public/css/main.css'
import * as model from "./model.js";
import * as view from "./views/heroView.js";
import "./animations.js";

import { createSwiper } from "./swiper.js";

createSwiper("#categories-swiper");
createSwiper("#myreview", {
  slidesPerView: 3,
  spaceBetween: 20,
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 20
    },

    "@1.50": {
      slidesPerView: 2,
      spaceBetween: 20
    }
  }
});
