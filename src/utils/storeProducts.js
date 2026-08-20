import { scrapeProduct, fetchShopifyProduct } from "@/utils/scrapeProduct";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function toNumber(price) {
  const n = parseFloat(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

// Base title without the colour/size suffix ("The Re-Run Twin Mesh | Grey/Red" ->
// "the re-run twin mesh"), so different colourways of the SAME product collapse
// together. Split only on the pipe or a SPACE-delimited dash/slash — never an
// in-word hyphen like "Re-Run".
function baseTitle(t) {
  return String(t || "")
    .split(/\s*\|\s*|\s+[-–—/]\s+/)[0]
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Shopify groups the colourways of ONE product with an ItemNumber tag (ItemGroup is
// the broad category, e.g. "Sneakers" — deliberately NOT used here).
function itemGroup(tags) {
  const list = Array.isArray(tags) ? tags : [];
  const t = list.find((x) => /^itemnumber\s*:/i.test(String(x)));
  return t ? String(t).split(":").slice(1).join(":").trim().toLowerCase() : "";
}

// Accessory / add-on categories that make good COMPLEMENTARY upsells for almost any
// main product (cheap, pair well): socks, caps, care kits, bags, laces, etc.
const ACCESSORY_RE =
  /\b(socks?|caps?|hats?|beanies?|accessor\w*|bags?|pouch(?:es)?|laces?|belts?|jewel\w*|gloves?|scarf|scarves|underwear|sunglasses?|wallets?|keychains?|charms?|straps?|totes?|kits?|care|cleaning|grooming)\b/i;

// Replenishable / consumable signals — things people re-buy on a cadence.
const CONSUMABLE_RE =
  /\b(coffee|espresso|roast|beans?|tea|matcha|protein|whey|creatine|supplement|vitamins?|collagen|powder|serum|cream|lotion|moisturi\w*|skin ?care|cleanser|shampoo|conditioner|soap|refill|capsules?|pods?|snacks?|granola|probiotic|deodorant|razor|blades?|toothpaste|detergent|candle|filter|treats|kibble|formula|diapers?|wipes|juice|kombucha|honey|spice|nutrition|gummies|drops)\b/i;

// --- upsell ranking: complementary category + priced as an affordable add-on ------
function upsellScore(mainInfo, p) {
  const hay = `${p.title || ""} ${p.type || ""}`;
  let score = 0;

  // Complementary accessory/add-on is the strongest signal.
  if (ACCESSORY_RE.test(hay)) score += 60;
  // A different category than the main item (a real cross-sell) beats another of
  // the same kind (which reads as a duplicate/alternative, not an add-on).
  else if (p.type && mainInfo.type && p.type.toLowerCase() !== mainInfo.type)
    score += 15;

  // Affordability: cheaper than the abandoned item = a natural add-on; the cheaper
  // relative to it, the better. Pricier-than-main is a poor add-on.
  const cp = toNumber(p.price);
  if (mainInfo.price != null && cp != null) {
    if (cp <= mainInfo.price) score += 20 + Math.round(25 * (1 - cp / mainInfo.price));
    else score -= 15;
  }
  return score;
}

// Exclude the main product itself and its own colourways from cross-sell/subscription.
function isSameProduct(mainInfo, p) {
  if (p.handle && mainInfo.handle && p.handle === mainInfo.handle) return true;
  if (mainInfo.group && itemGroup(p.tags) === mainInfo.group) return true;
  if (mainInfo.base && baseTitle(p.title) === mainInfo.base) return true;
  return false;
}

// Top-N complementary, affordable, in-stock products — with a per-category cap so the
// grid stays varied (not six pairs of socks).
function pickUpsells(mainInfo, catalog, n = 6) {
  const scored = catalog
    .filter((p) => p.available !== false && p.image && !isSameProduct(mainInfo, p))
    .map((p) => ({ p, s: upsellScore(mainInfo, p) }))
    .sort((a, b) => b.s - a.s);

  const perType = {};
  const seenBase = new Set(); // one colourway per product
  const out = [];
  for (const { p } of scored) {
    if (out.length >= n) break;
    const base = baseTitle(p.title);
    if (base && seenBase.has(base)) continue; // skip other colours of a product already shown
    const key = (p.type || "other").toLowerCase();
    if ((perType[key] || 0) >= 3) continue; // variety cap across categories
    perType[key] = (perType[key] || 0) + 1;
    if (base) seenBase.add(base);
    out.push({
      title: p.title,
      price: p.price,
      currency: p.currency,
      image: p.image,
      url: p.url,
    });
  }
  // Backfill (relax the caps, still no exact-product repeats) if the catalog is small.
  if (out.length < n) {
    const have = new Set(out.map((o) => o.url));
    for (const { p } of scored) {
      if (out.length >= n) break;
      if (have.has(p.url)) continue;
      out.push({ title: p.title, price: p.price, currency: p.currency, image: p.image, url: p.url });
    }
  }
  return out;
}

// --- subscription: the most replenishable item in the whole catalog ----------------
function subscriptionScore(p) {
  const hay = `${p.title || ""} ${p.type || ""} ${(p.tags || []).join(" ")}`;
  let score = 0;
  if (CONSUMABLE_RE.test(hay)) score += 100; // true consumable (coffee, skincare…)
  if (/\b(socks?|underwear)\b/i.test(hay)) score += 60; // classic re-buy staples
  // Replenishable care items — worded tightly so a "Clean Up Cap" doesn't match.
  if (/\b(cleaner|cleaning kit|refill|care kit|shoe care|protector spray)\b/i.test(hay))
    score += 50;
  return score;
}

function pickSubscription(mainInfo, catalog) {
  const ranked = catalog
    .filter((p) => p.available !== false && p.image && !isSameProduct(mainInfo, p))
    .map((p) => ({ p, s: subscriptionScore(p) }))
    .filter((x) => x.s > 0)
    // Best signal first; tie-break to the cheaper (lower-commitment) subscribe item.
    .sort((a, b) => b.s - a.s || (toNumber(a.p.price) ?? 1e9) - (toNumber(b.p.price) ?? 1e9));

  const p = ranked[0]?.p;
  if (!p) return null;
  return {
    title: p.title,
    price: p.price,
    currency: p.currency,
    image: p.image,
    images: p.image ? [p.image] : [],
    url: p.url,
  };
}

// Fetch the whole Shopify storefront catalog (products.json). Currency isn't in that
// feed, so it's inherited from the scraped main product. Returns [] for non-Shopify.
async function fetchShopifyCatalog(origin, currency) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${origin}/products.json?limit=250`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products = Array.isArray(data.products) ? data.products : [];
    return products
      .map((p) => {
        const images = (p.images || []).map((i) => i && i.src).filter(Boolean);
        const variants = Array.isArray(p.variants) ? p.variants : [];
        const tags = Array.isArray(p.tags)
          ? p.tags
          : String(p.tags || "").split(",").map((s) => s.trim());
        return {
          handle: p.handle,
          title: p.title,
          price: variants[0] && variants[0].price != null ? String(variants[0].price) : "",
          currency,
          image: images[0] || "",
          images,
          type: p.product_type || "",
          tags,
          available: variants.some((v) => v && v.available),
          url: `${origin}/products/${p.handle}`,
        };
      })
      .filter((p) => p.title && p.image);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// Discover other product URLs from a product page's HTML (fallback for non-Shopify
// stores that don't expose products.json). Same-origin links that look like a product.
export function discoverProductUrls(mainUrl, html, limit = 8) {
  let origin;
  try {
    origin = new URL(mainUrl).origin;
  } catch {
    return [];
  }
  const mainPath = (() => {
    try {
      return new URL(mainUrl).pathname;
    } catch {
      return "";
    }
  })();

  const seen = new Set([mainPath]);
  const out = [];
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    if (out.length >= limit) break;
    let u;
    try {
      u = new URL(m[1], mainUrl);
    } catch {
      continue;
    }
    if (u.origin !== origin) continue;
    const p = u.pathname;
    if (seen.has(p)) continue;
    const looksProduct =
      /\/\d+-[^/]+\.html?$/i.test(p) || /\/products?\/[^/]+$/i.test(p);
    if (!looksProduct) continue;
    seen.add(p);
    out.push(u.origin + p);
  }
  return out;
}

// The store/brand name, for the email sender. Prefer og:site_name, then a JSON-LD
// Organization/WebSite name, then a title-cased domain.
function extractStoreName(html, url) {
  const decode = (s) =>
    String(s || "")
      .replace(/&amp;/g, "&")
      .replace(/&#0*39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();

  const og =
    html.match(
      /<meta[^>]+property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i
    );
  if (og && og[1].trim()) return decode(og[1]);

  const app = html.match(
    /<meta[^>]+name=["']application-name["'][^>]*content=["']([^"']+)["']/i
  );
  if (app && app[1].trim()) return decode(app[1]);

  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const base = host.split(".")[0].replace(/[-_]+/g, " ");
    return base.replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
}

// Scrape a store from one product URL:
//   - main:         the product page's product (full image gallery, sizes, price)  [abandoned cart]
//   - others:       top complementary/affordable products from the WHOLE catalog   [upsell]
//   - subscription: the most replenishable product from the whole catalog          [subscription]
// Shopify stores use products.json for the catalog; others fall back to on-page link
// discovery (upsell only, no catalog-wide subscription pick).
export async function scrapeStore(url, othersLimit = 6) {
  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      redirect: "follow",
      cache: "no-store",
    });
    html = await res.text();
  } catch {
    /* discovery/store-name just yield less */
  }

  const main = await scrapeProduct(url);
  const storeName = extractStoreName(html, url);
  const currency = main.currency || "";

  let origin = "";
  let mainHandle = "";
  try {
    const u = new URL(url);
    origin = u.origin;
    mainHandle = (u.pathname.match(/\/products\/([^/]+)/) || [])[1] || "";
  } catch {
    /* ignore */
  }

  const catalog = origin ? await fetchShopifyCatalog(origin, currency) : [];

  let others = [];
  let subscription = null;

  if (catalog.length) {
    const mainEntry = catalog.find((p) => p.handle === mainHandle) || null;
    const mainInfo = {
      handle: mainHandle,
      type: (mainEntry?.type || "").toLowerCase(),
      base: baseTitle(mainEntry?.title || main.title),
      group: itemGroup(mainEntry?.tags),
      price: toNumber(main.price),
    };
    others = pickUpsells(mainInfo, catalog, othersLimit);
    subscription = pickSubscription(mainInfo, catalog);
  } else {
    // Non-Shopify fallback: related products discovered on the page (upsell only).
    const candidateUrls = discoverProductUrls(url, html, othersLimit + 6);
    for (const u of candidateUrls) {
      if (others.length >= othersLimit) break;
      try {
        const p = await scrapeProduct(u);
        if (p.title && p.images[0]) {
          others.push({
            title: p.title,
            price: p.price,
            currency: p.currency,
            description: p.description,
            image: p.images[0],
            url: u,
          });
        }
      } catch {
        /* skip products that fail to scrape */
      }
    }
  }

  return {
    storeName,
    main: { ...main, image: main.images[0] || "", url },
    others,
    subscription,
  };
}
