function swiper(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);

  Object.assign(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: false,
    navigation: {
      nextEl: ".btnLeft",
      prevEl: ".btnRight",
    },
    breakpoints: {
      "@0.00": {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      "@0.75": {
        slidesPerView: 6,
        spaceBetween: 20,
      },

      "@1.50": {
        slidesPerView: 8,
        spaceBetween: 10,
      },
    },
  });

  swiperEl.initialize();
}

swiper(".mySwiper");

function cardSwiper(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);

  Object.assign(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: false,
    navigation: {
      nextEl: ".btnLt",
      prevEl: ".btnRt",
    },
    breakpoints: {
      "@0.00": {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      "@1.50": {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });

  swiperEl.initialize();
}

cardSwiper(".myreview");
