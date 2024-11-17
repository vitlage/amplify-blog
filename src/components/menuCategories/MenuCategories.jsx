import React from 'react'
import styles from './menuCategories.module.css'
import Link from 'next/link'

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
        <Link href="/blog?cat=email" className={`${styles.categoryItem} ${styles.email}`}>Email</Link>
        <Link href="/blog?cat=tech" className={`${styles.categoryItem} ${styles.technology}`}>Technology</Link>
        <Link href="/blog?cat=d2c" className={`${styles.categoryItem} ${styles.d2c}`}>D2C</Link>
        <Link href="/blog?cat=amp" className={`${styles.categoryItem} ${styles.amp}`}>AMP</Link>
        <Link href="/blog?cat=marketing" className={`${styles.categoryItem} ${styles.marketing}`}>Marketing</Link>
        <Link href="/blog?cat=coding" className={`${styles.categoryItem} ${styles.ai}`}>AI</Link>
    </div>
  )
}

export default MenuCategories