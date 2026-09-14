import { NextResponse } from "next/server";
import prisma from "@/utils/connect";
import { fetchContactById } from "@/utils/hubspot";
import { scrapeStore } from "@/utils/storeProducts";
import { GENERAL_TEMPLATES } from "@/utils/generalTemplates";
import { createLeadPage } from "@/utils/leadPages";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Convertic send template used for the real email (mirrors the admin form default).
const DEFAULT_TEMPLATE_ID = "66c37609b2af3";
const GYMSHARK =
  GENERAL_TEMPLATES.find((t) => t.id === "gymshark")?.product || null;

// HubSpot fires this on new-contact creation. Configure the target URL as
// `.../api/hubspot/webhook?token=<HUBSPOT_WEBHOOK_SECRET>` (works for both a
// developer-app webhook subscription and an Ops-Hub workflow "send webhook").
// For each new contact: if it has a "Website URL", scrape that store and bake the
// catalog into the demo emails; if it's empty (or the scrape finds nothing), fall
// back to the frozen GymShark template. A lead page is created either way.

// Pull contact object ids from either payload shape: a developer-app webhook
// (array of events, each with objectId + subscriptionType) or a workflow webhook
// (a single object carrying the contact id).
function extractContactIds(body) {
  if (Array.isArray(body)) {
    return body
      .filter(
        (e) =>
          !e?.subscriptionType ||
          String(e.subscriptionType).toLowerCase().includes("contact")
      )
      .map((e) => e?.objectId ?? e?.vid)
      .filter((v) => v != null)
      .map(String);
  }
  if (body && typeof body === "object") {
    const id =
      body.objectId ??
      body.vid ??
      body.contactId ??
      body.hs_object_id ??
      body?.properties?.hs_object_id;
    return id != null ? [String(id)] : [];
  }
  return [];
}

async function generateForContact(id) {
  // Idempotent: HubSpot retries on timeout, so never duplicate a contact's page.
  const existing = await prisma.leadPage.findFirst({ where: { hubspotId: id } });
  if (existing) return { id, token: existing.token, status: "exists" };

  const contact = await fetchContactById(id);
  if (!contact) return { id, status: "contact-not-found" };

  // Website present -> scrape it. Empty or scrape yields nothing -> GymShark.
  let product = null;
  let source = "template";
  const website = (contact.website || "").trim();
  if (website) {
    try {
      const url = /^https?:\/\//i.test(website) ? website : `https://${website}`;
      const catalog = await scrapeStore(url, 6);
      if (catalog && (catalog.main?.title || catalog.main?.images?.length)) {
        product = catalog;
        source = "scraped";
      }
    } catch {
      /* fall through to the template */
    }
  }
  if (!product) product = GYMSHARK;

  const lead = await createLeadPage({
    firstName: contact.firstName,
    lastName: contact.lastName,
    company: contact.company,
    email: contact.email,
    hubspotId: id,
    product,
    templateId: DEFAULT_TEMPLATE_ID,
    createdBy: "hubspot-webhook",
  });
  if (!lead) return { id, status: "create-failed" };
  return { id, token: lead.token, status: source };
}

export async function POST(req) {
  const secret = process.env.HUBSPOT_WEBHOOK_SECRET;
  const provided =
    new URL(req.url).searchParams.get("token") ||
    req.headers.get("x-webhook-secret");
  if (!secret || provided !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const ids = extractContactIds(body);
  if (!ids.length) {
    return NextResponse.json({ ok: true, processed: [], note: "no contact ids in payload" });
  }

  const processed = [];
  for (const id of ids) {
    try {
      processed.push(await generateForContact(id));
    } catch (err) {
      processed.push({ id, status: "error", error: String(err?.message || err) });
    }
  }
  return NextResponse.json({ ok: true, processed });
}
