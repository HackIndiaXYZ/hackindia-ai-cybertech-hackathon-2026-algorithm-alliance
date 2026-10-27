import { readData } from "../api.js";

export function applyAccessibility() {
  const preferences = readData(
    "preferences",
    {},
    true
  );

  document.documentElement.classList.toggle(
    "large-text",
    Boolean(preferences.largeText)
  );

  document.documentElement.classList.toggle(
    "high-contrast",
    Boolean(preferences.highContrast)
  );
}