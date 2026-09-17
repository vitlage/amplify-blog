import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { scrapeStore } from "@/utils/storeProducts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST { url } -> scrapes the store from one product URL (main product + other
// products discovered on the page), returns a catalog { main, others } that gets
// stored on the lead and injected into the demo emails at render time.
export async function POST(req) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized. Please sign in with an admin account and retry." },
      { status: 401 }
    );

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const url = (body?.url || "").trim();
  if (!url)
    return NextResponse.json({ error: "Product URL is required." }, { status: 400 });
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "That doesn't look like a valid URL." },
      { status: 400 }
    );
  }

  let catalog;
  try {
    catalog = await scrapeStore(url, 6);
  } catch (err) {
    const msg =
      err?.name === "AbortError"
        ? "the product page took too long to respond (timed out)."
        : err?.message || "the product page could not be fetched.";
    return NextResponse.json(
      { error: `Couldn't fetch the product page: ${msg}` },
      { status: 502 }
    );
  }

  const warnings = [];
  const m = catalog.main || {};
  if (!m.title && !m.price && (!m.images || m.images.length === 0)) {
    warnings.push(
      "No product data found on the page. The store may render its content with JavaScript or block bots."
    );
  }
  if (!catalog.others || catalog.others.length === 0) {
    warnings.push(
      "Couldn't find other products on this page — the upsell email will keep its demo products."
    );
  }

  return NextResponse.json({
    product: catalog,
    warnings,
    summary: {
      main: {
        title: m.title || null,
        price: m.price || null,
        currency: m.currency || null,
        images: Array.isArray(m.images) ? m.images.length : 0,
      },
      othersCount: catalog.others ? catalog.others.length : 0,
      others: (catalog.others || []).map((o) => ({
        title: o.title,
        price: o.price,
        currency: o.currency,
      })),
    },
  });
}
