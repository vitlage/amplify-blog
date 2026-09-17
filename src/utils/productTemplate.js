// Fill an AMP template's mustache tokens with scraped product data.
//
// Supported tokens (case-insensitive, optional whitespace):
//   {{product_title}} / {{title}}
//   {{product_price}} / {{price}}
//   {{product_currency}} / {{currency}}
//   {{product_description}} / {{description}}
//   {{product_url}} / {{url}}
//   {{product_image}}            first image
//   {{product_image_1}} … {{product_image_10}}   Nth image (falls back to last if fewer)
//
// scrape: { title, price, currency, description, url, images[], sizes[] }

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function fillTemplate(template, scrape) {
  const images = Array.isArray(scrape?.images) ? scrape.images.filter(Boolean) : [];
  const lastImage = images[images.length - 1] || "";

  const values = {
    product_title: scrape?.title || "",
    title: scrape?.title || "",
    product_price: scrape?.price || "",
    price: scrape?.price || "",
    product_currency: scrape?.currency || "",
    currency: scrape?.currency || "",
    product_description: scrape?.description || "",
    description: scrape?.description || "",
    product_url: scrape?.url || "",
    url: scrape?.url || "",
    product_image: images[0] || "",
  };
  for (let i = 1; i <= 10; i++) {
    // fall back to the last available image so an amp-img src is never empty
    values[`product_image_${i}`] = images[i - 1] || lastImage;
  }

  const used = new Set();
  const html = template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (match, tokenRaw) => {
    const token = tokenRaw.toLowerCase();
    if (!(token in values)) return match; // leave unknown tokens untouched
    used.add(token);
    return esc(values[token]);
  });

  // Warn on product tokens that were present but resolved empty.
  const warnings = [];
  const warnIf = (aliases, label) => {
    const present = aliases.some((a) => used.has(a));
    const empty = aliases.every((a) => !values[a]);
    if (present && empty) warnings.push(`No ${label} found on the page — those tokens were left blank.`);
  };
  warnIf(["product_title", "title"], "product title");
  warnIf(["product_price", "price"], "price");
  warnIf(["product_currency", "currency"], "currency");
  warnIf(["product_description", "description"], "description");
  const usedAnyImage = [...used].some((t) => t === "product_image" || /^product_image_\d+$/.test(t));
  if (usedAnyImage && images.length === 0) warnings.push("No product images found on the page.");

  return { html, warnings, tokensUsed: [...used] };
}
