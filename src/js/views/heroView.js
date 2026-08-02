const heroContainer = document.querySelector(".bgimages");
const FALLBACK_IMAGES = Array.from(
  { length: 36 },
  (_, index) => `/asset/images/Image-${index + 1}.png`
);

 export function getRandomImages(imagesArray) {
    if (imagesArray.length <= 36) {
        return imagesArray; // Return all if there are 36 or fewer images
    }
    
    const shuffled = [...imagesArray].sort(() => 0.5 - Math.random()); // Shuffle a copy
    return shuffled.slice(0, 36); // Pick first 36
}



export function populateHeroImages(imagesArray) {
    const remoteImages = imagesArray
      .filter(Boolean)
      .map((image) => `https://image.tmdb.org/t/p/w342${image}`);
    const images = getRandomImages(
      remoteImages.length >= 18 ? remoteImages : FALLBACK_IMAGES
    );
    if(!heroContainer)return
    heroContainer.innerHTML = "";

    const fragment = document.createDocumentFragment(); 
    images.forEach((image, index) => {
        const img = document.createElement("img");
        // Use w342 (not original) — these are small grid thumbnails, not hero posters
        img.src = image;
        img.alt = "";
        img.className = "bgimages img";
        img.decoding = "async";
        // Only eagerly load the first 4 — the rest are below/off screen
        if (index >= 4) img.loading = "lazy";
        fragment.appendChild(img);
    });
    heroContainer.appendChild(fragment);
}
