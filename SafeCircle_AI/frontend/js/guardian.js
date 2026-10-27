import { CONFIG } from "./config.js";

import {
  getHistory,
  saveSummary,
  readData,
  writeData
} from "./api.js";

import { createRiskCard } from "./components/risk-card.js";
import { createElement } from "./utils/formatting.js";
import { notify } from "./components/notification.js";

function renderQueue() {
  const container = document.querySelector("#guardian-list");
  container.replaceChildren();

  const cases = getHistory().filter(item =>
    item.source === "demo" &&
    (
      item.reviewStatus !== "none" ||
      item.risk === "blocked"
    )
  );

  if (cases.length === 0) {
    container.textContent = "No demo review cases yet.";
    return;
  }

  for (const item of cases) {
    const card = createRiskCard(item);

    if (item.risk === "blocked") {
      card.append(
        createElement(
          "p",
          "This fictional blocked case cannot be overridden."
        )
      );
    } else if (item.reviewStatus === "pending") {
      const actions = createElement("div", "", "actions");

      for (const [label, status] of [
        ["Mark advice given", "advice given"],
        ["Keep restricted in demo", "restricted"]
      ]) {
        const button = createElement(
          "button",
          label,
          "secondary"
        );

        button.addEventListener("click", () => {
          try {
            item.reviewStatus = status;
            saveSummary(item);

            const latest = readData("latestResult", null);

            if (latest?.id === item.id) {
              writeData("latestResult", item);
            }

            renderQueue();

            notify(
              "Demo decision saved. No real access permissions changed."
            );
          } catch {
            notify("Could not save the demo decision.", true);
          }
        });

        actions.append(button);
      }

      card.append(actions);
    }

    container.append(card);
  }
}

export function init() {
  const sampleButton =
    document.querySelector("#add-blocked-example");

  if (!CONFIG.DEMO_MODE) {
    sampleButton.hidden = true;

    document.querySelector("#guardian-list").textContent =
      "Production guardian review requires verified relationships and backend authorization. This screen is not connected yet.";

    return;
  }

  renderQueue();

  sampleButton.addEventListener("click", () => {
    try {
      saveSummary({
        id: "fictional-blocked-case",
        createdAt: new Date().toISOString(),
        kind: "url",
        risk: "blocked",
        reasons: [
          "Fictional case used to demonstrate a non-overridable block."
        ],
        guidance:
          "No real destination was analyzed or blocked.",
        reviewStatus: "not overridable",
        source: "demo"
      });

      renderQueue();
    } catch {
      notify("Could not create the demo case.", true);
    }
  });
}