import { scrapeProduct, fetchShopifyProduct } from "@/utils/scrapeProduct";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function toNumber(price) {
  const n = parseFloat(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

// A page scrape only anchors the abandoned-cart email if it actually found a product.
// A store homepage / collection URL (or a bot-blocked page) comes back with no price
// AND no images — that's the signal to fall back to a catalog product instead.
export function scrapeIsProduct(main) {
  return !!(toNumber(main?.price) != null || (main?.images && main.images.length));
}

// The catalog product to anchor `main` on when the given URL wasn't a product page:
// the URL's own handle if it resolved, else the store's first in-stock product with a
// photo (its anchor product), else whatever the catalog has.
export function anchorMainFromCatalog(catalog, handle) {
  const list = Array.isArray(catalog) ? catalog : [];
  return (
    list.find((p) => p.handle === handle) ||
    list.find((p) => p.available !== false && p.image) ||
    list[0] ||
    null
  );
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

// Match a catalog product to a non-product landing URL (e.g. /pages/catch-camera-new)
// whose scrape only yielded a single banner image: by handle prefix
// (catch-camera <- catch-camera-new), then by title. Lets a campaign page borrow the
// real product's photo gallery while keeping the page's own hero as the primary image.
function matchCatalogProduct(catalog, pageSlug, mainTitle, linkedHandles = []) {
  const slug = String(pageSlug || "").toLowerCase();
  const byHandle = catalog
    .filter(
      (p) =>
        p.handle && slug && (slug === p.handle || slug.startsWith(p.handle + "-"))
    )
    .sort((a, b) => b.handle.length - a.handle.length)[0];
  if (byHandle) return byHandle;

  // The page's product the landing page links to most (its buy buttons / cards),
  // among those whose handle extends the page slug (goodie -> goodie-fermented-…).
  const linked = linkedHandles
    .map((h) => catalog.find((p) => p.handle === h))
    .filter(Boolean);
  const linkedBySlug = linked.find((p) => slug && p.handle.startsWith(slug + "-"));
  if (linkedBySlug) return linkedBySlug;

  const mt = baseTitle(mainTitle);
  if (!mt) return null;
  return (
    catalog.find((p) => baseTitle(p.title) === mt) ||
    catalog.find((p) => {
      const bt = baseTitle(p.title);
      return bt && (mt.includes(bt) || bt.includes(mt));
    }) ||
    null
  );
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
  /\b(coffee|espresso|roast|beans?|tea|matcha|protein|whey|creatine|supplement|vitamins?|collagen|powder|serum|cream|lotion|moisturi\w*|skin ?care|cleanser|shampoo|conditioner|soap|refill|capsules?|pods?|snacks?|granola|probiotic|deodorant|razor|blades?|toothpaste|detergent|candle|filter|treats|kibble|formula|diapers?|wipes|juice|kombucha|drinks?|beverages?|fermented|honey|spice|nutrition|gummies|drops)\b/i;

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

// Candidates for upsell/subscription: in-stock, has a photo, not the main product.
// A single-line brand (cannumo: "GOODIE – Fermented Raspberry / Blackcurrant / Sea
// Buckthorn Drink") collapses every product to one base title, which would leave
// nothing — then fall back to excluding only the exact main product.
function candidates(mainInfo, catalog) {
  const ok = catalog.filter((p) => p.available !== false && p.image);
  const strict = ok.filter((p) => !isSameProduct(mainInfo, p));
  if (strict.length) return strict;
  return ok.filter((p) => !(p.handle && p.handle === mainInfo.handle));
}

// Top-N complementary, affordable, in-stock products — with a per-category cap so the
// grid stays varied (not six pairs of socks).
function pickUpsells(mainInfo, catalog, n = 6) {
  const pool = candidates(mainInfo, catalog);
  const relaxed = pool.some((p) => isSameProduct(mainInfo, p));
  const scored = pool
    .map((p) => ({ p, s: upsellScore(mainInfo, p) }))
    .sort((a, b) => b.s - a.s);

  const perType = {};
  const seenBase = new Set(); // one colourway per product
  const out = [];
  for (const { p } of scored) {
    if (out.length >= n) break;
    const base = relaxed ? "" : baseTitle(p.title);
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
  const ranked = candidates(mainInfo, catalog)
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
async function fetchShopifyCatalog(origin, currency, path = "/products.json?limit=250") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${origin}${path}`, {
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

// Product handles a page links to, most-linked first (a landing page's buy buttons and
// product cards all point at its hero product).
function linkedProductHandles(html) {
  const counts = new Map();
  for (const m of String(html || "").matchAll(/\/products\/([a-z0-9][a-z0-9-]*)/gi)) {
    const h = m[1].toLowerCase();
    counts.set(h, (counts.get(h) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([h]) => h);
}

// Product handles from the store's Shopify product sitemap (sitemap.xml ->
// sitemap_products_1.xml). Served as a static-ish file, so it usually still answers
// when the products.json API is throttled.
async function sitemapProductHandles(origin, max = 40) {
  const get = async (u) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(u, {
        headers: { "User-Agent": UA },
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      });
      return res.ok ? await res.text() : "";
    } catch {
      return "";
    } finally {
      clearTimeout(timer);
    }
  };
  const index = await get(`${origin}/sitemap.xml`);
  const loc = (index.match(/<loc>([^<]*sitemap_products[^<]*)<\/loc>/i) || [])[1];
  if (!loc) return [];
  const xml = await get(loc.replace(/&amp;/g, "&"));
  const out = [];
  for (const m of xml.matchAll(/<loc>[^<]*\/products\/([a-z0-9][a-z0-9-]*)<\/loc>/gi)) {
    const h = m[1].toLowerCase();
    if (!out.includes(h)) out.push(h);
    if (out.length >= max) break;
  }
  return out;
}

// Fallback catalog when products.json is unavailable (Shopify throttles/blocks it for
// some datacenter IPs, e.g. our Cloud Run egress): read each linked product's AJAX
// record at /products/<handle>.js. Same shape as fetchShopifyCatalog.
async function fetchCatalogFromHandles(origin, handles, currency, max = 24) {
  const one = async (handle) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(`${origin}/products/${handle}.js`, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const p = await res.json();
      const images = (p.images || [])
        .map((src) => (typeof src === "string" ? src : src && src.src))
        .filter(Boolean)
        .map((src) => (src.startsWith("//") ? `https:${src}` : src));
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const cents = variants[0]?.price ?? p.price;
      return {
        handle: p.handle || handle,
        title: p.title,
        price: cents != null && cents !== "" ? (Number(cents) / 100).toFixed(2) : "",
        currency,
        image: images[0] || "",
        images,
        type: p.type || "",
        tags: Array.isArray(p.tags) ? p.tags : [],
        available: p.available !== false,
        url: `${origin}/products/${p.handle || handle}`,
      };
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
  const list = await Promise.all(handles.slice(0, max).map(one));
  return list.filter((p) => p && p.title && p.image);
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

  let main = await scrapeProduct(url);
  const pageImages = main.pageImages || [];
  const storeName = extractStoreName(html, url);
  let currency = main.currency || "";

  let origin = "";
  let mainHandle = "";
  let pageSlug = "";
  try {
    const u = new URL(url);
    origin = u.origin;
    mainHandle = (u.pathname.match(/\/products\/([^/]+)/) || [])[1] || "";
    const segs = u.pathname.split("/").filter(Boolean);
    pageSlug = segs[segs.length - 1] || "";
  } catch {
    /* ignore */
  }

  const linkedHandles = linkedProductHandles(html);
  let catalog = origin ? await fetchShopifyCatalog(origin, currency) : [];
  if (!catalog.length && origin) {
    catalog = await fetchShopifyCatalog(origin, currency, "/collections/all/products.json?limit=250");
  }
  if (!catalog.length && origin) {
    // products.json throttled: rebuild the catalog from the handles the page links to
    // plus the product sitemap, one /products/<handle>.js record each.
    const handles = [
      ...new Set([mainHandle, ...linkedHandles, ...(await sitemapProductHandles(origin))]),
    ].filter(Boolean);
    if (handles.length) catalog = await fetchCatalogFromHandles(origin, handles, currency);
  }
  const isLandingPage = !mainHandle;

  // The abandoned-cart email is anchored on `main`. A product-page scrape gives the
  // richest main (full gallery + sizes), but a store homepage / collection URL has no
  // product on the page — scrapeProduct returns no price and no images, so the email
  // would fall back to its demo default (the reported bug). When that happens and we
  // have a Shopify catalog, anchor main on a real catalog product and re-scrape its
  // product page for the full gallery + sizes.
  let mainUrl = url;
  if (!scrapeIsProduct(main) && catalog.length) {
    const anchor = anchorMainFromCatalog(
      catalog,
      mainHandle || matchCatalogProduct(catalog, pageSlug, main.title, linkedHandles)?.handle
    );
    if (anchor?.url) {
      mainUrl = anchor.url;
      mainHandle = anchor.handle || mainHandle;
      let scraped = null;
      try {
        scraped = await scrapeProduct(anchor.url);
      } catch {
        /* fall back to the catalog fields below */
      }
      main = scrapeIsProduct(scraped)
        ? scraped
        : {
            title: anchor.title,
            price: anchor.price,
            currency: anchor.currency || currency,
            description: "",
            images: anchor.images?.length
              ? anchor.images
              : anchor.image
              ? [anchor.image]
              : [],
            sizes: [],
          };
      currency = main.currency || currency;
    }
  }

  // A campaign / landing page (e.g. /pages/catch-camera-new) exposes only a single
  // banner og:image — not the product's photo gallery. When the URL wasn't a product
  // page and the scrape found at most one image, match the real catalog product and
  // use ITS gallery so the email's photo picker gets real product shots. We don't keep
  // the page's banner: it's usually the same shot as the gallery's first photo (just a
  // different theme-asset URL, so it dedupes to a visible duplicate).
  if (!mainHandle && catalog.length && (main.images?.length || 0) <= 1) {
    const match = matchCatalogProduct(catalog, pageSlug, main.title, linkedHandles);
    if (match?.images?.length) {
      const seen = new Set();
      const photoKey = (u) =>
        String(u || "")
          .replace(/^https?:\/\//i, "//")
          .replace(/[?#].*$/, "")
          .replace(/(_\d+x\d*)(\.[a-z]+)$/i, "$2"); // collapse Shopify size variants
      const merged = [];
      for (const src of match.images) {
        const k = photoKey(src);
        if (!src || seen.has(k)) continue;
        seen.add(k);
        merged.push(src);
      }
      main.images = merged.slice(0, 10);
      mainHandle = match.handle || mainHandle; // exclude the product from upsell/subscription
      if (!main.title && match.title) main.title = match.title;
    }
  }

  // A landing page's own hero gallery (e.g. cannumo.co.uk/pages/goodie: ~19 slides)
  // beats a catalog product that only has one or two photos.
  if (isLandingPage && pageImages.length > (main.images?.length || 0)) {
    main.images = pageImages.slice(0, 10);
  }

  // products.json omits currency; inherit the resolved product's so the upsell and
  // subscription emails render the same symbol as the abandoned-cart one.
  if (currency) for (const p of catalog) if (!p.currency) p.currency = currency;

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

  const { pageImages: _pageImages, ...mainOut } = main;
  return {
    storeName,
    main: { ...mainOut, image: main.images[0] || "", url: mainUrl },
    others,
    subscription,
  };
}
