import fs from "fs";
import path from "path";

// The interactive AMP demo emails shown in the lead landing page inbox. HTML lives
// in /public/amp-templates. Server-only (reads the filesystem) — do not import from
// a client component; pass the result down as props instead.
export const DEMO_EMAILS = [
  {
    key: "abandoned-cart-recovery",
    label: "Abandoned cart",
    sender: "Your store",
    subject: "You left something in your cart 🛒",
    snippet: "Finish checkout right here — no need to leave your inbox.",
  },
  {
    key: "upsell",
    label: "Upsell",
    sender: "Your store",
    subject: "You might also like these ✨",
    snippet: "Handpicked to pair with your order. Add in one tap.",
  },
  {
    key: "subscription",
    label: "Subscription",
    sender: "Your store",
    subject: "Subscribe & save 20%",
    snippet: "Pick your delivery cadence right inside this email.",
  },
];

export const DEMO_EMAIL_KEYS = DEMO_EMAILS.map((e) => e.key);

// Read one template's HTML from /public/amp-templates. Returns "" if unknown/missing.
export function readDemoEmailHtml(key) {
  if (!DEMO_EMAIL_KEYS.includes(key)) return "";
  const file = path.join(
    process.cwd(),
    "public",
    "amp-templates",
    `${key}.html`
  );
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

// Full list with HTML bundled, for handing to the landing page.
export function readDemoEmails() {
  return DEMO_EMAILS.map((e) => ({ ...e, html: readDemoEmailHtml(e.key) }));
}
