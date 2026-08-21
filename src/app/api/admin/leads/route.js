import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { generateToken } from "@/utils/token";
import { summarizeEvents } from "@/utils/leadSummary";

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

  const events = includeInternal
    ? allEvents
    : allEvents.filter((e) => e.internal !== true);

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

  // Retry a couple of times on the (astronomically unlikely) token collision.
  let lead = null;
  for (let attempt = 0; attempt < 3 && !lead; attempt++) {
    const token = generateToken();
    try {
      lead = await prisma.leadPage.create({
        data: {
          token,
          product: body.product ?? undefined,
          hubspotId: body.hubspotId || null,
          firstName: body.firstName || null,
          lastName: body.lastName || null,
          company: body.company || null,
          email: body.email || null,
          templateId: String(body.templateId),
          previewHtml: body.previewHtml || null,
          videoUrl: body.videoUrl || null,
          subjectLine: body.subjectLine || null,
          senderName: body.senderName || null,
          senderEmail: body.senderEmail || null,
          snippet: body.snippet || null,
          createdBy: session.user.email,
        },
      });
    } catch (err) {
      if (err?.code === "P2002") continue; // unique collision, retry
      console.error("create lead error", err);
      return new NextResponse("Server error", { status: 500 });
    }
  }

  if (!lead) return new NextResponse("Could not create lead", { status: 500 });
  return NextResponse.json({ lead });
}
