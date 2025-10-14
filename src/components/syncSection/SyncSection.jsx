"use client";
import React, { useEffect, useRef } from 'react';
import styles from './SyncSection.module.css';

const SyncSection = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const textElement = textRef.current;
      if (textElement) {
        const { top, bottom } = textElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (top < viewportHeight && bottom > 0) {
          const scrollPercentage = (viewportHeight - top) / (viewportHeight + textElement.clientHeight);
          const words = textElement.querySelectorAll('span');
          
          words.forEach((word, index) => {
            if (scrollPercentage > (index / words.length)) {
              word.style.color = '#000'; // Change to final color
            } else {
              word.style.color = '#888'; // Initial color
            }
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

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