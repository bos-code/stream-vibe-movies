import "../sass/main.scss";
import "../js/views/heroView";
import "../js/animations";
import { initDetailPage } from "./detail";
import { initFAQ } from "../js/faq";
import { initMediaRouting } from "./routing";
import { initNavigation } from "./navigation";
import { initNotifications } from "./notifications";
import { initSearch } from "./search";
import { initHomePage } from "./home";

initNavigation();
initSearch();
initNotifications();
initFAQ();
initMediaRouting();
initDetailPage();
initHomePage();

if (document.querySelector("#categories, #heroSlides, #trends, #tvView")) {
  const { moviesInit } = await import("./controller/controller");
  await moviesInit();
}
