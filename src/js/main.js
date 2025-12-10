import "../scss/main.scss";

import "../js/lucide-icons/lucide.js";

import { PageDashboard } from "./classes/pages/PageDashboard.js";
import { PageInventario } from "./classes/pages/PageInventario.js";

let pageDashboard = new PageDashboard();
let pageInventario = new PageInventario();

const currentLocation = window.location.pathname;
console.log(currentLocation);

if (currentLocation === "/") {
  pageDashboard.init();
} else if (currentLocation === "/src/pages/inventario.html") {
  pageInventario.init();
}
