function swiper(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

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



function cardSwiper(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;
  Object.assign(swiperEl, {
    slidesPerView: 3,
    spaceBetween: 20,
    pagination: false,
    loop: true,
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



function moviesSwp(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

  Object.assign(swiperEl, {
    slidesPerView: 1,
    // spaceBetween: 20,
    pagination: true,
    navigation: true,
    scrollbar: true,
    speed: 300,
  });

  swiperEl.initialize();
}



function slider(parentEl) {
  const swiperEl = document.querySelector(`${parentEl}`);
  if (!swiperEl) return;

  Object.assign(swiperEl, {
    slidesPergroup: 4,
    slidesPerView: 5,
    spaceBetween: 30,
    pagination: true,
    navigation: true,
    // scrollbar: true,
    speed: 300,
  });

  swiperEl.initialize();
}

function main() {
  moviesSwp(".moviesSwiper");
  slider(".cat");
  slider(".cat-2");
  cardSwiper(".myreview");
  swiper(".mySwiper");
}

main()