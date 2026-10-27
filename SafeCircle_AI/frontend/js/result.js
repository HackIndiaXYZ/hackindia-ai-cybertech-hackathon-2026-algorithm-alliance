import {
  readData,
  writeData,
  saveSummary
} from "./api.js";

import { createRiskCard } from "./components/risk-card.js";
import { notify } from "./components/notification.js";

export function init() {
  const result = readData("latestResult", null);
  const container = document.querySelector("#result-container");
  const reviewButton = document.querySelector("#request-review");

  if (!result) {
    container.textContent = "No result yet. Check some content first.";
    return;
  }

  container.append(createRiskCard(result));

  const canRequestDemoReview =
    result.source === "demo" &&
    ["suspicious", "high"].includes(result.risk);

  reviewButton.hidden = !canRequestDemoReview;

  if (result.reviewStatus === "pending") {
    reviewButton.disabled = true;
    reviewButton.textContent = "Already in the demo review queue";
  }

  reviewButton.addEventListener("click", () => {
    try {
      result.reviewStatus = "pending";

      saveSummary(result);
      writeData("latestResult", result);

      reviewButton.disabled = true;

      notify(
        "Summary saved to the local demo queue. No notification was sent."
      );
    } catch {
      notify("Could not save the summary. Check browser storage.", true);
    }
  });
}