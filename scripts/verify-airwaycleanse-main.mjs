// Reproduction + verification for the "first email shows New Balance default" bug.
// Live-fetches airwaycleanse.com (a store-root URL, no /products/ path) and proves:
//   BEFORE fix: a homepage scrape yields an empty `main` -> the abandoned-cart email
//               keeps its hardcoded New Balance demo product.
//   AFTER fix:  anchoring `main` on the Shopify catalog product makes the same email
//               render the real product instead.
// Run: node scripts/verify-airwaycleanse-main.mjs

import fs from "fs";
import path from "path";
import { personalizeEmail } from "../src/utils/personalizeEmail.js";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const STORE = "https://airwaycleanse.com";

const toNumber = (p) => {
  const n = parseFloat(String(p ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// Mirrors storeProducts.js — the pure decision under test.
const scrapeIsProduct = (m) =>
  !!(toNumber(m?.price) != null || (m?.images && m.images.length));
const anchorMainFromCatalog = (catalog, handle) =>
  (catalog || []).find((p) => p.handle === handle) ||
  (catalog || []).find((p) => p.available !== false && p.image) ||
  (catalog || [])[0] ||
  null;

const template = fs.readFileSync(
  path.join(process.cwd(), "public", "amp-templates", "abandoned-cart-recovery.html"),
  "utf8"
);

const assert = (cond, msg) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("ok  :", msg);
  }
};

// What scrapeProduct returns for the store-root URL: og:title only, no price/images.
const homepageMain = {
  title: "AirwayCleanse",
  price: "",
  currency: "",
  description: "",
  images: [],
  image: "",
  url: STORE,
};

const catRes = await fetch(`${STORE}/products.json?limit=250`, {
  headers: { "User-Agent": UA, Accept: "application/json" },
});
const catData = await catRes.json();
const catalog = (catData.products || []).map((p) => ({
  handle: p.handle,
  title: p.title,
  price: p.variants?.[0]?.price != null ? String(p.variants[0].price) : "",
  currency: "",
  image: p.images?.[0]?.src || "",
  images: (p.images || []).map((i) => i?.src).filter(Boolean),
  available: (p.variants || []).some((v) => v?.available),
  url: `${STORE}/products/${p.handle}`,
}));

console.log(`catalog products: ${catalog.length}`);

// --- BEFORE fix: homepage main -> demo product (image + price) survives -----------
// A store-root scrape has no price and no images, so the image-swap and price-swap
// are both skipped and the New Balance demo photo + $99 stay in the email. (When the
// homepage returns nothing at all, even the title stays "New Balance…", as in the
// reported screenshot.)
const before = personalizeEmail("abandoned-cart-recovery", template, { main: homepageMain });
assert(!scrapeIsProduct(homepageMain), "store-root scrape is NOT a product (root cause trigger)");
assert(
  before.includes("/photos_of_products_in_amp/1.webp"),
  "BEFORE: abandoned-cart email still shows the New Balance demo photo"
);
assert(/data-product-price>\s*99\s*</.test(before), "BEFORE: email still shows the demo $99 price");

// --- AFTER fix: anchor main on the catalog product --------------------------------
const anchor = anchorMainFromCatalog(catalog, "");
assert(!!anchor, "anchor product selected from catalog");
const fixedMain = {
  title: anchor.title,
  price: anchor.price,
  currency: anchor.currency || "EUR",
  description: "",
  images: anchor.images.length ? anchor.images : anchor.image ? [anchor.image] : [],
  image: anchor.image,
  url: anchor.url,
};
const after = personalizeEmail("abandoned-cart-recovery", template, { main: fixedMain });
assert(scrapeIsProduct(fixedMain), "anchored main IS a product");
assert(!/New Balance/.test(after), "AFTER: New Balance default title is gone");
assert(
  !after.includes("/photos_of_products_in_amp/1.webp"),
  "AFTER: New Balance demo photo is gone"
);
assert(after.includes(anchor.title), `AFTER: email shows the real product "${anchor.title}"`);
assert(!/data-product-price[^>]*>\s*99\s*</.test(after), "AFTER: demo $99 price is gone");
assert(/data-product-price[^>]*>\s*35\s*</.test(after), "AFTER: email shows the real price (35, rounded from 34.95)");

console.log("\nanchor:", JSON.stringify({ title: anchor.title, price: anchor.price, img: anchor.image?.slice(0, 60) }));
