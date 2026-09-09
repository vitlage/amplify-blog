import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { summarizeEvents } from "@/utils/leadSummary";
import { internalEventPredicate } from "@/utils/internalTraffic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: one lead with its full event timeline (for the drill-down view). Internal
// traffic is excluded by default; pass ?includeInternal=1 to include it. Per-lead
// stats are recomputed from the same (filtered) event set.
export async function GET(req, { params }) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const lead = await prisma.leadPage.findUnique({
    where: { token: params.token },
  });
  if (!lead) return new NextResponse("Not found", { status: 404 });

  const includeInternal =
    new URL(req.url).searchParams.get("includeInternal") === "1";

  const allEvents = await prisma.leadEvent.findMany({
    where: { leadToken: params.token },
    orderBy: { createdAt: "asc" },
  });
  const isInternal = internalEventPredicate(allEvents);
  const events = includeInternal
    ? allEvents
    : allEvents.filter((e) => !isInternal(e));

  return NextResponse.json({
    lead,
    events,
    summary: summarizeEvents(lead, events),
  });
}

// DELETE: remove a lead page and all of its events.
export async function DELETE(req, { params }) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  await prisma.leadEvent.deleteMany({ where: { leadToken: params.token } });
  await prisma.leadPage.delete({ where: { token: params.token } });

  return NextResponse.json({ ok: true });
}
