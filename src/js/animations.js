import gsap from "gsap";

const images = document.querySelector(".bgimages");
const header = document.querySelector(".header");
const heroImages = document.querySelectorAll(".bgimages img");

export function animateImages() {
  if (images && header) {
    images.classList.remove(".hidden");
    const distance = images.clientWidth;
    const windowWidth = header.clientWidth;
    const center = (windowWidth / 2 - distance / 2 ) / 2;
    const tl = gsap.timeline();

    tl.from(heroImages, {
      duration: 1,
      y: 50,
      opacity: 0,
      rotateY: -360,
      stagger: 0.03,
      ease: "back",
    } );
    tl.to(images, {
        duration: 2,
        x: center,
        ease: "back",
      });
  } else {
    console.error("Elements not found in the DOM");
  }
}



window.addEventListener("load", animateImages);