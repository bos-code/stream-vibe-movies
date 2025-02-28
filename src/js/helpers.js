import { data } from "autoprefixer";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };
  
  // export const AJAX = async function (endpoint, bodyData = null, headers = {}) {
  //   try {
  //     const url = `https://api.themoviedb.org/3/${endpoint}?append_to_response=details`;
  //     const options = {
  //       method : 'GET',
  //       mode: "cors",
        
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...headers,
  //       },
  //     };
  
  //     if (bodyData) options.body = JSON.stringify(bodyData);
  
  //     const fetchPro = fetch(url, options);
  //     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  //     const data = await res.json();
  
  //     if (!res.ok) throw new Error(`${data.message || 'Request failed'} (${res.status})`);
  //     return data;
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  
  export const AJAX = async function (endpoint, bodyData = null, headers = {}) {
    try {
        let allResults = [];

        for (let page = 1; page <= 2; page++) { // Always fetch 5 pages (100 results)
            const url = `https://api.themoviedb.org/3/${endpoint}?page=${page}`;

            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            };

            if (bodyData) options.body = JSON.stringify(bodyData);

            const fetchPro = fetch(url, options);
            const res = await fetchPro;

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();

            if (data.results) {
                allResults = allResults.concat(data.results);
            }

            if (allResults.length >= 100) break; // Stop once we reach 100 results
        }

        return allResults.slice(0, 100); // Ensure exactly 100 results
    } catch (err) {
        console.error('Error in AJAX function:', err);
        throw err;
    }
};



  export function formatNumber(num) {
    if (num < 1000) {
        return num.toString();
    } else {
        return Math.ceil(num / 1000) + "k";
    }
}



export async function fetchMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?page=1`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjVjOGEwM2E0OTY2NWExNjc4YjQ3YzRlNGE2NTNhZiIsIm5iZiI6MTczNTc1MDQ0MC4wMSwic3ViIjoiNjc3NTczMjgxOTRiNTgxNmQ3NjEzYjAzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rrD9n7tnIMUfuxs3Wh1wWMqzB3dSr4Ds4uiqCeapjTE`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const dat = await response.json();
    return dat.runtime;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}



export function runTime(minutes) {
  if (!minutes || minutes < 0) return 'Invalid time';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 
    ? hours + "h " + mins + "min" 
    : mins + "min";
}
