import React from 'react'
import styles from './navbar.module.css'
import Image from 'next/image'
import ThemeToggle from '../themeToggle/ThemeToggle'
import Link from 'next/link'
import AuthLinks from '../authLinks/AuthLinks'

const NavBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </div>
      <div className={styles.logo}>convertic ai</div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/about" className={styles.link}>About</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
        <AuthLinks />
      </div>
    </div>
  )
}

export default NavBar