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