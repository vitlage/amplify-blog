import { NextResponse } from "next/server";
import { recordLeadEvent } from "@/utils/leadEvents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Click tracker for links inside the delivered (real) AMP email. Logs a
// real_amp_click event, then 302-redirects to the original destination. Tracking
// must never break the click, so it always redirects even if logging fails.
export async function GET(req, { params }) {
  const { token } = params;
  const url = new URL(req.url);

  // Resolve + sanitize the destination (open-redirect guard: http(s) or relative).
  let dest = "/";
  try {
    const decoded = decodeURIComponent(url.searchParams.get("u") || "/");
    if (/^https?:\/\//i.test(decoded) || decoded.startsWith("/")) dest = decoded;
  } catch {
    dest = "/";
  }

  try {
    await recordLeadEvent(token, "real_amp_click", { meta: { href: dest } });
  } catch (err) {
    console.error("real amp click log error", err);
  }

  const location = /^https?:\/\//i.test(dest)
    ? dest
    : new URL(dest, url.origin).toString();
  return NextResponse.redirect(location, 302);
}
