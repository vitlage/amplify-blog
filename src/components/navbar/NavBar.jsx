import React from 'react'
import styles from './navbar.module.css'
import Image from 'next/image'
import ThemeToggle from '../themeToggle/ThemeToggle'
import Link from 'next/link'
import AuthLinks from '../authLinks/AuthLinks'

const NavBar = () => {
  return (
    <div className={styles.container}>
      {/* <div className={styles.social}>
         
      </div> */}
      <Link href={"/"} className={`${styles.logo} navbar-logo`}>
        {/* <div className="hor_circle2">
          <div className="hor_circle_inner"></div>
        </div> */}
        Convertic<span style={{ color: "#1C71E8" }}>.</span>ai
      </Link>
      <div className={styles.links}>
        <ThemeToggle />
        {/* <Link href="/blog/login" className={styles.navLink}>Login</Link> */}
        {/* <Link href="/use-cases" className={styles.navLink}>Use Cases</Link> */}
        <Link href="/pricing" className={styles.navLink}>Pricing</Link>
        <Link href="/blog" className={styles.navLink}>Blog</Link>
        <a href="https://app.convertic.ai/login" className={styles.navBtn + ' ' + styles.navBtnOutline}>Login</a>
        <a href="https://app.convertic.ai/users/register" className={styles.navBtn + ' ' + styles.navBtnFilled}>Try it</a>
        {/* <AuthLinks /> */}
      </div>
    </div>
  )
}

export default NavBar