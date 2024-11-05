import React from 'react'
import styles from './menuCategories.module.css'
import Link from 'next/link'

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
        <Link href="/blog?cat=email" className={`${styles.categoryItem} ${styles.style}`}>Email</Link>
        <Link href="/blog?cat=tech" className={`${styles.categoryItem} ${styles.fashion}`}>Technology</Link>
        <Link href="/blog?cat=d2c" className={`${styles.categoryItem} ${styles.food}`}>D2C</Link>
        <Link href="/blog?cat=amp" className={`${styles.categoryItem} ${styles.travel}`}>AMP</Link>
        <Link href="/blog?cat=marketing" className={`${styles.categoryItem} ${styles.culture}`}>Marketing</Link>
        <Link href="/blog?cat=coding" className={`${styles.categoryItem} ${styles.coding}`}>Coding</Link>
    </div>
  )
}

export default MenuCategories