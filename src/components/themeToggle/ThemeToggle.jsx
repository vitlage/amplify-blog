"use client";

import React, { useContext } from 'react'
import styles from './themeToggle.module.css'
import Image from 'next/image'
import { ThemeContext } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    console.error('ThemeToggle must be used within a ThemeContextProvider');
    return null;
  }

  const { toggle, theme } = context;

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggle();
  };

  return (
    <div
      className={styles.container}
      onClick={handleToggle}
      style={
        theme === "dark"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#0f172a" }
      }
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Image src="/moon.png" alt="moon" width={14} height={14} className={styles.icon} />
      <div className={styles.ball}
        style={theme === "dark"
          ? { left: 4, background: "#0f172a" }
          : { right: 4, background: "white" }
        } />
      <Image src="/sun.png" alt="sun" width={14} height={14} />
    </div>
  )
}

export default ThemeToggle