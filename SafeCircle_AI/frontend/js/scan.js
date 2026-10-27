import {
  analyzeContent,
  readData,
  writeData,
  saveSummary
} from "./api.js";

import { validateContent } from "./utils/validation.js";
import { notify } from "./components/notification.js";
import { setupQR } from "./qr.js";

export function init() {
  const form = document.querySelector("#scan-form");
  const type = document.querySelector("#content-type");
  const content = document.querySelector("#content");
  const button = document.querySelector("#scan-button");

  setupQR();

  type.addEventListener("change", () => {
    document.querySelector("#qr-section").hidden =
      type.value !== "qr";
  });

  document.querySelector("#sample-button")
    .addEventListener("click", () => {
      type.value = "message";

      document.querySelector("#qr-section").hidden = true;

      content.value =
        "URGENT: Your bank account will be blocked. " +
        "Complete KYC immediately and share your OTP at " +
        "http://bank-demo.example/verify";
    });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    button.disabled = true;
    notify("Checking content…");

    try {
      const value = content.value.trim();

      validateContent(type.value, value);

      const preferences = readData(
        "preferences",
        { mode: "child" },
        true
      );

      const result = await analyzeContent({
        kind: type.value,
        content: value,
        mode: preferences.mode
      });

      // The latest summary is needed by result.html.
      writeData("latestResult", result);

      if (document.querySelector("#save-history").checked) {
        saveSummary(result);
      }

      location.href = "result.html";
    } catch (error) {
      notify(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
}