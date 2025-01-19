import "../sass/main.scss";
// import '../public/css/main.css'
import * as model from "./model.js";
import * as view from "./views/heroView.js";
import "./animations.js";

import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

// const swiper = new Swiper(".swiper", {
//   // Optional parameters
//   direction: "horizontal",
// //   loop: true,
// //   rewind: true,
// //   autoplay: {
// //     delay: 2500,
// //     disableOnInteraction: false,
// //   },
//   // If we need pagination
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
//   // Navigation arrows
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
// });

const mySwiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  document.getElementById("prev").addEventListener("click", function (el) {
    mySwiper.slidePrev()
  })

  document.getElementById("next").addEventListener("click", function (el) {
    mySwiper.slideNext()
  })
