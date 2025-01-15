const heroContainer = document.querySelector(".bgimages");

function populateHeroImages() {
    heroContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= 36; i++) {
        const img = document.createElement("img");

        img.className = "hero";
        img.src = `/asset/images/Image-${i}.png`;
        img.alt = "";

        fragment.appendChild(img);
    }

    heroContainer.appendChild(fragment);
}

populateHeroImages();