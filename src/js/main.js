import "../scss/main.scss";

import "../js/lucide-icons/lucide.js";

import { PageDashboard } from "./classes/pages/PageDashboard.js";
import { PageInventario } from "./classes/pages/PageInventario.js";

let pageDashboard = new PageDashboard();
let pageInventario = new PageInventario();

pageDashboard.init();
pageInventario.init();
