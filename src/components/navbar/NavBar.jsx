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
         
      </div>
      <Link href={"/blog"} className={styles.logo}>
        Convertic<span style={{color: "#1C71E8"}}>.</span>ai
      </Link>
      <div className={styles.links}>
        <ThemeToggle />
        <AuthLinks />
      </div>
    </div>
  )
}

export default NavBar