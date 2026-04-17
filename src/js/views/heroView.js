const heroContainer = document.querySelector(".bgimages");

 export function getRandomImages(imagesArray) {
    if (imagesArray.length <= 36) {
        return imagesArray; // Return all if there are 36 or fewer images
    }
    
    let shuffled = imagesArray.sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, 36); // Pick first 36
}



export function populateHeroImages(imagesArray) {
    const images = getRandomImages(imagesArray.filter(Boolean));
    if(!heroContainer)return
    heroContainer.innerHTML = "";

    const fragment = document.createDocumentFragment(); 
    images.forEach((image, index) => {
        const img = document.createElement("img");
        // Use w342 (not original) — these are small grid thumbnails, not hero posters
        img.src = `https://image.tmdb.org/t/p/w342${image}`;
        img.alt = "Movie Poster";
        img.className = "bgimages img";
        img.decoding = "async";
        // Only eagerly load the first 4 — the rest are below/off screen
        if (index >= 4) img.loading = "lazy";
        fragment.appendChild(img);
    });
    heroContainer.appendChild(fragment);
}

