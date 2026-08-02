import gsap from "gsap";

const images = document.querySelector(".bgimages");
const header = document.querySelector(".header");
const heroImages = document.querySelectorAll(".bgimages img");
const logoItems = document.querySelectorAll("#logo path");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function animateImages() {
  if (!images) return;
  images.classList.remove("hidden");
  if (reducedMotion.matches) {
    gsap.set(heroImages, { clearProps: "all" });
    return;
  }
  if (images && header) {
    const tl = gsap.timeline();

    tl.from(heroImages, {
      duration: 1,
      y: -50,
      opacity: 0,
      rotationY: -360,
      stagger: 0.02,
      ease: "back"
    });
    tl.to(images, {
      duration: 2,
      ease: "back"
    });
  }
}
function logo() {
  if (!logoItems.length || reducedMotion.matches) return;
  gsap.from(logoItems, {
    opacity: 0,
    duration: 0.9,
    scale: 0.2,
    y: -30,
    x: -130,
    rotationX: 490,
    stagger: 0.3,
    ease: "back",
    delay: 0.5
  });
}
export function initAnimations() {
  if (document.readyState === "complete") {
    logo();
    animateImages();
    return;
  }

  window.addEventListener("load", logo, { once: true });
  window.addEventListener("load", animateImages, { once: true });
}
