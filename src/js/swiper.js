import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function swiper(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

  Object.assign(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: false,
    navigation: {
      nextEl: ".btnLeft",
      prevEl: ".btnRight"
    },
    breakpoints: {
      "@0.00": {
        slidesPerView: 4,
        spaceBetween: 10
      },
      "@0.75": {
        slidesPerView: 6,
        spaceBetween: 20
      },

      "@1.50": {
        slidesPerView: 8,
        spaceBetween: 10
      }
    }
  });

  swiperEl.initialize();
}

function moviesSwp(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

  Object.assign(swiperEl, {
    slidesPerView: 1,
    // spaceBetween: 20,
    pagination: true,
    navigation: true,
    scrollbar: true,
    speed: 300
  });

  swiperEl.initialize();
}

function slider(parentEl, next, prev) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

  Object.assign(swiperEl, {
    slidesPergroup: 4,
    slidesPerView: 5,
    spaceBetween: 30,
    pagination: true,
    navigation: {
      nextEl: next,
      prevEl: prev
    },
    speed: 300
  });

  // swiperEl.initialize();
}

export function createSwiper(el, config = {}) {
  if (!document.querySelector(el)) return;

  const catSwiper = new Swiper(el, {
    modules: [Navigation, Pagination],
    slidesPerView: 4,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    loop: true,
    ...config
  });

  // Pagination
  const pagination = document.querySelector("#categories-swiper #pagination");

  if (pagination) {
    pagination.innerHTML = "";

    const views = Math.ceil(
      catSwiper.slides.length / catSwiper.slidesPerViewDynamic()
    );

    for (let index = 0; index < views; index++) {
      const activeTemp = '<div class="w-4 rounded-[100px] h-1 bg-red45"></div>';
      const inactiveTemp =
        '<div class="w-4 rounded-[100px] h-1 bg-bk20"></div>';

      if (index === catSwiper.activeIndex) {
        pagination.insertAdjacentHTML("beforeend", activeTemp);
      } else {
        pagination.insertAdjacentHTML("beforeend", inactiveTemp);
      }
    }
  }

  // Navigation
  document.querySelector(`${el} #prev-slide`).addEventListener("click", () => {
    catSwiper.slidePrev();
    updatePagination();
  });

  document.querySelector(`${el} #next-slide`).addEventListener("click", () => {
    catSwiper.slideNext();
    updatePagination();
  });

  function updatePagination() {
    document
      .querySelector(`${el} #pagination .bg-red45`)
      ?.classList?.add?.("bg-bk20");

    document
      .querySelector(`${el} #pagination .bg-red45`)
      ?.classList?.remove?.("bg-red45");

    document
      .querySelector(
        `${el} #pagination div:nth-child(${catSwiper.activeIndex + 1})`
      )
      ?.classList?.add?.("bg-red45");
  }
}

// moviesSwp(".moviesSwiper");
// slider(".cat", ".nx-1", ".pv-1");
// slider(".cat-2", ".nx-2", ".pv-2");
// cardSwiper(".myreview");
// swiper(".mySwiper");
