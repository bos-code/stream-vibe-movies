import { AJAX } from "../helpers";

import { API_CONFIG, TMDB_ENDPOINTS } from "../config";

// const state
export default class model {
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

