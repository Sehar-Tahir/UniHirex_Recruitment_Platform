// Accepts "github.com/me" or "https://github.com/me". Rejects anything that isn't a real web link.
export function checkLink(raw, { host, label }) {
  const value = (raw || "").trim();
  if (!value) return { value: "" };
  if (value.length > 300) return { error: `${label} is too long` };

  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return { error: `${label} must be a valid link` };
  }
  if (!url.hostname.includes(".")) return { error: `${label} must be a valid link` };
  if (host && url.hostname !== host && !url.hostname.endsWith(`.${host}`)) {
    return { error: `${label} must be a ${host} link` };
  }
  return { value: url.toString() };
}

// Only ever turn http(s) links into clickable links
export function safeUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url) ? url : null;
}