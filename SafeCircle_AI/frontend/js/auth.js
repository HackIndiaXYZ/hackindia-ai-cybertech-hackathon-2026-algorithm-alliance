import { CONFIG } from "./config.js";
import { request } from "./api.js";
import { notify } from "./components/notification.js";

export function init() {
  const page = document.body.dataset.page;
  const form = document.querySelector("#auth-form");
  const button = document.querySelector("#auth-submit");
  const credentials = document.querySelector("#credentials");

  /*
    Demo access does not authenticate anyone.
    Hide and disable credential inputs so no passwords are collected.
  */
  if (CONFIG.DEMO_MODE) {
    credentials.hidden = true;

    credentials.querySelectorAll("input").forEach(input => {
      input.disabled = true;
    });

    document.querySelector("#auth-description").textContent =
      "Demo access only. No account is created and no password is collected.";

    button.textContent = "Continue to demo";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (CONFIG.DEMO_MODE) {
      location.href = "dashboard.html";
      return;
    }

    button.disabled = true;

    try {
      const payload = {
        email: document.querySelector("#email").value.trim(),
        password: document.querySelector("#password").value
      };

      if (page === "register") {
        payload.name = document.querySelector("#name").value.trim();
      }

      await request(`/api/auth/${page}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      document.querySelector("#password").value = "";

      if (page === "register") {
        notify(
          "Registration submitted. Complete any required verification, then log in."
        );
      } else {
        location.href = "dashboard.html";
      }
    } catch (error) {
      notify(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
}

export async function logout() {
  if (!CONFIG.DEMO_MODE) {
    await request("/api/auth/logout", {
      method: "POST"
    });
  }

  location.href = "login.html";
}