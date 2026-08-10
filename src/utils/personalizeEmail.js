// Inject a scraped store catalog into the demo AMP templates so the lead's emails
// show real products. catalog = { main: {title, price, currency, image, images[]},
//   others: [{title, price, currency, image}] }.
//
// The templates carry the demo product hardcoded (image srcs under
// /photos_of_products_in_amp, data-product-title / data-product-price markers, and
// amp-state price literals). We replace those in place. Best-effort: if catalog
// fields are missing, the demo values are left as-is.

const CURRENCY_SYMBOL = { EUR: "€", USD: "$", GBP: "£", JPY: "¥", CAD: "$", AUD: "$" };

function symbol(currency) {
  const c = String(currency || "").toUpperCase();
  return CURRENCY_SYMBOL[c] || (c ? `${c} ` : "$");
}

function toNumber(price) {
  const n = parseFloat(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(s, n) {
  const t = String(s ?? "").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

// Escape a value for use inside a single-quoted AMP expression string.
function jsStr(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// One size chip mirroring the template's markup. `selected` marks the initial pick.
// Price literals (99/89) are left intact so the price pass rewrites them in place.
function sizeBox(size, selected) {
  const js = jsStr(size);
  const txt = esc(size);
  const cls = selected ? "size-box selected" : "size-box";
  return (
    `                <div class="${cls}"\n` +
    `                     data-size="${txt}"\n` +
    `                     [class]="cart.size == '${js}' ? 'size-box selected' : 'size-box'"\n` +
    `                     on="tap:AMP.setState({cart: {basePrice: 99, discountPrice: 89, price: 99, baseShipping: 15, shipping: 15, upsellPrice: 25, color: cart.color, size: '${js}', offerUnlocked: cart.offerUnlocked, upsellActive: cart.upsellActive}})"\n` +
    `                     role="button"\n` +
    `                     tabindex="0">${txt}</div>`
  );
}

// --- Abandoned cart: single main product (photo + title + price + amp math) ------
function personalizeAbandonedCart(html, main) {
  if (!main) return html;
  // Up to 4 photos in the picker (the template has 4 hero slots).
  const imgs = (main.images && main.images.length ? main.images : [main.image])
    .filter(Boolean)
    .slice(0, 4);
  if (imgs[0]) {
    html = html
      .replace("/photos_of_products_in_amp/1.webp", esc(imgs[0]))
      .replace("/photos_of_products_in_amp/2.webp", esc(imgs[1] || imgs[0]))
      .replace("/photos_of_products_in_amp/3.webp", esc(imgs[2] || imgs[0]))
      .replace("/photos_of_products_in_amp/4.webp", esc(imgs[3] || imgs[0]));

    // The template's "Select Color" swatches double as the image switcher (each
    // color shows a different hero). We have no color data — repurpose them as a
    // PHOTO picker (real photos), and hide the block entirely with a single photo.
    if (imgs.length <= 1) {
      html = html.replace(
        '<div id="variant-block">',
        '<div id="variant-block" style="display:none">'
      );
    } else {
      // Each swatch -> the Nth photo, or hidden if there's no Nth photo.
      const setSwatch = (img) =>
        img
          ? `style="background-image:url('${esc(img)}');background-size:cover;background-position:center;"`
          : 'style="display:none"';
      html = html
        .replace(">Select Color<", ">Photos<")
        .replace('style="background: #B8B0A2;"', setSwatch(imgs[0]))
        .replace(
          'style="background: #FFFFFF; border: 1px solid #E5E7EB;"',
          setSwatch(imgs[1])
        )
        .replace('style="background: #000000;"', setSwatch(imgs[2]))
        .replace('style="background: #64748B;"', setSwatch(imgs[3]));
    }
  }
  if (main.title) {
    html = html.replace(/(data-product-title[^>]*>)[^<]*/, `$1${esc(truncate(main.title, 70))}`);
  }

  // Size picker: replace the template's hardcoded 6–10 boxes with the scraped sizes.
  // A product with no sizes (one-size item) hides the whole block — label included —
  // so we never show fabricated sizes. Runs before the price pass below so the
  // generated boxes' price literals get substituted along with the rest.
  const sizes = (Array.isArray(main.sizes) ? main.sizes : [])
    .map((s) => String(s).trim())
    .filter(Boolean);
  if (sizes.length) {
    const boxes = sizes.map((s, i) => sizeBox(s, i === 0)).join("\n");
    html = html.replace(
      /<!-- SIZE_BOXES_START -->[\s\S]*?<!-- SIZE_BOXES_END -->/,
      `<!-- SIZE_BOXES_START -->\n${boxes}\n                <!-- SIZE_BOXES_END -->`
    );
    // Default the selected size (amp-state + offer-card handler) to the first size.
    const first = jsStr(sizes[0]);
    html = html
      .replace(/"size"\s*:\s*"8"/, `"size": "${first}"`)
      .replace(/size:\s*'8'/g, `size: '${first}'`);
  } else {
    html = html.replace(
      '<div id="size-block">',
      '<div id="size-block" style="display:none">'
    );
  }

  const P = toNumber(main.price);
  if (P != null) {
    const D = Math.max(1, Math.round(P * 0.9));
    html = html
      .replace(/("?basePrice"?\s*:\s*)99\b/g, `$1${P}`)
      .replace(/(\bprice"?\s*:\s*)99\b/g, `$1${P}`)
      .replace(/("?discountPrice"?\s*:\s*)89\b/g, `$1${D}`)
      .replace(/\?\s*99\s*:\s*89\b/g, `? ${P} : ${D}`)
      .replace(/\?\s*89\s*:\s*99\b/g, `? ${D} : ${P}`)
      .replace(/(data-product-price[^>]*>)\s*99\s*/g, `$1${P}`)
      .replace(/\$/g, symbol(main.currency));
  }

  // Checkout demo reveal: fill the "Added to checkout - …" summary with the real
  // product name, the selected size (only when the product actually has sizes) and
  // the live total. Runs after the price pass so the symbol here isn't re-substituted.
  // Color is intentionally omitted — the swatches are repurposed as a photo picker,
  // so there is no real color variant to show.
  const summaryName = esc(truncate(main.title || "your item", 48));
  const sizePart = sizes.length
    ? ` · Size <span [text]="cart.size">${esc(sizes[0])}</span>`
    : "";
  const totalExpr =
    "cart.price + (cart.upsellActive ? cart.upsellPrice : 0) + cart.shipping";
  const totalDefault = (P != null ? P : 99) + 15;
  const summary =
    `${summaryName}${sizePart} · ${symbol(main.currency)}` +
    `<span [text]="${totalExpr}">${totalDefault}</span>`;
  html = html.replace("<!-- CHECKOUT_SUMMARY -->", summary);

  return html;
}

// --- Upsell: fill the 6-item cross-sell grid with discovered products ------------
const UPSELL_ITEMS = [
  { img: "/photos_of_products_in_amp/airpods4.jpg", title: "Headphones", price: "$45.00" },
  { img: "/photos_of_products_in_amp/applewatch.png?v=2", title: "Watch", price: "$89.00" },
  { img: "/photos_of_products_in_amp/ridgewallet.png", title: "Wallet", price: "$35.00" },
  { img: "/photos_of_products_in_amp/versace_scarf.png", title: "Scarf", price: "$199.00" },
  { img: "/photos_of_products_in_amp/fendi_sandals.png", title: "Sandals", price: "$55.00" },
  { img: "/photos_of_products_in_amp/miumiu_belt.png", title: "Belt", price: "$29.00" },
];

function personalizeUpsell(html, others, currency, main) {
  if (!others || !others.length) return html;

  // Map each demo slot's price literal -> the real product price, so the cart
  // math is rewritten too. The template's add/remove handlers use `cart.price + N`
  // / `cart.price - N` with the demo increment N (45/89/35/…). Swapping only the
  // displayed price (as before) left the totals computed from demo values.
  const demoToReal = {};
  UPSELL_ITEMS.forEach((item, i) => {
    const o = others[i];
    if (!o) {
      // No real product for this slot — hide the whole block. The demo fallback
      // images don't exist as assets, so leaving the slot would render a broken
      // image. Key off the slot's unique demo image to target only this block.
      const q = item.img.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      html = html.replace(
        new RegExp(
          `(<div class="upsell-product") (data-product-block>\\s*<amp-img\\s+src="${q}")`
        ),
        `$1 style="display:none" $2`
      );
      return;
    }
    if (o.image) html = html.replace(item.img, esc(o.image));
    if (o.title) {
      html = html.replace(
        `data-product-title>${item.title}`,
        `data-product-title>${esc(truncate(o.title, 34))}`
      );
    }
    const pn = toNumber(o.price);
    const disp = pn != null ? `${symbol(o.currency)}${pn}` : o.price || "";
    if (disp) {
      html = html.replace(
        `data-product-price>${item.price}`,
        `data-product-price>${esc(disp)}`
      );
    }
    const demoN = toNumber(item.price);
    if (pn != null && demoN != null) demoToReal[demoN] = pn;
  });

  // Rewrite every `cart.price ± N` increment in a SINGLE pass so a real price that
  // happens to equal another slot's demo literal can't cascade into a double swap.
  // Slots with no real product keep their demo increment (and demo display), so
  // they stay self-consistent.
  html = html.replace(/cart\.price ([+-]) (\d+)/g, (m, op, n) => {
    const real = demoToReal[Number(n)];
    return real != null ? `cart.price ${op} ${real}` : m;
  });

  // The Subtotal starts at the cart's base price (demo 50). Base it on the real
  // main product the upsells complement, so Subtotal = main + added upsells.
  const base = toNumber(main?.price);
  if (base != null) {
    html = html
      .replace(/("?basePrice"?\s*:\s*)50\b/g, `$1${base}`)
      .replace(/(\bprice"?\s*:\s*)50\b/g, `$1${base}`);
  }

  // Normalize any remaining currency symbols (running totals etc.) to the store's.
  if (currency) html = html.replace(/\$/g, symbol(currency));
  return html;
}

// --- Subscription: a consumable product is the hero of the story ("your coffee /
// cream / protein arrives every month"). Unlike cart/upsell, we pick a product that
// actually makes sense as a subscription: the lead's own item if it's consumable,
// else the first consumable among the discovered products, else a universal demo
// default (protein). Then we build a consistent price chain where the delivery
// frequency drives a live discount.

// Replenishable / consumable signals — products people re-buy on a cadence.
const CONSUMABLE_RE =
  /\b(coffee|espresso|roast|beans?|tea|matcha|protein|whey|creatine|supplement|vitamins?|collagen|powder|serum|cream|lotion|moisturi\w*|skin ?care|cleanser|shampoo|conditioner|soap|refill|capsules?|pods?|snacks?|granola|probiotic|deodorant|razor|blades?|toothpaste|detergent|candle|filter|treats|kibble|formula|diapers?|wipes|juice|kombucha|honey|spice|nutrition|gummies|drops)\b/i;

// Demo fallback when the scraped store has no consumable (e.g. billiard / sneakers).
// NOTE: hosted placeholder image — swap for your own asset if desired.
const SUB_DEMO_IMAGE =
  "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80";
const SUB_DEMO_PRODUCT = {
  title: "Daily Protein Blend",
  price: "119",
  currency: "USD",
  image: SUB_DEMO_IMAGE,
  images: [SUB_DEMO_IMAGE],
};

// Frequency -> discount. More frequent = deeper discount (the AMP "spin the cadence,
// price moves live" moment). Default is Month.
const SUB_FREQS = [
  { key: "week", label: "Week", save: 25 },
  { key: "2weeks", label: "2 weeks", save: 20 },
  { key: "month", label: "Month", save: 15 },
  { key: "2months", label: "2 months", save: 10 },
];
const SUB_DEFAULT_FREQ = "month";

function pickSubscriptionProduct(catalog) {
  const consumable = (p) =>
    p && CONSUMABLE_RE.test(`${p.title || ""} ${p.description || ""}`);
  if (consumable(catalog?.main)) return catalog.main;
  const other = (catalog?.others || []).find(consumable);
  if (other)
    return {
      title: other.title,
      price: other.price,
      currency: other.currency,
      image: other.image,
      images: other.image ? [other.image] : [],
    };
  return null;
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Any real product photo from the scraped store, for the durable-niche care kit.
function firstScrapedImage(catalog) {
  return (
    catalog?.main?.image ||
    (catalog?.main?.images && catalog.main.images[0]) ||
    (catalog?.others || []).map((o) => o.image).find(Boolean) ||
    null
  );
}

// The honest one-liner shown for durable niches — reframes the slot from "a product
// you own" to "the subscription model you could launch". This is the agency pitch.
const SUB_LAUNCH_BANNER =
  `<div style="text-align: center; font-size: 12px; font-weight: 300; color: #6B7280; ` +
  `background: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 12px; ` +
  `padding: 10px 16px; margin-bottom: 24px;">` +
  `Don't have a subscription product yet? This is how you'd launch one - ` +
  `recurring revenue, right from the inbox.</div>`;

function personalizeSubscription(html, catalog) {
  // Consumable niche -> their real product (already subscription-ready).
  // Durable niche (no consumable found) -> a plausible "Monthly Care Kit" built from
  // their own photo, framed as the recurring model they could launch.
  const consumable = pickSubscriptionProduct(catalog);
  let product;
  let isFuture = false;
  if (consumable) {
    product = consumable;
  } else {
    const img = firstScrapedImage(catalog) || SUB_DEMO_IMAGE;
    const mainP = toNumber(catalog?.main?.price);
    const kitPrice = mainP != null ? clamp(Math.round(mainP * 0.25), 19, 59) : 39;
    product = {
      title: "Monthly Care Kit",
      price: String(kitPrice),
      currency: catalog?.main?.currency,
      image: img,
      images: [img],
    };
    isFuture = true;
  }
  const sym = symbol(product.currency);
  const oneTime = toNumber(product.price) ?? 119;
  const perDelivery = (save) => Math.max(1, Math.round(oneTime * (1 - save / 100)));
  const def = SUB_FREQS.find((f) => f.key === SUB_DEFAULT_FREQ);

  // 1) Hero image — the subscription's subject.
  const img =
    (product.images && product.images[0]) || product.image || SUB_DEMO_IMAGE;
  html = html.replace(
    /(<amp-img\b[^>]*\bdata-sub-hero\b[^>]*\bsrc=")[^"]*(")/,
    `$1${esc(img)}$2`
  );

  // 2) Product title (header h1 + the success-line name).
  const title = esc(truncate(product.title || SUB_DEMO_PRODUCT.title, 48));
  html = html
    .replace(/(data-product-title[^>]*>)[^<]*/, `$1${title}`)
    .replace("<!-- SUB_SUCCESS_NAME -->", title);

  // 3) Cart state — one consistent chain: oneTime (struck), price (per-delivery at
  // the default cadence), savePct, shipping.
  const cartState = {
    oneTime,
    price: perDelivery(def.save),
    savePct: def.save,
    frequency: SUB_DEFAULT_FREQ,
    shipping: 15,
  };
  html = html.replace(
    /(<amp-state id="cart">\s*<script type="application\/json">)[\s\S]*?(<\/script>)/,
    `$1\n    ${JSON.stringify(cartState, null, 0)}\n    $2`
  );

  // 4) Frequency buttons — each sets its own per-delivery price + discount live.
  const buttons = SUB_FREQS.map((f) => {
    const sel = f.key === SUB_DEFAULT_FREQ ? " selected" : "";
    return (
      `                <div class="size-box${sel}"\n` +
      `                     data-frequency="${f.key}"\n` +
      `                     [class]="cart.frequency == '${f.key}' ? 'size-box selected' : 'size-box'"\n` +
      `                     on="tap:AMP.setState({cart: {oneTime: cart.oneTime, price: ${perDelivery(
        f.save
      )}, savePct: ${f.save}, frequency: '${f.key}', shipping: cart.shipping}})"\n` +
      `                     role="button"\n` +
      `                     tabindex="0">${f.label}</div>`
    );
  }).join("\n");
  html = html.replace(
    /<!-- SUB_FREQ_START -->[\s\S]*?<!-- SUB_FREQ_END -->/,
    `<!-- SUB_FREQ_START -->\n${buttons}\n                <!-- SUB_FREQ_END -->`
  );

  // 5) Launch line — only for durable niches, where the kit is a "what you could
  // launch" pitch rather than a product they already sell.
  html = html.replace("<!-- SUB_LAUNCH_LINE -->", isFuture ? SUB_LAUNCH_BANNER : "");

  // 6) Currency — swap the template's $ placeholders to the store symbol.
  html = html.replace(/\$/g, sym);

  return html;
}

export function personalizeEmail(templateKey, html, catalog) {
  if (!html || !catalog) return html;
  switch (templateKey) {
    case "abandoned-cart-recovery":
      return personalizeAbandonedCart(html, catalog.main);
    case "upsell":
      return personalizeUpsell(
        html,
        catalog.others,
        catalog.main?.currency || catalog.others?.[0]?.currency,
        catalog.main
      );
    case "subscription":
      return personalizeSubscription(html, catalog);
    default:
      return html;
  }
}
