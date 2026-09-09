"use client";
import React, { useEffect, useRef } from 'react';
import styles from './SyncSection.module.css';

const SyncSection = () => {
  const textRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const paint = () => {
      ticking = false;
      const textElement = textRef.current;
      if (!textElement) return;

      const { top } = textElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Fill "reading window": 0% when the text top is near the bottom of the
      // viewport, 100% by the time it reaches the upper-middle. This completes the
      // fill while the text is still prominently in view (not after it scrolls off).
      const fillStart = viewportHeight * 0.9; // top position where filling begins
      const fillEnd = viewportHeight * 0.4;   // top position where filling completes
      const progress = Math.min(
        1,
        Math.max(0, (fillStart - top) / (fillStart - fillEnd))
      );

      const words = textElement.querySelectorAll('span');
      words.forEach((word, index) => {
        word.style.color =
          progress > index / words.length ? '#444' : '#e4e4e4';
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(paint);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    paint(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const text = "AMP email is a next-generation email format that allows interactive, dynamic content directly inside your inbox";
  const words = text.split(' ').map((word, index) => (
    <span key={index} className={styles.word}>{word} </span>
  ));

  return (
    <section className={styles.syncSection}>
      <h2 ref={textRef} className={styles.text}>
        {words}
      </h2>
    </section>
  );
};

export default SyncSection;