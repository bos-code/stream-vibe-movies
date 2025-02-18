import { getJSON } from "../helpers";
import { API_URL } from "../configs";
import { async } from "regenerator-runtime";
import 'core-js/stable';
import { createLogger } from "vite";
console.log(API_URL, async);



  

// export default class Model {
// 	constructor(apiKey, baseUrl = 'https://api.themoviedb.org/3') {
// 	  this.apiKey = apiKey;
// 	  this.baseUrl = baseUrl;
// 	}
  
// 	async fetchData(endpoint, params = {}) {
// 	  const url = new URL(`${this.baseUrl}${endpoint}`);
// 	  url.searchParams.append('api_key', this.apiKey);
  
// 	  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
// 	  try {
// 		const response = await fetch(url);
// 		if (!response.ok) {
// 		  throw new Error(`HTTP error! Status: ${response.status}`);
// 		}
// 		return await response.json();
// 	  } catch (error) {
// 		console.error('Fetch error:', error);
// 	  }
// 	}
//   }

export default class Model {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async fetchData(endpoint, params = {}) {
        params.api_key = this.apiKey; // Append API key to parameters
        const url = `${this.baseUrl}${endpoint}?${new URLSearchParams(params)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log(data)
            return data
        } catch (error) {
            console.log("Fetch error:",);
        }
    }
}

  