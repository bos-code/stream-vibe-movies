import Swiper from "swiper";
import { Navigation, Pagination, EffectFade, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function createSwiper(el, config = {}) {
  const element = document.querySelector(el);
  if (!element) return;
  if (element.swiper) return element.swiper;

  const catSwiper = new Swiper(el, {
    modules: [Navigation, Pagination, EffectFade, Autoplay, Keyboard],
    spaceBetween: 10,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    navigation: {
      nextEl: `${el} #next-slide`,
      prevEl: `${el} #prev-slide`
    },
    pagination: {
      el: `${el} .dots`,
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 4
    },
    loop: element.querySelectorAll(".swiper-slide").length > 1,
    ...config
  });

  return catSwiper;
}

export function bindRangeControl(containerSelector, swiper) {
  const range = document.querySelector(`${containerSelector} input[type="range"]`);
  if (!range || !swiper) return;

  const max = Math.max(0, swiper.slides.length - 1);
  range.min = "0";
  range.max = String(max);
  range.step = "1";
  range.setAttribute("aria-label", "Browse carousel items");

  range.addEventListener("input", () => swiper.slideToLoop(Number(range.value)));
  swiper.on("realIndexChange", () => {
    range.value = String(Math.min(swiper.realIndex, max));
  });
}

// moviesSwp(".moviesSwiper");

export const SWIPER_SELECTOR_5_CONFIG = {
  slidesPerView: 2,
  breakpoints: {
    0: {
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
};
export const SWIPER_SELECTOR_4_CONFIG = {
  slidesPerView: 2,
  breakpoints: {
    0: {
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
};
const swiperSelectors = Array.from({ length: 10 }, (_, index) =>
  index === 0 ? "#categories-swiper" : `#categories-swiper-${index + 1}`
);

export function creatSwipers() {
  swiperSelectors.forEach((selector) => {
    const swiper = createSwiper(selector, SWIPER_SELECTOR_5_CONFIG);
    bindRangeControl(selector, swiper);
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

    autoplay: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? false
      : {
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true
        }
  });
}
