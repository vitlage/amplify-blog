// Internal-traffic detection. Our own testing shouldn't pollute lead analytics, but
// we DON'T drop those events — we tag them `internal: true` so the dashboard can hide
// them by default and we can still debug. Three signals feed the tag:
//   1. a per-browser flag the visitor's page sends (from ?test=1 -> localStorage)
//   2. the request IP being in INTERNAL_IPS
//   3. an internal email being submitted in the session (INTERNAL_EMAILS)

// Client IP from proxy headers. Cloud Run / Vercel put the real client first in
// x-forwarded-for; fall back to other common proxy headers.
export function getClientIp(req) {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (h.get("x-real-ip") || h.get("cf-connecting-ip") || "").trim();
}

function parseList(name) {
  return String(process.env[name] || "")
    .split(/[\s,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// The owner's address is always internal; INTERNAL_EMAILS adds more (comma/space
// separated). INTERNAL_IPS is IP-only (no default).
const DEFAULT_INTERNAL_EMAILS = ["vitalijgladkij@gmail.com"];

export function internalEmails() {
  return Array.from(
    new Set([...DEFAULT_INTERNAL_EMAILS, ...parseList("INTERNAL_EMAILS")])
  );
}

export function internalIps() {
  return parseList("INTERNAL_IPS");
}

export function isInternalEmail(email) {
  if (!email) return false;
  return internalEmails().includes(String(email).trim().toLowerCase());
}

export function isInternalIp(ip) {
  if (!ip) return false;
  return internalIps().includes(String(ip).trim().toLowerCase());
}

// Extract the submitted email from an event's meta (shape differs by event type).
export function submittedEmailOf(type, meta) {
  if (!meta) return "";
  if (type === "email_submit") return meta.email || "";
  if (type === "real_amp_submit") return (meta.fields && meta.fields.email) || "";
  return "";
}
