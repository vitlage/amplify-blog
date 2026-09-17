import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { createLeadPage } from "@/utils/leadPages";
import { summarizeEvents } from "@/utils/leadSummary";
import { internalEventPredicate } from "@/utils/internalTraffic";
import { resolveLocations } from "@/utils/geoip";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: list every lead page with its rolled-up tracking summary. Internal (our own
// test) traffic is excluded by default; pass ?includeInternal=1 to include it.
export async function GET(req) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const includeInternal =
    new URL(req.url).searchParams.get("includeInternal") === "1";

  const [leads, allEvents] = await Promise.all([
    prisma.leadPage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.leadEvent.findMany(),
  ]);

  const isInternal = internalEventPredicate(allEvents);
  const events = includeInternal
    ? allEvents
    : allEvents.filter((e) => !isInternal(e));

  const eventsByToken = {};
  for (const e of events) {
    (eventsByToken[e.leadToken] = eventsByToken[e.leadToken] || []).push(e);
  }

  const summaries = leads.map((l) => ({
    ...summarizeEvents(l, eventsByToken[l.token] || []),
    // So the admin can see which leads have a scraped product catalog baked in.
    productTitle: l.product?.main?.title || null,
    storeName: l.product?.storeName || null,
    productCount: l.product?.others ? l.product.others.length + 1 : 0,
  }));

  // Resolve "location" from each lead's most recent IP (cached across requests).
  const locations = await resolveLocations(summaries.map((s) => s.lastIp));
  for (const s of summaries) s.location = locations.get(s.lastIp) || "";

  return NextResponse.json({ leads: summaries });
}

// POST: create a new lead page and return its shareable token/link.
export async function POST(req) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (!body.templateId) {
    return new NextResponse("templateId is required", { status: 400 });
  }

  let lead;
  try {
    lead = await createLeadPage({ ...body, createdBy: session.user.email });
  } catch (err) {
    console.error("create lead error", err);
    return new NextResponse("Server error", { status: 500 });
  }

  if (!lead) return new NextResponse("Could not create lead", { status: 500 });
  return NextResponse.json({ lead });
}
