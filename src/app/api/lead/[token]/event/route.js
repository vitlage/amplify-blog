import { NextResponse } from "next/server";
import { recordLeadEvent } from "@/utils/leadEvents";
import { getClientIp } from "@/utils/internalTraffic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Public endpoint. Records one tracking event for a lead page and syncs the lead's
// engagement to HubSpot. Called via navigator.sendBeacon (Blob) or fetch keepalive.
export async function POST(req, { params }) {
  const { token } = params;
  try {
    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    const type = String(body.type || "").slice(0, 64);
    if (!type) return new NextResponse(null, { status: 400 });

    const lead = await recordLeadEvent(token, type, {
      meta: body.meta,
      sessionId: body.sessionId,
      ip: getClientIp(req),
      clientInternal: body.internal === true,
    });
    if (!lead) return new NextResponse(null, { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("lead event error", err);
    return new NextResponse(null, { status: 500 });
  }
}
