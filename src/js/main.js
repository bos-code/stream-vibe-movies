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
import { initDiscoveryPage } from "./discovery";
import { initSupportPage } from "./support";
import { initSubscriptionPage } from "./subscription";

initNavigation();
initSearch();
initNotifications();
initFAQ();
initMediaRouting();
initDetailPage();
initHomePage();
initSupportPage();
initSubscriptionPage();

if (document.querySelector("#categories, #heroSlides, #trends, #tvView")) {
  const { moviesInit } = await import("./controller/controller");
  await moviesInit();
  initDiscoveryPage();
}
