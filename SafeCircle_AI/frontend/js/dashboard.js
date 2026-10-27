import { getHistory } from "./api.js";

export function init() {
  const history = getHistory();

  const flagged = history.filter(item =>
    ["suspicious", "high", "blocked"].includes(item.risk)
  );

  const pending = history.filter(
    item => item.reviewStatus === "pending"
  );

  document.querySelector("#total-checks").textContent =
    history.length;

  document.querySelector("#flagged-checks").textContent =
    flagged.length;

  document.querySelector("#pending-reviews").textContent =
    pending.length;
}