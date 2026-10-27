/*
  Dynamic text is inserted with textContent.
  Do not use innerHTML with messages, URLs, or backend explanations.
*/
export function createElement(
  tag,
  text = "",
  className = ""
) {
  const element = document.createElement(tag);

  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

export function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}

export function riskLabel(result) {
  if (result.risk === "blocked") {
    return result.source === "demo"
      ? "Simulated malicious block"
      : "Blocked by backend policy";
  }

  const labels = {
    unknown: "Not verified",
    suspicious: "Suspicious",
    high: "High concern"
  };

  return labels[result.risk] || "Not verified";
}