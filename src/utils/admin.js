import { getAuthSession } from "./auth";

// Comma-separated allowlist of admin emails, e.g. ADMIN_EMAILS="you@x.com,co@x.com"
export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// Returns the session if the logged-in user is an allowlisted admin, else null.
export async function requireAdmin() {
  const session = await getAuthSession();
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) return null;
  return session;
}
