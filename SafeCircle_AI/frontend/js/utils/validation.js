import { CONFIG } from "../config.js";

export function validateContent(kind, content) {
  if (!["message", "url", "qr"].includes(kind)) {
    throw new Error("Choose a valid content type.");
  }

  if (!content.trim()) {
    throw new Error("Enter some content first.");
  }

  if (content.length > CONFIG.MAX_CONTENT_LENGTH) {
    throw new Error(
      `Use ${CONFIG.MAX_CONTENT_LENGTH} characters or fewer.`
    );
  }

  if (kind === "message") {
    return;
  }

  let url;

  try {
    url = new URL(content);
  } catch {
    throw new Error(
      "Enter a complete destination beginning with https:// or http://."
    );
  }

  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error(
      "Only HTTP and HTTPS destinations are supported."
    );
  }

  if (url.username || url.password) {
    throw new Error(
      "Do not submit URLs containing usernames or passwords."
    );
  }
}