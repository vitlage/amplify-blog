import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { validateAmpEmail } from "@/utils/ampValidate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Server-side proxy to the AMP validator. Runs from the Node server (no Origin
// header), which the validator's CORS allows — so the admin browser can validate
// without the validator needing our origin on its allowlist.
export async function POST(req) {
  const session = await requireAdmin();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "ERROR", errors: [{ message: "Invalid request." }] });
  }

  const data = await validateAmpEmail(body?.html);
  return NextResponse.json(data);
}
