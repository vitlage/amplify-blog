// Generates aurora-gradient title images (one per blog post) with the post
// title rendered on top, via headless Chrome. Run: node scripts/generate-blog-covers.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'blog-covers');
const TMP_DIR = join(os.tmpdir(), 'blog-covers-html');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const CAT_LABELS = {
  amp: 'AMP',
  email: 'Email',
  marketing: 'AI Marketing',
  product: 'Product',
};

// Source of truth: keep in sync with src/lib/staticData.js
const POSTS = [
  { slug: 'applying-for-amp-whitelisting-from-gmail-and-yahoo', cat: 'amp', title: 'How to apply for AMP whitelisting from Gmail and Yahoo' },
  { slug: 'ai-delivers-website-with-amp-emails', cat: 'amp', title: 'AI Can Deliver Your Website Directly to Your Customers with AMP Emails' },
  { slug: 'learn-how-to-achieve-cac-equals-zero', cat: 'email', title: 'How to Make CAC = 0 with AMP Emails and Existing Customers' },
  { slug: 'aarrr-framework-for-e-commerce-and-how-amp-emails-accelerate-it', cat: 'marketing', title: 'AARRR Framework for E-Commerce and How AMP Emails Accelerate It' },
  { slug: 'how-to-build-a-loyalty-program-with-amp-emails', cat: 'marketing', title: 'How to Build a Loyalty Program with AMP Emails' },
  { slug: 'how-amp-emails-can-help', cat: 'product', title: 'Why a Flower Shop Seller Knows the Customer Better Than an Email Marketer' },
];

const titleSize = (t) => {
  const n = t.length;
  if (n <= 38) return 70;
  if (n <= 60) return 58;
  if (n <= 90) return 48;
  return 40;
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const html = ({ title, cat }) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #000;
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  .frame {
    position: absolute; inset: 14px;
    border-radius: 28px; overflow: hidden;
    /* Aurora: bright lavender glow at top-center fading to black */
    background:
      radial-gradient(135% 100% at 50% -18%,
        #c9b3ff 0%,
        #9a6cff 14%,
        #7c3aed 26%,
        #561fb0 38%,
        #2e1065 52%,
        #160a32 66%,
        #050208 84%,
        #000 100%);
  }
  /* subtle film grain to match the reference */
  .grain {
    position: absolute; inset: 0; opacity: 0.07; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  .content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 0 110px; gap: 26px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .dot { width: 18px; height: 18px; border-radius: 999px; background: #fff; box-shadow: 0 0 18px rgba(255,255,255,0.55); }
  .brand span { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; }
  .title {
    font-size: ${titleSize(title)}px; font-weight: 500; line-height: 1.12;
    letter-spacing: -0.02em; max-width: 980px; text-wrap: balance;
    text-shadow: 0 2px 30px rgba(0,0,0,0.35);
  }
  .cat {
    font-size: 15px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
</style></head>
<body>
  <div class="frame"></div>
  <div class="grain"></div>
  <div class="content">
    <div class="brand"><span class="dot"></span><span>Convertic</span></div>
    <div class="title">${esc(title)}</div>
    <div class="cat">${esc(CAT_LABELS[cat] || cat)}</div>
  </div>
</body></html>`;

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

for (const post of POSTS) {
  const htmlPath = join(TMP_DIR, `${post.slug}.html`);
  const outPath = join(OUT_DIR, `${post.slug}.png`);
  writeFileSync(htmlPath, html(post));
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--default-background-color=00000000',
    '--window-size=1200,630',
    '--virtual-time-budget=2500',
    `--screenshot=${outPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  console.log(`✓ ${post.slug}.png`);
}

rmSync(TMP_DIR, { recursive: true, force: true });
console.log(`\nDone. ${POSTS.length} covers written to public/blog-covers/`);
