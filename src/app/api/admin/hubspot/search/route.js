import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { searchHubspotContacts } from "@/utils/hubspot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/admin/hubspot/search?q=acme
export async function GET(req) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ contacts: [] });

  try {
    const contacts = await searchHubspotContacts(q);
    return NextResponse.json({ contacts });
  } catch (err) {
    // Surface a clean message so the admin UI can tell the user what to fix.
    const message =
      err?.code === "NO_TOKEN"
        ? "HubSpot is not connected yet (set HUBSPOT_TOKEN). You can still enter the contact manually below."
        : "HubSpot search failed. You can still enter the contact manually below.";
    return NextResponse.json({ contacts: [], error: message });
  }
}
