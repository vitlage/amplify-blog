import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/admin";
import { scrapeStore } from "@/utils/storeProducts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST: re-scrape the lead's stored product URL (or a { url } override) and refresh
// its catalog in place — so an existing lead picks up scraper improvements without
// being recreated.
export async function POST(req, { params }) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lead = await prisma.leadPage.findUnique({
    where: { token: params.token },
  });
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  let body = {};
  try {
    body = await req.json();
  } catch {
    /* no body is fine */
  }
  const url = (body?.url || lead.product?.main?.url || "").trim();
  if (!url) {
    return NextResponse.json(
      {
        error:
          "This lead has no product URL to re-scrape. Recreate it from a URL first.",
      },
      { status: 400 }
    );
  }

  let catalog;
  try {
    catalog = await scrapeStore(url, 6);
  } catch (err) {
    return NextResponse.json(
      { error: "Scrape failed: " + (err?.message || "unknown") },
      { status: 502 }
    );
  }

  await prisma.leadPage.update({
    where: { token: params.token },
    data: { product: catalog },
  });

  return NextResponse.json({
    ok: true,
    summary: {
      title: catalog.main?.title || null,
      images: catalog.main?.images?.length || 0,
      others: catalog.others?.length || 0,
    },
  });
}
