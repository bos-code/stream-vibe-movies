import { getJSON } from "./helpers";
import { API_URL } from "./configs";

console.log(API_URL);

const getMovieData = async function () {
  try {
    const data = await getJSON(`${API_URL}`);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

// // getMovieData();


// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjVjOGEwM2E0OTY2NWExNjc4YjQ3YzRlNGE2NTNhZiIsIm5iZiI6MTczNTc1MDQ0MC4wMSwic3ViIjoiNjc3NTczMjgxOTRiNTgxNmQ3NjEzYjAzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.rrD9n7tnIMUfuxs3Wh1wWMqzB3dSr4Ds4uiqCeapjTE'
//   }
// };

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));
