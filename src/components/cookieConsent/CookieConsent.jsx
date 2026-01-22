'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './cookieConsent.module.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.content}>
        <p className={styles.text}>
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
          <Link href="/privacy-policy" className={styles.link}>Learn more</Link>
        </p>
        <div className={styles.buttons}>
          <button onClick={handleDecline} className={styles.declineButton}>
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
