import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import {
  internalEmails,
  internalIps,
  submittedEmailOf,
} from "@/utils/internalTraffic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// One-time (idempotent) backfill. Tags existing events `internal: true` when:
//   (a) the submitted email is in INTERNAL_EMAILS, or
//   (b) the event's session OR IP ever submitted an internal email, or
//   (c) the event IP is configured in INTERNAL_IPS.
// Safe to re-run. Returns + logs how many rows were affected.
export async function POST() {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const emails = new Set(internalEmails());
  const isIntEmail = (type, meta) => {
    const e = submittedEmailOf(type, meta);
    return !!e && emails.has(String(e).trim().toLowerCase());
  };

  const all = await prisma.leadEvent.findMany();

  // Pass 1 — sessions & IPs that ever submitted an internal email (+ configured IPs).
  const internalSessions = new Set();
  const internalIpSet = new Set(internalIps());
  for (const e of all) {
    if (isIntEmail(e.type, e.meta)) {
      if (e.sessionId) internalSessions.add(e.sessionId);
      if (e.ip) internalIpSet.add(String(e.ip).toLowerCase());
    }
  }

  // Pass 2 — collect the events to tag (skip already-internal).
  const ids = [];
  let byEmail = 0;
  let bySession = 0;
  let byIp = 0;
  for (const e of all) {
    if (e.internal === true) continue;
    const em = isIntEmail(e.type, e.meta);
    const sess = e.sessionId && internalSessions.has(e.sessionId);
    const ip = e.ip && internalIpSet.has(String(e.ip).toLowerCase());
    if (em || sess || ip) {
      ids.push(e.id);
      if (em) byEmail++;
      else if (sess) bySession++;
      else byIp++;
    }
  }

  // Tag in chunks.
  let tagged = 0;
  const CHUNK = 500;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const r = await prisma.leadEvent.updateMany({
      where: { id: { in: ids.slice(i, i + CHUNK) } },
      data: { internal: true },
    });
    tagged += r.count;
  }

  const result = {
    totalEvents: all.length,
    internalSessions: internalSessions.size,
    internalIps: internalIpSet.size,
    tagged,
    breakdown: { byEmail, bySession, byIp },
  };
  console.log("[backfill-internal]", JSON.stringify(result));
  return NextResponse.json(result);
}
