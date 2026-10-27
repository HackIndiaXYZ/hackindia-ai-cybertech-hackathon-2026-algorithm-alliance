import {
  readData,
  writeData,
  clearDemoData
} from "./api.js";

import { applyAccessibility } from "./utils/accessibility.js";
import { notify } from "./components/notification.js";

export function init() {
  const preferences = readData(
    "preferences",
    {
      mode: "child",
      largeText: false,
      highContrast: false
    },
    true
  );

  document.querySelector("#user-mode").value =
    preferences.mode;

  document.querySelector("#large-text").checked =
    preferences.largeText;

  document.querySelector("#high-contrast").checked =
    preferences.highContrast;

  document.querySelector("#settings-form")
    .addEventListener("submit", event => {
      event.preventDefault();

      try {
        writeData(
          "preferences",
          {
            mode: document.querySelector("#user-mode").value,
            largeText: document.querySelector("#large-text").checked,
            highContrast:
              document.querySelector("#high-contrast").checked
          },
          true
        );

        applyAccessibility();
        notify("Preferences saved.");
      } catch {
        notify("Could not save preferences.", true);
      }
    });

  document.querySelector("#reset-data")
    .addEventListener("click", () => {
      try {
        clearDemoData();
        location.reload();
      } catch {
        notify("Could not reset browser data.", true);
      }
    });
}