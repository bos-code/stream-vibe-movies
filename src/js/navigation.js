import {
  closeLayer,
  closeWhenAnotherLayerOpens,
  openLayer,
  trapFocus
} from "./ui";

const ROUTES = {
  home: "./index.html",
  "movies & shows": "./movies.html",
  support: "./support.html",
  subcription: "./subscription.html",
  subscription: "./subscription.html"
};

export function initNavigation() {
  enhanceDocumentAccessibility();
  setSectionIds();
  wireMobileMenu();
  repairNavLinks();
  repairFooterLinks();
  repairSocialLinks();
  setCurrentYear();
  wireTrialButtons();
  optimizeImages();
}

function enhanceDocumentAccessibility() {
  const main = document.querySelector("main");
  if (main) {
    main.id ||= "main-content";
    main.tabIndex = -1;
    if (!document.querySelector(".skip-link")) {
      const skipLink = document.createElement("a");
      skipLink.className = "skip-link";
      skipLink.href = `#${main.id}`;
      skipLink.textContent = "Skip to main content";
      document.body.prepend(skipLink);
    }
  }

  document.querySelectorAll("button:not([type])").forEach((button) => {
    button.type = "button";
  });
}

function setSectionIds() {
  document.querySelector(".features")?.setAttribute("id", "devices");
  document.querySelector(".FAQ")?.setAttribute("id", "faq");
  document.querySelector(".subscription")?.setAttribute("id", "subscription");
  document.querySelector(".support-header")?.setAttribute("id", "contact");
  document.querySelector(".support-form")?.setAttribute("id", "support-form");
}

function wireMobileMenu() {
  const menuButton = document.querySelector(".menuBar");
  const mobileNav = document.querySelector(".navmobile");
  const mobileItems = mobileNav?.querySelector(".nav-items");
  if (!menuButton || !mobileNav) return;

  mobileItems?.classList.remove("hidden");
  mobileNav.id ||= "mobile-navigation";
  mobileNav.setAttribute("aria-hidden", "true");
  mobileNav.inert = true;
  menuButton.setAttribute("role", "button");
  menuButton.setAttribute("tabindex", "0");
  menuButton.setAttribute("aria-controls", mobileNav.id);
  menuButton.setAttribute("aria-label", "Open menu");
  menuButton.setAttribute("aria-expanded", "false");

  const backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.className = "mobile-nav-backdrop";
  backdrop.setAttribute("aria-label", "Close menu");
  mobileNav.before(backdrop);

  const openMenu = () => {
    openLayer(mobileNav, {
      name: "navigation",
      trigger: menuButton,
      openClass: "slide-in",
      focusTarget: mobileItems?.querySelector("a")
    });
    menuButton.setAttribute("aria-label", "Close menu");
    backdrop.classList.add("is-open");
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    closeLayer(mobileNav, {
      trigger: menuButton,
      openClass: "slide-in",
      restoreFocus
    });
    menuButton.setAttribute("aria-label", "Open menu");
    backdrop.classList.remove("is-open");
  };

  const toggleMenu = () => {
    if (mobileNav.classList.contains("slide-in")) closeMenu();
    else openMenu();
  };

  menuButton.addEventListener("click", toggleMenu);
  if (!(menuButton instanceof HTMLButtonElement)) {
    menuButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });
  }

  mobileNav.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (target?.closest("a")) {
      closeMenu({ restoreFocus: false });
    }
  });

  mobileNav.addEventListener("keydown", (event) => trapFocus(mobileNav, event));
  backdrop.addEventListener("click", () => closeMenu());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu({ restoreFocus: false });
  });
  closeWhenAnotherLayerOpens("navigation", closeMenu);
}

function repairNavLinks() {
  document.querySelectorAll(".mainNavLink").forEach((link) => {
    const key = normalizeText(link.textContent);
    const route = ROUTES[key];
    if (!route) return;

    link.href = route;
    if (key === "subcription") link.textContent = "subscription";
    if (isActiveRoute(route)) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    }
  });
}

function repairFooterLinks() {
  const footerMap = {
    Categories: "./index.html#categories-swiper",
    Devices: "./index.html#devices",
    Pricing: "./subscription.html",
    FAQ: "./index.html#faq",
    Genres: "./movies.html#movies",
    Trending: "./movies.html#categories-swiper-3",
    "New Release": "./movies.html#categories-swiper-4",
    Popular: "./movies.html#categories-swiper-5",
    "Contact Us": "./support.html#support-form",
    "New Episodes": "./movies.html#categories-swiper-9",
    Plans: "./subscription.html",
    Features: "./subscription.html#comparison"
  };

  document.querySelectorAll(".footer a").forEach((link) => {
    const route = footerMap[link.textContent.trim()];
    if (route) link.href = route;
  });
}

function repairSocialLinks() {
  const destinations = [
    "https://www.facebook.com/",
    "https://www.linkedin.com/",
    "https://x.com/"
  ];
  document.querySelectorAll("#social-media-icons a").forEach((link, index) => {
    link.href = destinations[index] || destinations[0];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function wireTrialButtons() {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    const text = normalizeText(link.textContent);
    if (text.includes("free trail") || text.includes("free trial")) {
      link.href = "./subscription.html?plan=standard&trial=true";
      link.textContent = "Start a Free Trial";
    }
  });
}

function optimizeImages() {
  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("decoding")) image.decoding = "async";
    const aboveFold = Boolean(image.closest(".nav, .header, .open-hero, .support-intro"));
    if (!image.hasAttribute("loading")) image.loading = aboveFold ? "eager" : "lazy";
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
  if (route.includes("index.html")) return page === "" || page === "index.html";
  return route.includes(page);
}
