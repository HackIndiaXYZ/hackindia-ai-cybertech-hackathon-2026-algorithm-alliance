import { CONFIG } from "./config.js";

/*
  Shared API request helper.

  Production authentication should use a secure server-managed session.
  Do not store passwords or secret API keys in browser storage.
*/
export async function request(path, options = {}) {
  const response = await fetch(
    CONFIG.API_BASE_URL + path,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      signal: AbortSignal.timeout(15000)
    }
  );

  if (!response.ok) {
    throw new Error(
      `The service could not complete the request (${response.status}).`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/*
  Storage helpers.
  Session storage is used for demo summaries.
  Local storage is used only for preferences.
*/
export function readData(key, fallback, persistent = false) {
  try {
    const storage = persistent ? localStorage : sessionStorage;
    const value = storage.getItem(`safecircle:${key}`);

    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function writeData(key, value, persistent = false) {
  const storage = persistent ? localStorage : sessionStorage;

  storage.setItem(
    `safecircle:${key}`,
    JSON.stringify(value)
  );
}

export function getHistory() {
  const data = readData("history", []);

  return Array.isArray(data) ? data : [];
}

export function saveSummary(result) {
  const previous = getHistory().filter(
    item => item.id !== result.id
  );

  writeData(
    "history",
    [result, ...previous].slice(0, CONFIG.MAX_HISTORY_ITEMS)
  );
}

export function clearDemoData() {
  for (const storage of [sessionStorage, localStorage]) {
    for (const key of Object.keys(storage)) {
      if (key.startsWith("safecircle:")) {
        storage.removeItem(key);
      }
    }
  }
}

/*
  DEMO ONLY:
  These rules are illustrative.
  They do not verify whether a message or destination is safe.
*/
function demoAnalyze({ content, kind, mode }) {
  const reasons = [];

  const rules = [
    {
      pattern: /urgent|immediately|blocked|suspend|expire/i,
      reason: "The text uses pressure or urgency."
    },
    {
      pattern: /bank|kyc|account verification/i,
      reason: "The text refers to banking or identity verification."
    },
    {
      pattern: /\botp\b|\bpin\b|password/i,
      reason: "The text mentions private codes or credentials."
    },
    {
      pattern: /free|prize|winner|reward|robux/i,
      reason: "The text contains a reward or free-offer claim."
    },
    {
      pattern: /http:\/\//i,
      reason: "An unencrypted HTTP link appears in the content."
    }
  ];

  for (const rule of rules) {
    if (rule.pattern.test(content)) {
      reasons.push(rule.reason);
    }
  }

  let risk = "unknown";

  if (reasons.length >= 3) {
    risk = "high";
  } else if (reasons.length > 0) {
    risk = "suspicious";
  }

  if (reasons.length === 0) {
    reasons.push(
      "No configured warning patterns matched. This does not prove safety."
    );
  }

  const guidance = mode === "senior"
    ? "Pause and contact the organisation through a channel you already trust. Do not share private codes."
    : "Pause. Do not share private information. Ask a trusted adult to help you check.";

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    kind,
    risk,
    reasons,
    guidance,
    reviewStatus: "none",
    source: "demo"
  };
}

export async function analyzeContent(payload) {
  if (CONFIG.DEMO_MODE) {
    return demoAnalyze(payload);
  }

  const result = await request("/api/scans", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const allowedRisks = [
    "unknown",
    "suspicious",
    "high",
    "blocked"
  ];

  if (
    !result ||
    typeof result.id !== "string" ||
    !allowedRisks.includes(result.risk) ||
    !Array.isArray(result.reasons) ||
    !result.reasons.every(reason => typeof reason === "string") ||
    typeof result.guidance !== "string"
  ) {
    throw new Error("The backend returned an invalid result.");
  }

  // Keep only expected fields. Do not persist an echoed submission.
  return {
    id: result.id,
    createdAt: result.createdAt || new Date().toISOString(),
    kind: payload.kind,
    risk: result.risk,
    reasons: result.reasons,
    guidance: result.guidance,
    reviewStatus: "none",
    source: "api"
  };
}