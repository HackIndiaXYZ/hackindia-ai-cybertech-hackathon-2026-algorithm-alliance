import { renderNavbar } from "./components/navbar.js";
import { notify } from "./components/notification.js";
import { applyAccessibility } from "./utils/accessibility.js";

renderNavbar();
applyAccessibility();

const page = document.body.dataset.page;

const modules = {
  login: "./auth.js",
  register: "./auth.js",
  dashboard: "./dashboard.js",
  scan: "./scan.js",
  result: "./result.js",
  guardian: "./guardian.js",
  coach: "./coach.js",
  history: "./history.js",
  settings: "./settings.js"
};

if (modules[page]) {
  import(modules[page])
    .then(module => module.init())
    .catch(error => {
      notify(
        `This screen could not load: ${error.message}`,
        true
      );
    });
}