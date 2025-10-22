'use client';
import React, { useEffect } from 'react';
import styles from './pricing.module.css';

export default function PricingPage() {
  const handleDemoRequest = (buttonName) => {
    if (window.analytics) {
      window.analytics.track('Demo/Contact requested', { button: buttonName, page: 'pricing' });
    }
    // Trigger Convertic popup
    if (window.ACX && window.ACX.openPopup) {
      window.ACX.openPopup();
    } else if (window.openAcellePopup) {
      window.openAcellePopup();
    } else {
      // Fallback: try to click the demo button or redirect
      const demoBtn = document.getElementById('request_demo_btn');
      if (demoBtn) {
        demoBtn.click();
      }
    }
  };

  useEffect(() => {
    const spotlightCards = document.querySelectorAll(`.${styles.spotlightCard}`);
    const pricingCards = document.querySelectorAll(`.${styles.pricingCard}`);
    const allCards = [...spotlightCards, ...pricingCards];

    allCards.forEach(card => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      };

      card.addEventListener('mousemove', handleMouseMove);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
      };
    });
  }, []);
  return (
    <div className={styles.pricingContainer}>
      <div className={styles.pricingHeader}>
        <h1 className={styles.pricingTitle}>Choose the Right Plan for <span className={styles.highlight}>Your Needs</span></h1>
      </div>

      <div className={styles.pricingCards}>
        {/* Standard Plan */}
        <div className={styles.pricingCard}>
          <div className={styles.pricingOverlay}></div>
          <div className={styles.pricingCardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>Beginner</h3>
            </div>
          <div className={styles.cardPrice}>
            <span className={styles.price}>$0</span>
            <span className={styles.period}>/month</span>
          </div>
          <p className={styles.priceSubtext}>No charge, ever</p>

          <ul className={styles.featureList}>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Full access to drag & drop editor
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Create and design unlimited AMP emails
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Launch marketing campaigns
            </li>
          </ul>

          <div className={styles.buttonWrapper}>
            <button className={styles.ctaButton}>Get Started</button>
          </div>
          </div>
        </div>

        {/* Professional Plan */}
        <div className={`${styles.pricingCard} ${styles.popular}`}>
          <div className={styles.pricingOverlay}></div>
          <div className={styles.pricingCardContent}>
            <div className={styles.popularBadge}>Popular</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>PRO</h3>
            </div>
          <div className={styles.cardPrice}>
            <span className={styles.price}>$35</span>
            <span className={styles.period}>/month</span>
          </div>
          <p className={styles.priceSubtext}>2,500 credits</p>

          <ul className={styles.featureList}>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Everything in Free, plus:
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              2,500 monthly credits for sending or AI-powered generation
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Vibe marketing generation with AI
            </li>
          </ul>

          <div className={styles.buttonWrapper}>
            <button className={styles.ctaButton}>Get Started</button>
          </div>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className={styles.pricingCard}>
          <div className={styles.pricingOverlay}></div>
          <div className={styles.pricingCardContent}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>Enterprise</h3>
            </div>
          <div className={styles.cardPrice}>
            <h2 className={styles.contactUs}>Contact Us</h2>
          </div>
          <p className={styles.priceSubtext}>For both in-house and law firm teams</p>

          <ul className={styles.featureList}>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Includes everything in Professional
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Multiple-user access to a common workspace
            </li>
            <li className={styles.feature}>
              <div className={styles.checkmark}></div>
              Member-specific access right controls
            </li>
          </ul>

          <div className={styles.buttonWrapper}>
            <button onClick={() => handleDemoRequest('Contact Sales')} className={styles.ctaButton}>Contact Sales</button>
          </div>
          </div>
        </div>
      </div>

      {/* Spotlight Cards Section */}
      <div className={styles.spotlightSection}>
        <div className={styles.spotlightCard}>
          <div className={styles.spotlightOverlay}></div>
          <div className={styles.spotlightContent}>
            <h3 className={styles.spotlightTitle}>Forward Deployed Engineer</h3>
            <p className={styles.spotlightDescription}>
              Get dedicated engineering support to integrate Convertic.ai seamlessly into your existing infrastructure.
              Our forward deployed engineers work directly with your team to ensure smooth implementation,
              custom integrations, and optimal performance for your email campaigns.
            </p>
            <div className={styles.spotlightButtonWrapper}>
              <button onClick={() => handleDemoRequest('Request Engineer')} className={styles.spotlightButton}>
                Request Engineer →
              </button>
            </div>
          </div>
        </div>

        <div className={styles.spotlightCard}>
          <div className={styles.spotlightOverlay}></div>
          <div className={styles.spotlightContent}>
            <h3 className={styles.spotlightTitle}>Proof of Concept</h3>
            <p className={styles.spotlightDescription}>
              Test Convertic with your real data and use cases before committing. We&apos;ll help you build a
              custom proof of concept tailored to your specific needs, demonstrating the value of interactive
              emails for your business with measurable results.
            </p>
            <div className={styles.spotlightButtonWrapper}>
              <button onClick={() => handleDemoRequest('Start POC')} className={styles.spotlightButton}>
                Start POC →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
