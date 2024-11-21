import React from 'react'
import styles from './navbar.module.css'
import Image from 'next/image'
import ThemeToggle from '../themeToggle/ThemeToggle'
import Link from 'next/link'
import AuthLinks from '../authLinks/AuthLinks'

const NavBar = () => {
  return (
    <div className={styles.container}>

      <Link href={"/"} className={styles.logo}>
        Сonvertic ai
      </Link>
      <div className={styles.links}>
        <ThemeToggle />
        <AuthLinks />
      </div>
    </div>
  )
}

export default NavBar