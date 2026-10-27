import { getHistory, writeData } from "./api.js";
import { createRiskCard } from "./components/risk-card.js";
import { notify } from "./components/notification.js";

function renderHistory() {
  const filter = document.querySelector("#history-filter").value;
  const container = document.querySelector("#history-list");

  container.replaceChildren();

  const items = getHistory().filter(item =>
    filter === "all" || item.risk === filter
  );

  if (items.length === 0) {
    container.textContent = "No saved results match this filter.";
    return;
  }

  for (const item of items) {
    container.append(createRiskCard(item));
  }
}

export function init() {
  renderHistory();

  document.querySelector("#history-filter")
    .addEventListener("change", renderHistory);

  document.querySelector("#clear-history")
    .addEventListener("click", () => {
      try {
        writeData("history", []);
        writeData("latestResult", null);

        renderHistory();

        notify("History and demo review queue cleared.");
      } catch {
        notify("Could not clear browser data.", true);
      }
    });
}