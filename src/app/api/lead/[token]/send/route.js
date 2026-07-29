import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { instrumentAmpHtml } from "@/utils/ampTracking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Send-proxy for the lead's "Send it to your own inbox" test.
// Reads the lead's own AMP HTML server-side (token never exposed to the client),
// bakes click/submit tracking into it, then forwards to the external delivery
// service. Returns the upstream JSON so the form UI behaves exactly as before.
const SEND_ENDPOINT = "https://app.convertic.ai/landing/lead/send";

export async function POST(req, { params }) {
  const { token } = params;
  try {
    const raw = await req.text();
    const email = (new URLSearchParams(raw).get("email") || "").trim();
    if (!email) {
      return NextResponse.json(
        { status: "danger", msg: "Please enter your email address" },
        { status: 400 }
      );
    }

    const lead = await prisma.leadPage.findUnique({ where: { token } });
    if (!lead) {
      return NextResponse.json(
        { status: "danger", msg: "This link is no longer valid." },
        { status: 404 }
      );
    }

    const html = instrumentAmpHtml(lead.previewHtml || "", token);

    const body = new URLSearchParams({
      email,
      html,
      subject: lead.subjectLine || "",
      from_name: lead.senderName || "",
    });

    const upstream = await fetch(SEND_ENDPOINT, { method: "POST", body });
    const data = await upstream.json().catch(() => ({
      status: upstream.ok ? "success" : "danger",
      msg: upstream.ok
        ? "Sent! Check your inbox."
        : "Oops, something went wrong. Please try again later.",
    }));

    return NextResponse.json(data, { status: upstream.ok ? 200 : 502 });
  } catch (err) {
    console.error("lead send proxy error", err);
    return NextResponse.json(
      {
        status: "danger",
        msg: "Oops, something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
