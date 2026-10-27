import { CONFIG } from "../config.js";
import { notify } from "./notification.js";

export function renderNavbar() {
  const header = document.querySelector("#navbar");

  // This HTML is fixed application markup, not user-provided content.
  header.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="index.html">
        <img src="assets/images/logo.svg" alt="">
        SafeCircle AI
      </a>

      <nav aria-label="Main navigation"></nav>
    </div>

    <div class="demo-banner"></div>
  `;

  const links = [
    ["dashboard", "Dashboard"],
    ["scan", "Check"],
    ["guardian", "Guardian demo"],
    ["coach", "Safety Coach"],
    ["history", "History"],
    ["settings", "Settings"],
    ["login", "Account"]
  ];

  const navigation = header.querySelector("nav");
  const currentPage = document.body.dataset.page;

  for (const [page, label] of links) {
    const link = document.createElement("a");

    link.href = `${page}.html`;
    link.textContent = label;

    if (page === currentPage) {
      link.setAttribute("aria-current", "page");
    }

    navigation.append(link);
  }

  header.querySelector(".demo-banner").textContent =
    CONFIG.DEMO_MODE
      ? "DEMO ONLY · Rule-based checks. No real authentication, notifications, or browser protection."
      : "API scan mode · Other features require their own backend integration.";

  if (!CONFIG.DEMO_MODE) {
    const logoutButton = document.createElement("button");

    logoutButton.textContent = "Logout";
    logoutButton.className = "secondary";

    logoutButton.addEventListener("click", async () => {
      try {
        const { logout } = await import("../auth.js");
        await logout();
      } catch (error) {
        notify(error.message, true);
      }
    });

    navigation.append(logoutButton);
  }
}