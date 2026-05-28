# Pricing page subscriber slider — design

**Date:** 2026-05-28
**Owner:** Vitalii Hladkyi
**Branch context:** `front-end-updates-22.01.2026`

## Goal

Add a tier-selector slider above the three plan cards on `/pricing` that lets a visitor pick their email-list size and updates the PRO card's price, credits, and CTA accordingly. Visual structure mirrors the zeely.ai slider (centered value label, 5 tick marks, labels under each tick, large rounded CTA). Pricing logic mirrors zaymo.com/pricing.

## Non-goals

- No backend, no persistence, no analytics events on slider change (slider is presentational; existing analytics on the PRO CTA stay as-is).
- No changes to the Beginner ($0) or Enterprise (Contact Us) cards' content.
- No new UI library. No MUI. Native `<input type="range">` styled with CSS.
- No changes to the spotlight section below the cards.

## Visual approach

The reference design uses zeely.ai's green-on-white palette, but the existing pricing page uses brand blue `#4a5fd9` on the theme system (`var(--bg)`, `var(--textColor)`, `var(--softTextColor)`), 24px rounded cards, DM Sans, and a hover spotlight overlay. The slider adopts:

- **Structure** from zeely: big centered value label, 5 evenly-spaced tick marks, labels under each tick, large rounded CTA below.
- **Chrome** from this site: blue `#4a5fd9` track/thumb/CTA, 24px rounded container reusing the `pricingCard` look (border, hover spotlight, dark-theme support).

The slider section sits in its own card-styled container directly above the existing `.pricingCards` grid.

## Files

**New:**

- `src/components/pricingSlider/PricingSlider.jsx` — client component, owns `tierIndex` state, renders slider UI, calls `onTierChange(tier)` on every change.
- `src/components/pricingSlider/PricingSlider.module.css` — slider visuals (range input, marks, value label, container).

**Modified:**

- `src/app/pricing/page.jsx` — import the slider, hold `tierIndex` in state at the page level, render `<PricingSlider />` above `.pricingCards`, derive the PRO card's displayed price/credits/CTA from `tiers[tierIndex]`.

## Component contract

```
PricingSlider({
  tiers,               // array of tier objects (see below)
  defaultIndex = 1,    // initial selected index
  onTierChange,        // (tier, index) => void
  headline = "How big is your email list?",
  subtext  = "We'll match you to the right PRO tier",
})
```

- Internal state: `tierIndex` (number, 0..tiers.length-1).
- On `<input type="range">` `onChange`, update internal state and call `onTierChange(tiers[next], next)`.
- Keyboard support comes free from native range input (arrow keys, Home/End, PageUp/PageDown).
- ARIA: `aria-label="Email list size"`, `aria-valuetext` set to current tier label so screen readers announce "5k-15k" instead of "1".

## Tier data (source of truth lives in `PricingSlider.jsx`)

```js
const TIERS = [
  { label: '0-5k',     proPrice: '$29',  credits: '2,500 credits',  contact: false },
  { label: '5k-15k',   proPrice: '$59',  credits: '7,500 credits',  contact: false },
  { label: '15k-50k',  proPrice: '$99',  credits: '25,000 credits', contact: false },
  { label: '50k-100k', proPrice: '$199', credits: '75,000 credits', contact: false },
  { label: '100k+',    proPrice: 'Contact', credits: 'Custom volume', contact: true  },
];
```

Default selected index: `1` (5k-15k / $59) — matches the second-tick default in the zeely reference.

## PRO card binding

The PRO card today renders a static `$35` / `2,500 credits` / `Get Started` link. After this change:

| Field        | When `tier.contact === false`         | When `tier.contact === true`                                            |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------- |
| `.price`     | `tier.proPrice` (e.g. `$59`)          | `Contact Us` (rendered with `.contactUs` styling, no `/month` suffix)   |
| `.period`    | `/month` (hidden when contact mode)   | hidden                                                                  |
| `.priceSubtext` | `tier.credits` (e.g. `7,500 credits`) | `Custom volume`                                                         |
| CTA          | `<a href="https://app.convertic.ai/users/register">Get Started</a>` | `<button onClick={() => handleDemoRequest('Contact Sales - PRO')}>Contact Sales</button>` |

The Beginner and Enterprise cards do not react to the slider.

## Interaction & data flow

```
PricingSlider (internal: tierIndex)
   │ onTierChange(tier, index)
   ▼
PricingPage (state: tierIndex)
   │ derives tiers[tierIndex]
   ▼
PRO card reads { proPrice, credits, contact } and re-renders
```

- Slider state is **lifted to the page** so the PRO card and the slider can stay in sync if either ever needs to mutate the tier (today only the slider does, but the lift costs nothing and avoids a refactor later).
- Re-render is local to the PRO card — Beginner/Enterprise are static.

## Styling

`PricingSlider.module.css`:

- `.section` — `var(--bg)`, `1px solid #e0e0e0`, `border-radius: 24px`, `padding: 40px`, reuses the spotlight hover overlay pattern from `pricingCard` for visual consistency. Dark theme: `border-color: #1f273a` via `:global(.dark) .section`.
- `.headline` — DM Sans, weight 300, 32px (24px on mobile), `var(--textColor)`.
- `.subtext` — 16px, `var(--softTextColor)`, margin-bottom 32px.
- `.valueLabel` — 40px, weight 400, `var(--textColor)`, centered, margin-bottom 24px. Shows current `tier.label`.
- `.track` — full-width 6px-tall rail, background `#e8ebff` (light) / `rgba(74,95,217,0.15)` (dark), with a filled portion `background: #4a5fd9` from 0 to `(tierIndex / 4) * 100%`.
- `.thumb` — 28px circle, `background: var(--bg)`, `border: 3px solid #4a5fd9`, `box-shadow: 0 2px 8px rgba(74,95,217,0.3)`, positioned via the native range input.
- `.marks` — 5 small dots positioned at 0/25/50/75/100% on the track; marks at or before the thumb use brand blue, marks after use a lighter `#c8cffa`.
- `.markLabels` — flex row under the track, 5 labels (`0-5k`, `5k-15k`, ...), `var(--softTextColor)`, 14px.
- Range input itself is `position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;` over the track so native keyboard/mouse interaction works without exposing browser-default thumb chrome.

Mobile (<768px): reduce section padding to 24px, headline to 24px, value label to 32px. Marks and labels remain at 5 columns; labels wrap to 12px if needed.

## Edge cases

- **First paint flicker on PRO card.** Page renders with `defaultIndex = 1` so the PRO card shows `$59 / 7,500 credits` on first paint — never the old `$35 / 2,500 credits` from current code. No flicker.
- **Contact tier CTA conflict.** When tier is `100k+`, the existing PRO `Popular` badge stays visible and the CTA becomes "Contact Sales" routed through the same `handleDemoRequest` helper already in `page.jsx`. The Enterprise card's "Contact Sales" is unchanged.
- **No JS / SSR.** This page is already `'use client'`, so the slider is a no-op concern. Initial server-rendered HTML reflects `defaultIndex = 1`.
- **Dark theme.** All colors flow through `var(--bg)`, `var(--textColor)`, `var(--softTextColor)`, plus an explicit `:global(.dark) .section` rule for the border. Brand blue stays constant in both themes (matches existing CTAs).

## Testing / verification

This project has no unit test setup for components. Verification is manual via `npm run dev` on `/pricing`:

1. Page loads with slider showing `5k-15k`, PRO card showing `$59 / 7,500 credits`.
2. Dragging the slider left to `0-5k` updates PRO to `$29 / 2,500 credits`.
3. Dragging to `100k+` swaps PRO price for `Contact Us`, hides `/month`, swaps CTA to "Contact Sales" which opens the Convertic popup.
4. Keyboard: Tab to slider, arrow keys advance through all 5 tiers.
5. Resize to <768px — slider remains usable, labels visible, no overflow.
6. Toggle dark theme — section border, text colors, and track background adapt; brand blue stays.

## Out of scope (deferred)

- Tracking slider interaction in analytics (could add `analytics.track('Pricing tier selected', { tier })` on change later if needed — not in this iteration).
- Animating the filled track width / thumb position (CSS transition is enough; no spring/easing libraries).
- Persisting the tier selection in URL params or localStorage.
- Adjusting the Enterprise card to also reflect tier (Enterprise stays Contact Us in all tiers per the section above).
