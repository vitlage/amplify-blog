// Server-side product scraper. Fetches a product page and extracts basic commerce
// fields from JSON-LD (schema.org/Product) and Open Graph / meta tags. No external
// service and no HTML-parser dependency — regex + JSON.parse only.
//
// Returns: { title, price, currency, description, images[], sizes[] }
// Caveat: a plain fetch can be blocked by aggressive anti-bot or JS-only stores;
// in that case fields come back empty and the caller surfaces per-token warnings.

function decodeEntities(s) {
  if (!s) return "";
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => {
      try {
        return String.fromCodePoint(Number(n));
      } catch {
        return "";
      }
    })
    .trim();
}

function absolutize(src, base) {
  if (!src) return "";
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

// All <meta ... property|name|itemprop="key" ... content="..."> values, any attr order.
function metaAll(html, key) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `<meta\\b[^>]*?(?:property|name|itemprop)\\s*=\\s*["']${k}["'][^>]*>`,
    "gi"
  );
  const out = [];
  for (const tag of html.match(re) || []) {
    const c = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (c) out.push(decodeEntities(c[1]));
  }
  return out;
}
const metaOne = (html, key) => metaAll(html, key)[0] || "";

function extractJsonLd(html) {
  const blocks = [];
  const re =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1].trim()));
    } catch {
      /* skip malformed JSON-LD blocks */
    }
  }
  return blocks;
}

// Walk a JSON-LD tree collecting nodes whose @type is (or includes) "Product".
function findProducts(node, acc = []) {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    node.forEach((n) => findProducts(n, acc));
    return acc;
  }
  const t = node["@type"];
  const types = (Array.isArray(t) ? t : [t]).map((x) => String(x).toLowerCase());
  if (types.includes("product")) acc.push(node);
  for (const key of Object.keys(node)) {
    if (key === "@type") continue;
    findProducts(node[key], acc);
  }
  return acc;
}

const SIZE_LABEL_RE =
  /\b(size|sizes|taille|tailles|gr[oö]sse|größe|talla|tallas|pointure|misura|tama[nñ]o)\b/i;

// Normalize a raw list of candidate size labels: decode, trim, drop placeholders
// ("Choose a size", "--", …) and obvious non-sizes, dedupe, cap the count.
function cleanSizes(list) {
  const out = [];
  const seen = new Set();
  for (const raw of list) {
    const v = decodeEntities(String(raw ?? "")).replace(/\s+/g, " ").trim();
    if (!v || v.length > 24) continue;
    if (/^(size|sizes|taille|—|0)$/i.test(v)) continue;
    // Dropdown placeholders across languages ("Choose a size", "-- Choisir --",
    // "Seleziona", "Bitte wählen", …) and dash/ellipsis-wrapped prompts.
    if (/^-{2,}|-{2,}$|^\.{2,}|\.{2,}$/.test(v)) continue;
    if (
      /\b(choose|choisir|choisissez|s[ée]lectionn|selecciona|seleziona|w[aä]hl|ausw[aä]hl|escolh|v[æa]lg|v[aä]lj|kies|please|pick|select)\b/i.test(
        v
      )
    )
      continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= 12) break;
  }
  return out;
}

// Best-effort size extraction. Sizes live in wildly different places across stores,
// so try the most reliable sources first and return the first that yields anything:
//   1) JSON-LD `size` (on the Product node or its variants)
//   2) Shopify-style options JSON ({"name":"Size", … "values":[…]})
//   3) a <select> dropdown whose attributes or preceding label mention "size"
// Returns [] when the product has no sizes (e.g. a one-size item) — the caller
// then hides the size picker instead of showing fabricated sizes.
function extractSizes(html, products) {
  // 1) JSON-LD `size` anywhere within a product node (incl. nested hasVariant).
  const ldSizes = [];
  const collectLd = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(collectLd);
    const s = node.size;
    if (s != null) {
      const push = (x) => {
        if (x == null) return;
        if (typeof x === "object") ldSizes.push(String(x.name ?? x.value ?? ""));
        else ldSizes.push(String(x));
      };
      Array.isArray(s) ? s.forEach(push) : push(s);
    }
    for (const k of Object.keys(node)) {
      if (k === "size") continue;
      collectLd(node[k]);
    }
  };
  products.forEach(collectLd);
  let sizes = cleanSizes(ldSizes);
  if (sizes.length) return sizes;

  // 2) Shopify-style option group: {"name":"Size","position":1,"values":[…]}.
  const optSizes = [];
  const optRe = /"name"\s*:\s*"([^"]+)"[^{}]*?"values"\s*:\s*(\[[^\]]*\])/gi;
  let om;
  while ((om = optRe.exec(html))) {
    if (!SIZE_LABEL_RE.test(om[1])) continue;
    try {
      const vals = JSON.parse(om[2]);
      if (Array.isArray(vals)) vals.forEach((v) => optSizes.push(v));
    } catch {
      /* skip malformed values array */
    }
  }
  sizes = cleanSizes(optSizes);
  if (sizes.length) return sizes;

  // 3) A <select> size dropdown — attributes or the label just before it mention size.
  const selSizes = [];
  const selRe = /<select\b([^>]*)>([\s\S]*?)<\/select>/gi;
  let sm;
  while ((sm = selRe.exec(html))) {
    const attrs = sm[1] || "";
    const before = html.slice(Math.max(0, sm.index - 220), sm.index);
    if (!SIZE_LABEL_RE.test(attrs) && !SIZE_LABEL_RE.test(before)) continue;
    for (const opt of sm[2].matchAll(/<option\b[^>]*>([\s\S]*?)<\/option>/gi)) {
      selSizes.push(opt[1].replace(/<[^>]+>/g, ""));
    }
  }
  return cleanSizes(selSizes);
}

export async function scrapeProduct(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let html;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = new Error(`the store returned HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    html = await res.text();
  } finally {
    clearTimeout(timer);
  }

  // JSON-LD product node (most reliable when present).
  let ld = {};
  const products = extractJsonLd(html).flatMap((b) => findProducts(b));
  if (products.length) ld = products[0];

  let offer = ld.offers;
  if (Array.isArray(offer)) offer = offer[0];
  offer = offer && typeof offer === "object" ? offer : {};
  const offerSpec =
    offer.priceSpecification && typeof offer.priceSpecification === "object"
      ? offer.priceSpecification
      : {};

  const titleTag = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";

  const title =
    (typeof ld.name === "string" && ld.name) ||
    metaOne(html, "og:title") ||
    metaOne(html, "twitter:title") ||
    decodeEntities(titleTag);

  const price =
    (offer.price != null && offer.price !== "" ? String(offer.price) : "") ||
    (offerSpec.price != null ? String(offerSpec.price) : "") ||
    metaOne(html, "product:price:amount") ||
    metaOne(html, "og:price:amount") ||
    "";

  const currency =
    offer.priceCurrency ||
    offerSpec.priceCurrency ||
    metaOne(html, "product:price:currency") ||
    metaOne(html, "og:price:currency") ||
    "";

  const description =
    (typeof ld.description === "string" && ld.description) ||
    metaOne(html, "og:description") ||
    metaOne(html, "description") ||
    metaOne(html, "twitter:description") ||
    "";

  // Images: the product gallery from every JSON-LD product node (image can be a
  // string | array | {url}), then Open Graph, absolutized. Dedupe by "photo id" so
  // the same photo in different sizes (PrestaShop -home_default / -large_default,
  // Shopify _100x/_500x) collapses to one — otherwise a 1-photo product looks like many.
  const images = [];
  const pushImg = (v) => {
    if (!v) return;
    if (typeof v === "string") images.push(absolutize(v, url));
    else if (Array.isArray(v)) v.forEach(pushImg);
    else if (typeof v === "object" && v.url) images.push(absolutize(v.url, url));
  };
  // Collect every image within each product node — the gallery is sometimes on the
  // Product, sometimes on its nested Offer (e.g. PrestaShop puts it under offers.image).
  const collectImages = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(collectImages);
      return;
    }
    if (node.image) pushImg(node.image);
    for (const k of Object.keys(node)) {
      if (k === "image") continue;
      collectImages(node[k]);
    }
  };
  for (const prod of products) collectImages(prod);
  metaAll(html, "og:image").forEach((v) => images.push(absolutize(v, url)));
  metaAll(html, "og:image:secure_url").forEach((v) => images.push(absolutize(v, url)));
  metaAll(html, "twitter:image").forEach((v) => images.push(absolutize(v, url)));

  const photoKey = (u) => {
    const presta = u.match(/\/(\d+)-[a-z]+_default\//i);
    if (presta) return presta[1];
    return u
      .replace(/_\d+x\d*(\.[a-z]+)(\?.*)?$/i, "$1") // Shopify size suffix
      .replace(/[?&](width|height|v)=[^&]*/gi, "");
  };
  const seen = new Set();
  const uniqueImages = images.filter((i) => {
    if (!i) return false;
    const k = photoKey(i);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return {
    title: decodeEntities(title),
    price: String(price).trim().replace(/[^\d.,]/g, "") || String(price).trim(),
    currency: String(currency).trim(),
    description: decodeEntities(description).slice(0, 500),
    images: uniqueImages.slice(0, 10),
    sizes: extractSizes(html, products),
  };
}
