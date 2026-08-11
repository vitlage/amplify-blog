# Pricing page subscriber slider — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5-tier subscriber-size slider above the existing 3 pricing cards on `/pricing` that updates the PRO card's price, credits, and CTA based on the selected tier.

**Architecture:** A new client component (`PricingSlider`) owns the tier index in internal state and emits `onTierChange(tier, index)`. The pricing page lifts the same tier index into its own state, derives the PRO card's price/credits/CTA from `tiers[tierIndex]`, and re-renders the PRO card on change. Beginner and Enterprise cards are unaffected. No new dependencies — native `<input type="range">` styled via CSS modules.

**Tech Stack:** Next.js (App Router) `'use client'` component, React `useState`, CSS Modules. No MUI, no test runner (project has none) — verification is manual via `npm run dev`.

**Spec:** `docs/superpowers/specs/2026-05-28-pricing-subscriber-slider-design.md`

---

## File structure

| File                                                         | Action | Responsibility                                                                |
| ------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------- |
| `src/components/pricingSlider/PricingSlider.jsx`             | Create | Render slider UI (headline, value label, range input, marks, tick labels). Owns `tierIndex` state, exports `TIERS` data, fires `onTierChange`. |
| `src/components/pricingSlider/PricingSlider.module.css`      | Create | All slider visuals: section card, headline, value label, custom-styled range input, mark dots, tick labels, dark-theme + mobile rules. |
| `src/app/pricing/page.jsx`                                   | Modify | Import `PricingSlider` and `TIERS`. Hold `tierIndex` at page level. Render slider above `.pricingCards`. Bind PRO card's `.price`, `.period`, `.priceSubtext`, and CTA to the active tier. |

---

## Task 1: Create the `PricingSlider` component shell with static markup

**Files:**
- Create: `src/components/pricingSlider/PricingSlider.jsx`
- Create: `src/components/pricingSlider/PricingSlider.module.css`

**Goal of this task:** Get the component file in place rendering the static layout (no interactivity yet) at the right visual fidelity. Mount it temporarily on the pricing page to eyeball it.

- [ ] **Step 1: Create the CSS module**

Write `src/components/pricingSlider/PricingSlider.module.css`:

```css
.section {
  background: var(--bg);
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.section:hover {
  border-color: #4a5fd9;
}

.headline {
  font-size: 32px;
  font-weight: 300;
  color: var(--textColor);
  font-family: 'DM Sans', sans-serif;
  margin: 0 0 8px 0;
  text-align: center;
}

.subtext {
  font-size: 16px;
  color: var(--softTextColor);
  text-align: center;
  margin: 0 0 32px 0;
}

.valueLabel {
  font-size: 40px;
  font-weight: 400;
  color: var(--textColor);
  text-align: center;
  margin-bottom: 24px;
  font-family: 'DM Sans', sans-serif;
}

.sliderWrap {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 14px 0 8px;
}

.track {
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: #e8ebff;
}

.trackFill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px;
  background: #4a5fd9;
  transition: width 0.2s ease;
}

.mark {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8cffa;
  transform: translate(-50%, -50%);
  transition: background 0.2s ease;
}

.markActive {
  background: #4a5fd9;
}

.thumb {
  position: absolute;
  top: 50%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg);
  border: 3px solid #4a5fd9;
  box-shadow: 0 2px 8px rgba(74, 95, 217, 0.3);
  transform: translate(-50%, -50%);
  transition: left 0.2s ease;
  pointer-events: none;
}

.rangeInput {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

.rangeInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 32px;
  height: 32px;
  background: transparent;
  cursor: pointer;
}

.rangeInput::-moz-range-thumb {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.markLabels {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.markLabel {
  font-size: 14px;
  color: var(--softTextColor);
  flex: 1;
  text-align: center;
}

.markLabel:first-child {
  text-align: left;
}

.markLabel:last-child {
  text-align: right;
}

@media screen and (max-width: 768px) {
  .section {
    padding: 24px;
  }

  .headline {
    font-size: 24px;
  }

  .valueLabel {
    font-size: 32px;
  }

  .markLabel {
    font-size: 12px;
  }
}

:global(.dark) .section {
  border-color: #1f273a;
}

:global(.dark) .track {
  background: rgba(74, 95, 217, 0.15);
}

:global(.dark) .mark {
  background: rgba(74, 95, 217, 0.35);
}

:global(.dark) .markActive {
  background: #4a5fd9;
}
```

- [ ] **Step 2: Create the component file (static, no state yet)**

Write `src/components/pricingSlider/PricingSlider.jsx`:

```jsx
'use client';
import React from 'react';
import styles from './PricingSlider.module.css';

export const TIERS = [
  { label: '0-5k',     proPrice: '$29',     credits: '2,500 credits',   contact: false },
  { label: '5k-15k',   proPrice: '$59',     credits: '7,500 credits',   contact: false },
  { label: '15k-50k',  proPrice: '$99',     credits: '25,000 credits',  contact: false },
  { label: '50k-100k', proPrice: '$199',    credits: '75,000 credits',  contact: false },
  { label: '100k+',    proPrice: 'Contact', credits: 'Custom volume',   contact: true  },
];

export default function PricingSlider({
  tiers = TIERS,
  defaultIndex = 1,
  onTierChange,
  headline = 'How big is your email list?',
  subtext = "We'll match you to the right PRO tier",
}) {
  const tierIndex = defaultIndex;
  const max = tiers.length - 1;
  const percent = (tierIndex / max) * 100;
  const current = tiers[tierIndex];

  return (
    <div className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <p className={styles.subtext}>{subtext}</p>
      <div className={styles.valueLabel}>{current.label}</div>

      <div className={styles.sliderWrap}>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: `${percent}%` }} />
          {tiers.map((_, i) => (
            <span
              key={i}
              className={`${styles.mark} ${i <= tierIndex ? styles.markActive : ''}`}
              style={{ left: `${(i / max) * 100}%` }}
            />
          ))}
          <span className={styles.thumb} style={{ left: `${percent}%` }} />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={tierIndex}
          readOnly
          className={styles.rangeInput}
          aria-label="Email list size"
          aria-valuetext={current.label}
        />
      </div>

      <div className={styles.markLabels}>
        {tiers.map((t) => (
          <span key={t.label} className={styles.markLabel}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}
```

Note: `onTierChange` is in the props but not yet wired — Task 2 adds state and calls it. `readOnly` on the input avoids React warnings about value-without-onChange in this intermediate state.

- [ ] **Step 3: Temporarily mount the component on the pricing page to eyeball it**

Open `src/app/pricing/page.jsx`. At the top of the imports (after the `styles` import line `import styles from './pricing.module.css';`), add:

```jsx
import PricingSlider from '@/components/pricingSlider/PricingSlider';
```

In the JSX, find the line:

```jsx
<div className={styles.pricingCards}>
```

Directly above it (so right after the closing `</div>` of `.pricingHeader`), insert:

```jsx
<PricingSlider />
```

- [ ] **Step 4: Run the dev server and visually verify**

Run: `npm run dev`

Open: `http://localhost:3000/pricing`

Expected:
- A new card-styled section appears above the 3 plan cards.
- Headline reads "How big is your email list?", subtext below it.
- Big "5k-15k" label centered below the subtext.
- Horizontal track with 5 dots, the leftmost two filled blue, the rightmost three light grey-blue.
- A blue-bordered circular thumb sits on the second dot.
- 5 labels (`0-5k`, `5k-15k`, `15k-50k`, `50k-100k`, `100k+`) spread evenly below the track.
- Dragging the thumb does nothing yet (state isn't wired). That's expected.

- [ ] **Step 5: Commit**

```bash
git add src/components/pricingSlider/PricingSlider.jsx src/components/pricingSlider/PricingSlider.module.css src/app/pricing/page.jsx
git commit -m "feat: add static PricingSlider component to pricing page"
```

---

## Task 2: Make the slider interactive (internal state + onChange)

**Files:**
- Modify: `src/components/pricingSlider/PricingSlider.jsx`

**Goal of this task:** Hook up `useState` so dragging the slider updates the value label, the track fill, the active marks, and the thumb position. Fire `onTierChange` so the parent will receive updates in Task 3.

- [ ] **Step 1: Replace the component body with the stateful version**

Replace the entire `export default function PricingSlider({ ... })` block in `src/components/pricingSlider/PricingSlider.jsx` with:

```jsx
export default function PricingSlider({
  tiers = TIERS,
  defaultIndex = 1,
  onTierChange,
  headline = 'How big is your email list?',
  subtext = "We'll match you to the right PRO tier",
}) {
  const [tierIndex, setTierIndex] = React.useState(defaultIndex);
  const max = tiers.length - 1;
  const percent = (tierIndex / max) * 100;
  const current = tiers[tierIndex];

  const handleChange = (e) => {
    const next = Number(e.target.value);
    setTierIndex(next);
    if (onTierChange) onTierChange(tiers[next], next);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <p className={styles.subtext}>{subtext}</p>
      <div className={styles.valueLabel}>{current.label}</div>

      <div className={styles.sliderWrap}>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: `${percent}%` }} />
          {tiers.map((_, i) => (
            <span
              key={i}
              className={`${styles.mark} ${i <= tierIndex ? styles.markActive : ''}`}
              style={{ left: `${(i / max) * 100}%` }}
            />
          ))}
          <span className={styles.thumb} style={{ left: `${percent}%` }} />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={tierIndex}
          onChange={handleChange}
          className={styles.rangeInput}
          aria-label="Email list size"
          aria-valuetext={current.label}
        />
      </div>

      <div className={styles.markLabels}>
        {tiers.map((t) => (
          <span key={t.label} className={styles.markLabel}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}
```

Changes vs. Task 1:
- Added `useState` for `tierIndex`.
- Added `handleChange` that updates state and calls `onTierChange`.
- Removed `readOnly`, added real `onChange`.

- [ ] **Step 2: Verify in the browser**

If the dev server isn't already running, run: `npm run dev`

Open: `http://localhost:3000/pricing`

Test:
- Click+drag the thumb. Value label, fill, active marks, and thumb position all update smoothly.
- Click anywhere on the track. Thumb jumps to nearest tier.
- Tab into the slider, press Right Arrow / Left Arrow. Tier advances/retreats by 1.
- Press Home / End. Jumps to first / last tier.

- [ ] **Step 3: Commit**

```bash
git add src/components/pricingSlider/PricingSlider.jsx
git commit -m "feat: make PricingSlider interactive with internal tier state"
```

---

## Task 3: Bind the PRO card to the active tier

**Files:**
- Modify: `src/app/pricing/page.jsx`

**Goal of this task:** Lift the tier index into the page, derive the PRO card's price/credits/CTA from it, and replace the static `$35` / `2,500 credits` / `Get Started` link with the dynamic version that also handles the `Contact` tier.

- [ ] **Step 1: Add tier state import and state hook**

In `src/app/pricing/page.jsx`, update the existing imports at the top of the file.

Change:

```jsx
import React, { useEffect } from 'react';
```

to:

```jsx
import React, { useEffect, useState } from 'react';
```

Change:

```jsx
import PricingSlider from '@/components/pricingSlider/PricingSlider';
```

to:

```jsx
import PricingSlider, { TIERS } from '@/components/pricingSlider/PricingSlider';
```

- [ ] **Step 2: Add tier state and derived value inside the component**

Inside `export default function PricingPage()`, immediately after the opening brace (before the first `useEffect`), add:

```jsx
  const [tierIndex, setTierIndex] = useState(1);
  const proTier = TIERS[tierIndex];
```

- [ ] **Step 3: Wire the slider to update tier state**

Replace the existing `<PricingSlider />` line with:

```jsx
<PricingSlider
  defaultIndex={tierIndex}
  onTierChange={(_tier, index) => setTierIndex(index)}
/>
```

- [ ] **Step 4: Replace the PRO card's price block**

In the PRO card (the `<div className={`${styles.pricingCard} ${styles.popular}`}>` block), find:

```jsx
<div className={styles.cardPrice}>
  <span className={styles.price}>$35</span>
  <span className={styles.period}>/month</span>
</div>
<p className={styles.priceSubtext}>2,500 credits</p>
```

Replace with:

```jsx
<div className={styles.cardPrice}>
  {proTier.contact ? (
    <h2 className={styles.contactUs}>Contact Us</h2>
  ) : (
    <>
      <span className={styles.price}>{proTier.proPrice}</span>
      <span className={styles.period}>/month</span>
    </>
  )}
</div>
<p className={styles.priceSubtext}>{proTier.credits}</p>
```

- [ ] **Step 5: Replace the PRO card's CTA**

In the same PRO card, find:

```jsx
<div className={styles.buttonWrapper}>
  <a href="https://app.convertic.ai/users/register" className={styles.ctaButton}>Get Started</a>
</div>
```

Replace with:

```jsx
<div className={styles.buttonWrapper}>
  {proTier.contact ? (
    <button onClick={() => handleDemoRequest('Contact Sales - PRO')} className={styles.ctaButton}>Contact Sales</button>
  ) : (
    <a href="https://app.convertic.ai/users/register" className={styles.ctaButton}>Get Started</a>
  )}
</div>
```

- [ ] **Step 6: Verify in the browser**

If the dev server isn't running, run: `npm run dev`

Open: `http://localhost:3000/pricing`

Test the full matrix:

| Slider position | PRO card price | PRO subtext        | PRO CTA            |
| --------------- | -------------- | ------------------ | ------------------ |
| 0-5k            | $29 /month     | 2,500 credits      | Get Started (link) |
| 5k-15k (default)| $59 /month     | 7,500 credits      | Get Started (link) |
| 15k-50k         | $99 /month     | 25,000 credits     | Get Started (link) |
| 50k-100k        | $199 /month    | 75,000 credits     | Get Started (link) |
| 100k+           | Contact Us     | Custom volume      | Contact Sales (button — clicking opens the Convertic popup) |

Also verify:
- Beginner card still shows `$0 /month` and `Get Started`.
- Enterprise card still shows `Contact Us` and `Contact Sales` (unchanged).
- The `Popular` badge stays on the PRO card in all tiers.

- [ ] **Step 7: Commit**

```bash
git add src/app/pricing/page.jsx
git commit -m "feat: bind pricing PRO card to slider-selected tier"
```

---

## Task 4: Mobile + dark-theme verification pass

**Files:** None modified unless issues are found.

**Goal of this task:** Catch any visual regressions before considering this done. The CSS already includes mobile and dark-theme rules; this task confirms they actually work and patches anything broken.

- [ ] **Step 1: Test at 375px width (iPhone SE)**

In the browser dev tools, toggle device toolbar and set width to 375px.

Reload `http://localhost:3000/pricing` and check:
- Slider section padding tightens (24px instead of 40px).
- Headline drops to 24px, value label to 32px.
- All 5 tier labels remain visible, each at 12px.
- Track and thumb remain centered, not overflowing.
- Dragging still works with touch (use the dev-tools touch simulator or your phone).

- [ ] **Step 2: Test at 1440px width (desktop)**

Set width back to 1440px (or full window). Confirm:
- Slider section width matches the `.pricingCards` width below it (both capped by `max-width: 1400px` from `.pricingContainer`).
- Headline, subtext, value label, and tick labels all read cleanly with comfortable spacing.

- [ ] **Step 3: Toggle dark theme**

Use the existing dark-theme toggle (the site's `.dark` class — toggle via your usual site theme switcher, or in dev tools add `class="dark"` to `<html>`).

Confirm:
- Slider section border becomes `#1f273a` instead of `#e0e0e0`.
- Headline, value label, tick labels read against the dark background.
- Track background dims to `rgba(74, 95, 217, 0.15)`; inactive marks dim to `rgba(74, 95, 217, 0.35)`.
- Blue fill, active marks, and thumb border stay full brand blue.
- Toggle back to light. Everything restores.

- [ ] **Step 4: If any of the above looked wrong, patch the CSS**

If you needed to patch `PricingSlider.module.css`, commit:

```bash
git add src/components/pricingSlider/PricingSlider.module.css
git commit -m "fix: polish PricingSlider mobile/dark-theme styles"
```

If everything looked fine, skip the commit.

---

## Done criteria

- [ ] All 5 slider tiers shift the PRO card's price, period suffix, credits text, and CTA per the table in Task 3 Step 6.
- [ ] Beginner and Enterprise cards are visually unchanged from before this work.
- [ ] Slider keyboard-accessible (arrows, Home/End).
- [ ] Slider readable and usable at 375px width.
- [ ] Slider integrates visually in both light and dark themes.
- [ ] No new dependencies added to `package.json`.
- [ ] All 3 (or 4, if Task 4 needed a patch) commits land on `front-end-updates-22.01.2026`.
