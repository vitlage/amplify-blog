// Display helpers shared by the blog index, category pages and article page.

const CATEGORY_LABELS = {
  marketing: 'AI Marketing',
  amp: 'AMP',
  email: 'Email',
  product: 'Product',
  'ai-marketing': 'AI Marketing',
  'amp-email': 'AMP Email',
  technology: 'Technology',
  d2c: 'D2C',
  ai: 'AI',
};

export const categoryLabel = (slug) =>
  CATEGORY_LABELS[slug] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '');

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso.substring(0, 10)}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const plainText = (html) =>
  (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// ~230 words per minute, never less than 1 minute.
export const readTime = (html) =>
  Math.max(1, Math.round(plainText(html).split(' ').length / 230));

// First real paragraph of the post: the intro section if there is one,
// otherwise the first <p> that isn't the "date · Written by" byline.
export const excerpt = (html, max = 180) => {
  if (!html) return '';
  const intro = html.match(/<section id="introduction">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  let text = intro ? plainText(intro[1]) : '';
  if (!text) {
    const body = html.replace(/<header>[\s\S]*?<\/header>/, '').replace(/<nav>[\s\S]*?<\/nav>/, '');
    const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => plainText(m[1]));
    text = paras.find((p) => p && !/Written by/i.test(p)) || '';
  }
  if (text.length <= max) return text;
  return `${text.substring(0, text.lastIndexOf(' ', max))}…`;
};

const slugify = (s) =>
  plainText(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Prepare a post body for the article layout: drop the in-body byline and
// "Table of Contents" block (the page header and sidebar show those now) and
// give every <h2> an id so the sidebar TOC can link to it.
export const prepareArticle = (html) => {
  let body = (html || '')
    .replace(/<header>[\s\S]*?<\/header>/, '')
    .replace(/<nav>\s*<h2>Table of Contents<\/h2>[\s\S]*?<\/nav>/, '');

  const toc = [];
  const used = new Set();
  body = body.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (match, attrs, inner) => {
    const existing = attrs.match(/\sid="([^"]+)"/);
    let id = existing ? existing[1] : slugify(inner);
    if (!existing) {
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
    }
    used.add(id);
    toc.push({ id, text: plainText(inner) });
    return existing ? match : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });

  return { body, toc };
};
