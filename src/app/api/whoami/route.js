import { NextResponse } from "next/server";
import { getClientIp, isInternalIp } from "@/utils/internalTraffic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Echo the caller's IP so you can add your home/mobile IP to INTERNAL_IPS.
// Open it from any device/network: /api/whoami
export async function GET(req) {
  const ip = getClientIp(req);
  return NextResponse.json({
    ip,
    internal: isInternalIp(ip),
    xForwardedFor: req.headers.get("x-forwarded-for") || null,
  });
}
