import { AJAX } from "../helpers";

import { API_CONFIG, TMDB_ENDPOINTS } from "../config";

// const state
 class model {
  constructor() {
    this.API_CONFIG = API_CONFIG;
    this.state = {
        movies: []
    }
  }

  async fetchData(endpoint, bodyData = null, headers = {}) {
    try {
      const fullEndpoint = endpoint;
      return await AJAX(fullEndpoint, bodyData, headers);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}
async function fetchGenres(type) {
  try {
    const url = `https://api.themoviedb.org/3/genre/${type}/list?language=en`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjVjOGEwM2E0OTY2NWExNjc4YjQ3YzRlNGE2NTNhZiIsIm5iZiI6MTczNTc1MDQ0MC4wMSwic3ViIjoiNjc3NTczMjgxOTRiNTgxNmQ3NjEzYjAzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rrD9n7tnIMUfuxs3Wh1wWMqzB3dSr4Ds4uiqCeapjTE"
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
   
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}


const data = new model();
export const datast = await data.fetchData(
  TMDB_ENDPOINTS[1],
  null,
  (Headers = API_CONFIG)
);
export const dataRel = await data.fetchData(
  TMDB_ENDPOINTS[5],
  null,
  (Headers = API_CONFIG)
);
export const trendingData = await data.fetchData(
  TMDB_ENDPOINTS[0],
  null,
  (Headers = API_CONFIG)
);
export const mustWatchData = await data.fetchData(
  TMDB_ENDPOINTS[3],
  null,
  (Headers = API_CONFIG)
);
export const trendingTv = await data.fetchData(
  TMDB_ENDPOINTS[6],
  null,
  (Headers = API_CONFIG)
);
export const newTv = await data.fetchData(
  TMDB_ENDPOINTS[7],
  null,
  (Headers = API_CONFIG)
);
export const MustTv = await data.fetchData(
  TMDB_ENDPOINTS[8],
  null,
  (Headers = API_CONFIG)
);

export const genDDta = await fetchGenres("movie");
export const genDDtatv =await fetchGenres("tv");


