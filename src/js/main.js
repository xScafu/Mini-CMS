import "../scss/main.scss";

import "../js/lucide-icons/lucide.js";

import { NavMenu } from "./classes/components/NavMenu.js";

import { PageDashboard } from "./classes/pages/PageDashboard.js";
import { PageInventario } from "./classes/pages/PageInventario.js";
import { PageNegozio } from "./classes/pages/PageNegozio.js";
import { PageBilancio } from "./classes/pages/PageBilancio.js";
import { PageImpostazioni } from "./classes/pages/PageImpostazioni.js";
import { PageAccount } from "./classes/pages/PageAccount.js";

let navMenu = new NavMenu();

let pageDashboard = new PageDashboard();
let pageInventario = new PageInventario();
let pageNegozio = new PageNegozio();
let pageBilancio = new PageBilancio();
let pageImpostazioni = new PageImpostazioni();
let pageAccount = new PageAccount();

navMenu.init();

const currentLocation = window.location.pathname;
console.log(currentLocation);

if (currentLocation === "/") {
  pageDashboard.init();
} else if (currentLocation === "/src/pages/inventario.html") {
  pageInventario.init();
} else if (currentLocation === "/src/pages/negozio.html") {
  pageNegozio.init();
} else if (currentLocation === "/src/pages/bilancio.html") {
  pageBilancio.init();
} else if (currentLocation === "/src/pages/impostazioni.html") {
  pageImpostazioni.init();
} else if (currentLocation === "/src/pages/account.html") {
  pageAccount.init();
}
