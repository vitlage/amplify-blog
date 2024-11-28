import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="convertic blog" width={50} height={50} />
          <h1 className={styles.logoText}>Convertic blog</h1>
        </div>
        <p className={styles.desc}><Link href="https://convertic.ai">Convertic.ai</Link> is an AI-powered platform designed to generate emails and automate the entire email marketing workflow. It helps businesses create personalized campaigns, optimize delivery, and streamline their email marketing processes effortlessly.</p>
        <div className={styles.icons}>
          {/* <Image src="/facebook.png" alt="" width={18} height={18} />
          <Image src="/instagram.png" alt="" width={18} height={18} />
          <Image src="/tiktok.png" alt="" width={18} height={18} />
          <Image src="/youtube.png" alt="" width={18} height={18} /> */}
        </div>
      </div>
      <div className={styles.links}>
        {/* <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href="/">Email</Link>
          <Link href="/">D2C</Link>
          <Link href="/">AMP</Link>
          <Link href="/">AI</Link>
        </div> */}
        {/* <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href="/">Facebook</Link>
          <Link href="/">Instagram</Link>
          <Link href="/">Tiktok</Link>
          <Link href="/">Youtube</Link>
        </div> */}
      </div>
    </div>
  )
}

export default Footer