import gsap from "gsap";

const images = document.querySelector(".bgimages");
const header = document.querySelector(".header");
const heroImages = document.querySelectorAll(".bgimages img");
const logoItems = document.querySelectorAll("#logo path");

export function animateImages() {
  if (!images ) return;
  if (images && header) {
    images.classList.remove(".hidden");
   

    // const center = (windowWidth / 2 - distance / 2) / 2;
    const tl = gsap.timeline();

    tl.from(heroImages, {
      duration: 1,
      y: -50,
      opacity: 0,
      rotationY: -360,
      // scrollTo: 50,
      stagger: 0.02,
      ease: "back"
    });
    tl.to(images, {
      duration: 2,
      // x: center,
      ease: "back"
    });
  } else {
    console.error("Elements not found in the DOM");
  }
}
function logo() {
  gsap.from(logoItems, {
    opacity: 0,
    duration: .9,
    scale: 0.2,
    y: -30,
    x: -130,
    rotationX: 490,
    stagger: 0.3,
    ease: "back",
    delay: 0.5,
    
  });
}
const list = ['hash', 'load']
list.forEach(function(listern){
  window.addEventListener(`${listern}`, logo)
})
window.addEventListener("load", animateImages);

// window.addEventListener("scroll", () => {
//   console.log(window.scrollX);
// });
