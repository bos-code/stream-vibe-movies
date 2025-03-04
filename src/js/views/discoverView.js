export function renderHero(movies) {
  const parentEl = document.getElementById("heroSlides");
  if(!parentEl)return
  parentEl.innerHTML = "";
  movies.forEach((dataVal) => {
   
      const discoverTemp = `<div class="swiper-slide w-1/12 mx-auto" data-ID="${
        dataVal.id
      }">
      <figure>
        <img src="${
          dataVal.poster_path
          ? `https://image.tmdb.org/t/p/w500${dataVal.poster_path}`
          : "/asset/images/hero.png"
        }" alt="${dataVal.title}" />
      </figure>
          <div class="overlay">
            <div class="textbox">
              <h1 class="heading-primary">${dataVal.title}</h1>
              <p class="section-description text-center">
                ${dataVal.overview || "No description available."}
              </p>
            </div>
            <div class="pagination-hero">
              <img src="/asset/svg/ButtonR.svg" alt="button right" id="prev-slide" />
              <div class="dots flex justify-center items-center" id="pagination"></div>
              <img src="/asset/svg/ButtonL.svg" alt="button left" id="next-slide" />
            </div>
          </div>
        </div>
      `;
    parentEl.innerHtml= ''
      parentEl.innerHTML += discoverTemp;
    
  });
}