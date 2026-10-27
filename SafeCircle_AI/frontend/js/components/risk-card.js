import {
  createElement,
  formatDate,
  riskLabel
} from "../utils/formatting.js";

export function createRiskCard(result) {
  const card = createElement("article", "", "card");

  const badge = createElement(
    "span",
    riskLabel(result),
    `badge ${result.risk}`
  );

  card.append(
    badge,
    createElement("p", formatDate(result.createdAt))
  );

  const reasons = createElement("ul");

  for (const reason of result.reasons) {
    reasons.append(createElement("li", reason));
  }

  card.append(
    reasons,
    createElement("p", result.guidance),
    createElement(
      "small",
      `Review: ${result.reviewStatus} · Source: ${
        result.source === "demo" ? "Demo rules" : "Backend"
      }`
    )
  );

  return card;
}