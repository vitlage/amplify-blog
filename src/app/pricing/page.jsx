'use client';
import React, { useEffect } from 'react';
import styles from './pricing.module.css';

export default function PricingPage() {
  // Define AFormPopup class if not available
  useEffect(() => {
    if (typeof window.AFormPopup === 'undefined') {
      window.AFormPopup = class AFormPopup {
        constructor(options) {
          this.id = '_' + Math.random().toString(36).substr(2, 9);
          this.options = options;
        }

        init() {
          this.remove();
          const div = document.createElement("div");
          div.innerHTML = `
            <div class="acelle-popup-cover"></div>
            <div class="acelle-popup-loader">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <div id="Popup${this.id}" class="acelle-popup-container">
              <div class="acelle-popup-container-scroll">
                <iframe id="Popup${this.id}Frame" src="${this.options.url}"></iframe>
              </div>
              <div id="Popup${this.id}Close" class="acelle-popup-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#000" d="M7.05022 7.05028C6.65969 7.4408 6.65969 8.07397 7.05022 8.46449L10.5858 12L7.05023 15.5356C6.6597 15.9261 6.6597 16.5593 7.05023 16.9498C7.44075 17.3403 8.07392 17.3403 8.46444 16.9498L12 13.4142L15.5355 16.9498C15.926 17.3403 16.5592 17.3403 16.9497 16.9498C17.3402 16.5592 17.3402 15.9261 16.9497 15.5356L13.4142 12L16.9497 8.46449C17.3402 8.07397 17.3402 7.4408 16.9497 7.05028C16.5592 6.65976 15.926 6.65976 15.5355 7.05028L12 10.5858L8.46443 7.05028C8.07391 6.65975 7.44074 6.65975 7.05022 7.05028Z"/></svg>
              </div>
            </div>`;
          div.classList.add("acelle-popup");
          div.id = 'Popup_' + this.id;
          document.body.appendChild(div);

          this.node = div;
          this.iframe = document.getElementById('Popup' + this.id + 'Frame');
          this.loadCss('https://app.convertic.ai/core/css/form_popup.css');

          window.addEventListener("message", (event) => {
            if (typeof (event.data.frameSize) != 'undefined') {
              this.adjustIframeSize(event.data.frameSize);
            }
            if (typeof (event.data.loaded) != 'undefined') {
              const es = document.getElementsByClassName('acelle-popup');
              if (es.length > 0) es[0].classList.add("acelle-popup-loaded");
            }
          });

          document.getElementById('Popup' + this.id + 'Close').addEventListener("click", () => {
            this.hide();
          });

          this.setOverlayOpacity();
        }

        setOverlayOpacity() {
          if (this.options.overlayOpacity) {
            const es = document.getElementsByClassName('acelle-popup');
            if (es.length > 0) {
              es[0].style.background = 'rgba(0,0,0,' + this.options.overlayOpacity + ')';
            }
          }
        }

        remove() {
          const oldEs = document.getElementsByClassName('acelle-popup');
          if (oldEs.length > 0) oldEs[0].parentNode.removeChild(oldEs[0]);
        }

        adjustIframeSize(size) {
          this.iframe.style.height = size.height + 'px';
        }

        loadCss(url) {
          if (!window.form_popup_css) {
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
            window.form_popup_css = link;
          }
        }

        show() {
          document.body.classList.add("acelle-popup-open");
        }

        hide() {
          document.body.classList.remove("acelle-popup-open");
        }

        load(options) {
          if (typeof (options) !== 'undefined') {
            this.options = Object.assign({}, this.options, options);
          }
          this.init();
          this.show();
        }
      };
    }
  }, []);

  const handleDemoRequest = (buttonName) => {
    console.log('handleDemoRequest called with:', buttonName);
    console.log('window.ACX:', window.ACX);
    console.log('window.openAcellePopup:', window.openAcellePopup);
    console.log('All window properties with "acelle" or "ACX":',
      Object.keys(window).filter(key =>
        key.toLowerCase().includes('acelle') ||
        key.toLowerCase().includes('acx')
      )
    );

    if (window.analytics) {
      window.analytics.track('Demo/Contact requested', { button: buttonName, page: 'pricing' });
    }

    // Function to try opening the popup
    const tryOpenPopup = () => {
      if (window.ACX && window.ACX.openPopup) {
        console.log('Opening popup via window.ACX.openPopup');
        window.ACX.openPopup();
        return true;
      } else if (window.openAcellePopup) {
        console.log('Opening popup via window.openAcellePopup');
        window.openAcellePopup();
        return true;
      }
      return false;
    };

    // Try immediately
    if (!tryOpenPopup()) {
      // Create and show the Convertic popup using the AFormPopup class
      if (typeof window.AFormPopup !== 'undefined') {
        const popup = new window.AFormPopup({
          url: 'https://app.convertic.ai/frontend/forms/66ced8cba95eb/content',
          overlayOpacity: '0.5'
        });
        popup.load();
      } else {
        console.warn('AFormPopup not available, redirecting to home page');
        window.location.href = '/#demo';
      }
    }
  };

  useEffect(() => {
    // Load Convertic script manually if not already loaded
    if (!document.getElementById('ACXConnectScriptManual')) {
      const script = document.createElement('script');
      script.id = 'ACXConnectScriptManual';
      script.type = 'text/javascript';
      script.src = 'https://app.convertic.ai/websites/66953e3ababf0/connect.js';
      script.async = false; // Load synchronously
      script.onload = () => {
        console.log('Convertic script manually loaded');
        setTimeout(() => {
          console.log('After manual load - window.ACX:', window.ACX);
          console.log('After manual load - window.openAcellePopup:', window.openAcellePopup);
        }, 1000);
      };
      script.onerror = (e) => console.error('Error loading Convertic script manually:', e);
      document.body.appendChild(script);
    }

    // Check if Convertic script is loaded
    const checkConverticScript = setInterval(() => {
      if (window.ACX || window.openAcellePopup) {
        console.log('Convertic script loaded:', {
          ACX: !!window.ACX,
          openPopup: !!(window.ACX && window.ACX.openPopup),
          openAcellePopup: !!window.openAcellePopup
        });
        clearInterval(checkConverticScript);
      }
    }, 100);

    // Clear interval after 10 seconds
    setTimeout(() => {
      clearInterval(checkConverticScript);
      console.log('Final check - Convertic available:', {
        ACX: !!window.ACX,
        openPopup: !!(window.ACX && window.ACX.openPopup),
        openAcellePopup: !!window.openAcellePopup
      });
    }, 10000);

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
              <a href="https://app.convertic.ai/users/register" className={styles.ctaButton}>Get Started</a>
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
              <a href="https://app.convertic.ai/users/register" className={styles.ctaButton}>Get Started</a>
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
