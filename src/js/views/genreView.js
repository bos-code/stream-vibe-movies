import { View } from "./view";

async function genreTemplate(item) {
  return `
     <li class="catItems swiper-slide" data-id="${item.ID}">
            <div class="gridImg">
              <img src="/asset/images/Image-18.png" alt="" />
              
            </div>
            <div class="title">
              <p class="catName">${item.name}</p>
              <img src="/asset/svg/arrl.svg" alt="" />
            </div>
          </li>
    `;
}

// Initialize the View
const moviesGenreView = View("#categories");

// Fetch movie trends and render them
export async function renderMoviesGenres(data) {
  moviesGenreView.render(data, genreTemplate);
}
