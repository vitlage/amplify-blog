# Blog guide: How to apply for AMP whitelisting from Gmail and Yahoo

Date: 2026-05-07
Status: approved for implementation
Reference (structure inspiration only, not content): https://help.zaymo.com/articles/4381768920-applying-for-amp-approval-from-gmail

## Goal

Publish a new blog post that walks readers through applying to Google for AMP for Email sender whitelisting. The page must work for both Gmail and Yahoo (handled by the same form) and briefly note Mail.ru. Readers are mostly Convertic.ai customers but the guide should still be useful for senders on other ESPs.

## Where it lives

- Route: `/blog/posts/applying-for-amp-whitelisting-from-gmail-and-yahoo`
- Implementation: a new entry in the `STATIC_POSTS` array in `src/lib/staticData.js`
- Rendered by the existing `src/app/blog/posts/[slug]/page.jsx` and `src/app/blog/posts/[slug]/singlePage.module.css`. No code or layout changes to the blog post template.
- Category: `'amp'`
- `createdAt`: `2026-05-07`
- `img`: empty string (skip the hero image so the existing layout collapses the image container, matches sibling posts that omit it)

## SEO and metatags

The new post entry includes a `metatags` object with:

- `title`: "How to apply for AMP whitelisting from Gmail and Yahoo"
- `description`: a one-sentence summary under 160 characters describing what readers will learn and the typical 5 to 10 day timeframe
- `keywords`: comma-separated list including "AMP for Email whitelisting", "Gmail AMP approval", "Yahoo AMP whitelisting", "apply for AMP for email", "Convertic.ai", "interactive email"
- `author`: "Convertic AI Team"
- `ogTitle`, `ogDescription`, `ogType: 'article'`
- `twitterTitle`, `twitterDescription`, `twitterCard: 'summary_large_image'`
- `schema`: `@type: Article`, with headline, description, author (Organization Convertic.ai), publisher (Convertic.ai with logo), `datePublished` and `dateModified` set to `2026-05-07`, `mainEntityOfPage` set to the canonical URL

This matches the metatags shape already used by every entry in `STATIC_POSTS`.

## Content structure (approach B: Why -> How -> Troubleshoot)

The `desc` field stores a single semantic HTML string wrapped in `<article>`. Sections in order:

1. Intro paragraphs (no heading): what whitelisting is, the 5 to 10 business day timeframe, who needs to apply, one-line note that Convertic.ai handles applications for its customers when given the right access.
2. `<h2>` Why Gmail and Yahoo require whitelisting: 2 short paragraphs on the spam and phishing rationale, the per-sender-address scope, and that approval is permanent for that sender once granted.
3. `<h2>` Before you apply: prerequisites checklist using a checkmark list with at least these items:
   - You have an AMP-capable email built and validated.
   - You can send from a verified domain with SPF, DKIM, and DMARC passing.
   - You have access to your sending platform (Convertic.ai, Klaviyo, Mailchimp, or your ESP).
   - You can suppress test addresses from your normal sending lists.
   - You have a Gmail inbox to receive the test message and the approval reply.
4. `<h2>` Gmail whitelisting: step by step. 6 numbered step blocks. Each step contains step number, step title, one short paragraph, optional screenshot placeholder, and an optional Convertic.ai callout. The 6 steps:
   1. Confirm AMP support is on in your sending platform. Mention that Convertic.ai turns it on by default; for Klaviyo, request AMP template access from support; for Mailchimp and others, check their AMP enablement policy.
   2. Build a test list with three contacts: your own Gmail, `ampforemail.whitelisting@gmail.com`, `ampverification@yahoo.com`.
   3. Create and send a production-quality AMP test campaign. The subject line and content must look like a real send.
   4. Suppress the two test addresses from regular campaigns so they only receive the test message.
   5. Submit the official Google AMP for Email registration form (linked). Walk through the fields: sender email, approved domain, use cases, sample-email field, Yahoo questions, Gmail questions. Note explicitly that the Mail.ru section can be skipped for most senders.
   6. Wait for confirmation from `noreply@google.com`, typically 5 to 10 business days.
5. `<h2>` Yahoo whitelisting: one paragraph clarifying that the same Google form covers Yahoo, plus a short list of the Yahoo-specific fields to expect.
6. `<h2>` Mail.ru note: a 3-line note that Mail.ru's AMP program is region-specific and that most senders should skip that part of the form.
7. `<h2>` How to confirm you've been approved: short bullets covering the lightning-bolt icon in Gmail, the noreply@google.com reply, and successful AMP rendering without developer settings.
8. `<h2>` Previewing AMP before approval: one paragraph plus a 3-step list for enabling Gmail Settings -> General -> Dynamic email -> Developer settings, used by developers to render AMP from a not-yet-approved sender during testing.
9. `<h2>` Troubleshooting and FAQ: 5 to 6 `<h3>` + `<p>` pairs:
   - What happens if I send AMP before I'm approved?
   - I haven't heard back after 10 days, what now?
   - Do I need to re-apply if I switch ESPs?
   - Can multiple sender addresses share one approval?
   - Does whitelisting expire?
   - Is the process the same for Yahoo?
10. Closing paragraph (no heading): pointer to Convertic.ai's onboarding which handles the application and validates AMP templates before sending. Includes one anchor link to the registration page.

The total target length is 1,400 to 1,800 words.

## Visual styling inside desc HTML

No new CSS files or module edits. All styling is inline `style="..."` attributes or reuses classes from `singlePage.module.css` where they help.

Reusable inline blocks:

- Numbered step card. Light grey background, rounded corners (8 to 12 px radius), padding 20 to 24 px. A colored circle (~36 px, brand pink `#ED5370` background or brand blue `#4a5fd9`) on the left holds the step number; title and body sit to the right.
- Screenshot placeholder. A 16:9 grey block with a centered short caption like "Screenshot: Klaviyo template editor showing AMP toggle." Carries a stable class such as `screenshot-placeholder` plus a `data-screenshot-id="step-1-klaviyo-amp-toggle"` so swapping in real images later is a find-and-replace.
- Callout note. A box with a 4 px left border. Two variants: "Convertic.ai tip" using brand pink/blue, "Heads up" using a warm yellow tone. Each starts with a small bold label and one or two sentences.
- Checklist. Reuses the existing inline checkmark SVG used in `src/app/use-cases/page.jsx` (small pink check). Each item is a flex row with the SVG and the text.
- FAQ. Plain `<h3>` followed by `<p>`. No accordion. Adding interactivity would require a component change to `src/app/blog/posts/[slug]/page.jsx` or a new client component, neither of which is in scope.

All of the above are written directly in the `desc` HTML string, so they survive `dangerouslySetInnerHTML` rendering.

## Writing style guardrails

These rules govern the prose written into `desc`:

1. Only regular hyphens (`-`). No em-dashes (`—`) and no en-dashes (`–`). When a sentence wants a dash for emphasis, restructure with commas, a colon, or split into two sentences.
2. The text must not sound AI-generated. Avoid the following patterns:
   - Openers: "Imagine...", "In today's fast-paced world...", "Picture this..."
   - Filler verbs as branding: "unlock", "harness", "leverage", "supercharge", "delve", "dive into"
   - Hedge or summary transitions: "Moreover", "Furthermore", "It's worth noting", "In conclusion", "Ultimately"
   - Parallelism stacks: "not just X, but Y", "X is more than just Y"
   - Generic SaaS adjectives: "seamless", "robust", "powerful", "cutting-edge"
3. Use specific facts: real addresses (`ampforemail.whitelisting@gmail.com`, `ampverification@yahoo.com`, `noreply@google.com`), real timeframes (5 to 10 business days), real form field names. Vary sentence length. Active voice. Direct verbs.

The author of this content is Convertic.ai. Tone is practical and unfussy, the way a senior deliverability lead would write internal docs for a customer. Writing assumes the reader has built and sent emails before but may not have applied for AMP whitelisting.

## ESP framing

Default voice is Convertic.ai-first. The guide describes the flow as Convertic.ai users would experience it (we handle the application, you forward access). Where ESP differences matter, secondary mentions cover Klaviyo and Mailchimp. The guide does not assume the reader is on Klaviyo (the Zaymo article does).

## Imagery

All screenshots are placeholder blocks at first publish. Each placeholder includes:

- A stable class `screenshot-placeholder`
- A `data-screenshot-id` attribute naming the screenshot (so a future find-and-replace can swap in real images)
- A short caption describing what the image should show

There are screenshot slots after step 2 (test list with three contacts), step 3 (test campaign editor), step 5 (Google form sections, three slots), step 7 (lightning-bolt icon in Gmail), and step 8 (Gmail dynamic email developer settings panel).

## What is NOT in scope

- No accordion or other interactive FAQ component.
- No new component files.
- No edits to `singlePage.module.css` or any other module CSS.
- No edits to `Featured`, `CardList`, `CategoryList`, or `Menu` components. The new post will appear automatically because they read from `STATIC_POSTS`.
- No edits to `sitemap.js` (currently disabled per file extension `.disabled`).
- No real screenshots. Those are dropped in later by the user.
- No new translations or alt-language variants.

## Acceptance criteria

The post is considered done when:

1. A new entry exists in `src/lib/staticData.js` with all fields populated (`_id`, `title`, `metatags`, `desc`, `catSlug`, `slug`, `img`, `createdAt`).
2. `npm run build` and `npm run dev` complete without new errors related to this post.
3. Visiting `/blog/posts/applying-for-amp-whitelisting-from-gmail-and-yahoo` renders the article using the existing single-page layout.
4. The post appears in the blog index card list and is reachable from `/blog`.
5. SEO metadata renders correctly (title tag, meta description, OpenGraph, Twitter, JSON-LD).
6. The `desc` HTML contains no em-dashes (`—`) or en-dashes (`–`). Validation: a grep against the new entry returns zero hits for those characters.
7. The prose passes a manual read-through against the AI-cliché list in the writing style section.

## Risks and mitigations

- Risk: writing accidentally sounds AI-generated. Mitigation: re-read with the cliché list in hand before commit. Strip generic adjectives. Insert real numbers and named entities.
- Risk: copyright similarity to the Zaymo article. Mitigation: only the section ordering is inspired by Zaymo, and we deliberately diverge with a "Why -> How -> Troubleshoot" structure (B). All prose, examples, and callouts are original.
- Risk: stale information about the Google form. Mitigation: the guide describes the form by section names and field intent, not by exact UI text, so it survives small Google UI revisions. The form URL is referenced once with the note that Google occasionally moves the link.

## Out of scope follow-ups

- Real screenshots replacing placeholders.
- An accordion FAQ across the blog (component-level change).
- Internationalization.
- Auto-generated table of contents at the top of the article.
