const ROUTES = {
  home: "./index.html",
  "movies & shows": "./movies.html",
  support: "./support.html",
  subcription: "./index.html#subscription",
  subscription: "./index.html#subscription"
};

export function initNavigation() {
  setSectionIds();
  wireMobileMenu();
  repairNavLinks();
  repairFooterLinks();
  setCurrentYear();
  wireTrialButtons();
}

function setSectionIds() {
  document.querySelector(".features")?.setAttribute("id", "devices");
  document.querySelector(".FAQ")?.setAttribute("id", "faq");
  document.querySelector(".subscription")?.setAttribute("id", "subscription");
  document.querySelector(".support-header, form")?.setAttribute("id", "contact");
}

function wireMobileMenu() {
  const menuButton = document.querySelector(".menuBar");
  const mobileNav = document.querySelector(".navmobile");
  const mobileItems = mobileNav?.querySelector(".nav-items");
  if (!menuButton || !mobileNav) return;

  mobileItems?.classList.remove("hidden");
  menuButton.setAttribute("role", "button");
  menuButton.setAttribute("tabindex", "0");
  menuButton.setAttribute("aria-label", "Open menu");
  menuButton.setAttribute("aria-expanded", "false");

  const toggleMenu = () => {
    const isOpen = mobileNav.classList.toggle("slide-in");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  menuButton.addEventListener("click", toggleMenu);
  menuButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  mobileNav.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (target?.closest("a")) {
      mobileNav.classList.remove("slide-in");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      mobileNav.classList.remove("slide-in");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function repairNavLinks() {
  document.querySelectorAll(".mainNavLink").forEach((link) => {
    const key = normalizeText(link.textContent);
    const route = ROUTES[key];
    if (!route) return;

    link.href = route;
    if (key === "subcription") link.textContent = "subscription";
    if (isActiveRoute(route)) link.classList.add("is-active");
  });
}

function repairFooterLinks() {
  const footerMap = {
    Categories: "./index.html#categories-swiper",
    Devices: "./index.html#devices",
    Pricing: "./index.html#subscription",
    FAQ: "./index.html#faq",
    Genres: "./movies.html#movies",
    Trending: "./movies.html#categories-swiper-3",
    "New Release": "./movies.html#categories-swiper-4",
    Popular: "./movies.html#categories-swiper-5",
    "Contact Us": "./support.html#contact",
    "New Episodes": "./movies.html#categories-swiper-9",
    Plans: "./index.html#subscription",
    Features: "./index.html#devices"
  };

  document.querySelectorAll(".footer a").forEach((link) => {
    const route = footerMap[link.textContent.trim()];
    if (route) link.href = route;
  });
}

function wireTrialButtons() {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    const text = normalizeText(link.textContent);
    if (text.includes("free trail") || text.includes("free trial")) {
      link.href = "./index.html#subscription";
      link.textContent = "Start a Free Trial";
    }
  });
}

function setCurrentYear() {
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

function normalizeText(text = "") {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function isActiveRoute(route) {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if (route.includes("#subscription")) return window.location.hash === "#subscription";
  if (route.includes("index.html")) return page === "" || page === "index.html";
  return route.includes(page);
}
