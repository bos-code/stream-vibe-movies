import { async } from "regenerator-runtime";
import 'core-js/stable';


// export default class View {
//     constructor(containerSelector) {
//       this.catalogEl= document.querySelector(containerSelector);
//     }
  
//     #clear(){
//       this.catalogEl.innerHTML = '';
//     }
//     render(data) {
//       if (!this.catalogEl) {
//         console.error("catalogElelement not found");
//         return;
//       }
//    // Clear previous content
  
//       if (!data || !data.results || !Array.isArray(data.results)) {
//         this.catalogEl.innerHTML = '<p>No data available</p>';
//         return;
//       }
  
//       const list = document.createElement('ul');
//       data.results.forEach(item => {
//         const listItem = document.createElement('li');
//         listItem.textContent = item.title || item.name || "Unknown Title";
//         list.appendChild(listItem);
//       });
  
//       this.catalogEl.appendChild(list);
//     }
//   }

  

export default class View {
  constructor(containerSelector) {
      this.container = document.querySelector(".moviesHeader");
  }
// this.container.innerHTML = ''
  render(data) {
      if (!data || !data.results) {
          this.container.innerHTML = "<p>No data available.</p>";
          return;
      }

      this.container.innerHTML = data.results
          .map(item => `
              <div class="movie">
                  <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                  <h3>${item.title || item.name}</h3>
                  <p>⭐ ${item.vote_average} | 📅 ${item.release_date || item.first_air_date}</p>
              </div>
          `)
          .join('');
  }
}
