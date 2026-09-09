import Link from "next/link";
import styles from "./brandIntro.module.css";

export default function BrandIntro() {
  return (
    <section className={styles.section} aria-label="Convertic introduction">
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.dots} aria-hidden="true" />
          <h2 className={styles.wordmark}>CONVERTIC</h2>
        </div>

        <div className={styles.right}>
          <div className={styles.planet} aria-hidden="true">
            <div className={styles.planetGlow} />
            <div className={styles.planetBody} />
            <div className={styles.planetSpec} />
          </div>
        </div>
      </div>

      <div className={styles.lower}>
        <div className={styles.copyCol}>
          <h3 className={styles.tagline}>
            Interactive emails that turn
            <br />
            opens into orders.
          </h3>
          <p className={styles.body}>
            Convertic builds AMP email programs that put shopping, abandoned
            cart recovery, bundles, subscriptions, upsells, and cross-sells
            right inside the inbox. Buyers tap, customize, and check out
            without ever leaving the email.
          </p>
          <span className={styles.scroll}>
            scroll to explore <span aria-hidden="true">▾</span>
          </span>
        </div>

        <div className={styles.cardsRow}>
          <Link href="/use-cases" className={`${styles.card} ${styles.cardLight}`}>
            <span className={styles.cardArrow} aria-hidden="true">↗</span>
            <span className={styles.cardTitle}>Use cases</span>
            <span className={styles.cardSub}>See what teams build with Convertic</span>
          </Link>
          <Link href="https://app.convertic.ai/users/register" className={`${styles.card} ${styles.cardDark}`}>
            <span className={styles.cardArrow} aria-hidden="true">↗</span>
            <span className={styles.cardTitle}>Get started</span>
            <span className={styles.cardSub}>Spin up your first AMP email</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
