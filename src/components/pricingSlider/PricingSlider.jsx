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
