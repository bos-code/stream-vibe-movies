import "../sass/main.scss";
import { initFAQ } from "../js/faq";
import { initMediaRouting } from "./routing";
import { initNavigation } from "./navigation";
import { initNotifications } from "./notifications";
import { initSearch } from "./search";
import { initHomePage } from "./home";
import { initDiscoveryPage } from "./discovery";
import { initSupportPage } from "./support";
import { initSubscriptionPage } from "./subscription";

initNavigation();
initSearch();
initNotifications();
initFAQ();
initMediaRouting();
initHomePage();
initSupportPage();
initSubscriptionPage();

if (document.querySelector(".open-main")) {
  const { initDetailPage } = await import("./detail");
  initDetailPage();
}

if (document.querySelector(".bgimages")) {
  const { initAnimations } = await import("./animations");
  initAnimations();
}

if (document.querySelector("#categories, #heroSlides, #trends, #tvView")) {
  const { moviesInit } = await import("./controller/controller");
  await moviesInit();
  initDiscoveryPage();
}
