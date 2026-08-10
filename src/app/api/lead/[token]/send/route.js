import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { instrumentAmpHtml } from "@/utils/ampTracking";
import { readDemoEmailHtml, DEMO_EMAILS } from "@/utils/demoEmails";
import { personalizeEmail } from "@/utils/personalizeEmail";
import { ensureLeadContact } from "@/utils/leadContact";
import { validateAmpEmail } from "@/utils/ampValidate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Send-proxy for the lead's "Send it to your own inbox" test.
// Reads the chosen AMP HTML server-side (token never exposed to the client),
// bakes click/submit tracking into it, then forwards to the external delivery
// service. Returns the upstream JSON so the form UI behaves exactly as before.
const SEND_ENDPOINT = "https://app.convertic.ai/landing/lead/send";

export async function POST(req, { params }) {
  const { token } = params;
  try {
    const raw = await req.text();
    const parsed = new URLSearchParams(raw);
    const email = (parsed.get("email") || "").trim();
    const template = (parsed.get("template") || "").trim();
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

    // A chosen demo template wins over the lead's own previewHtml; use that
    // template's subject/sender so the delivered email is consistent. Personalize
    // it with the lead's scraped catalog exactly like the on-page preview, so the
    // emailed version matches what they saw (and its images become absolute store
    // URLs instead of the demo's disallowed relative ones).
    const demo = template ? DEMO_EMAILS.find((e) => e.key === template) : null;
    const rawHtml = template ? readDemoEmailHtml(template) : "";
    const personalized =
      template && lead.product
        ? personalizeEmail(template, rawHtml, lead.product)
        : rawHtml;
    const sourceHtml = personalized || lead.previewHtml || "";

    // instrumentAmpHtml already absolutizes root-relative asset URLs (AMP email
    // disallows relatives) before wrapping links/forms for tracking.
    const html = instrumentAmpHtml(sourceHtml, token);

    // Validate before sending so a broken template never lands as INVALID_AMP in
    // the inbox. Block only on a definitive FAIL; if the validator is unreachable
    // or errors, fail open (send anyway) so a validator outage can't kill sends.
    const validation = await validateAmpEmail(html);
    if (validation.status === "FAIL") {
      console.error(
        "lead send blocked: invalid AMP",
        token,
        (validation.errors || []).slice(0, 5)
      );
      return NextResponse.json(
        {
          status: "danger",
          msg: "This email template isn't valid right now, so we didn't send it. Please try another template or contact us.",
        },
        { status: 422 }
      );
    }

    const storeName = lead.product?.storeName || "";
    const body = new URLSearchParams({
      email,
      html,
      subject: demo?.subject || lead.subjectLine || "",
      from_name: storeName || demo?.sender || lead.senderName || "",
    });

    const upstream = await fetch(SEND_ENDPOINT, { method: "POST", body });
    const data = await upstream.json().catch(() => ({
      status: upstream.ok ? "success" : "danger",
      msg: upstream.ok
        ? "Sent! Check your inbox."
        : "Oops, something went wrong. Please try again later.",
    }));

    // Create/link a HubSpot contact for the submitted email, same as the main
    // landing's "try it". Capped at ~2s and fully swallowed on error so HubSpot
    // can never break or noticeably delay the email send.
    try {
      await Promise.race([
        ensureLeadContact(lead, email).catch((err) =>
          console.error("lead contact upsert error", err)
        ),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    } catch (err) {
      console.error("lead contact upsert setup error", err);
    }

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
