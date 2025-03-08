const heroContainer = document.querySelector(".bgimages");

 export function getRandomImages(imagesArray) {
    if (imagesArray.length <= 36) {
        return imagesArray; // Return all if there are 36 or fewer images
    }
    
    let shuffled = imagesArray.sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, 36); // Pick first 36
}



export function populateHeroImages(imagesArray) {
    const images = getRandomImages(imagesArray);
    if(!heroContainer)return
    heroContainer.innerHTML = "";

    const fragment = document.createDocumentFragment(); 
    images.forEach((image) => {
        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/original${image}`;
        img.alt = "Movie Poster";
        img.classList.add("bgimages__img");
        img.className = "bgimages img";
        fragment.appendChild(img);
    });
        
    

    heroContainer.appendChild(fragment);
}

