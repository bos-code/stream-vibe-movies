import Swiper from "swiper";
import { Scrollbar } from "swiper/modules";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function createSwiper(el, config = {}) {
  if (!document.querySelector(el)) return;

  const catSwiper = new Swiper(el, {
    modules: [Navigation, Pagination, EffectFade,Autoplay],
    spaceBetween: 10,
    mousewheel: {
         invert: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".dots",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 4
    },
    loop: true,
    ...config
  });



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

export function creatSwipers() {
  const swiperSelectors = [
    "#categories-swiper-7",
    "#categories-swiper-10",
    "#categories-swiper-9",
    "#categories-swiper-8",
    "#categories-swiper-5"
  ];
  swiperSelectors.forEach((selector) => {
    createSwiper(selector, {
      slidesPerView: 4,
      breakpoints: {
        375: {
          slidesPerView: 2
        },
        640: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        },
        1024: {
          slidesPerView: 4
        }
      }
    });
  });
  const swiperSelector5 = [
    "#categories-swiper",
    "#categories-swiper-2",
    "#categories-swiper-3",
    "#categories-swiper-4",
    "#categories-swiper-6"
  ];
  swiperSelector5.forEach((selector) => {
    createSwiper(selector, {
      slidesPerView: 5,
      breakpoints: {
        375: {
          slidesPerView: 2
        },

        768: {
          slidesPerView: 3
        },
        920: {
          slidesPerView: 4
        },
        1200: {
          slidesPerView: 5
        }
      }
    });
  });

  createSwiper("#myreview", {
    slidesPerView: 2,
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
  createSwiper("#casts-swiper", {
    slidesPerView: 10,
    spaceBetween: 10,
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
  createSwiper("#hero-swiper", {
    
    slidesPerView: 1,
    effect: "fade", // Enables fade effect
   
    autoplay: {
      delay: 3000, // 3-second auto slide
      disableOnInteraction: false, // Keeps autoplay running
    },
  });
}
