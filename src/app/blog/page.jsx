import CardList from "@/components/cardList/CardList";
import Featured from "@/components/featured/Featured";
import { blogStyles as styles, Rule, CategoryChips } from "@/components/blogUi/BlogUi";
import { STATIC_POSTS } from "@/lib/staticData";

export async function generateMetadata() {
  const siteUrl = 'https://convertic.ai';
  const basePath = '/blog';
  const url = `${siteUrl}${basePath}`;
  const title = 'Blog — Convertic AI';
  const description = 'Latest updates, tutorials, and insights about AI-driven AMP email marketing from Convertic AI.';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Convertic AI',
      images: [{ url: `${siteUrl}/logo-mark-universal.png` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/logo-mark-universal.png`],
    },
  };
}

export default function Home() {
  const [featured] = STATIC_POSTS;
  const categories = [...new Set(STATIC_POSTS.map((p) => p.catSlug))];

  return (
    <div className={styles.page}>
      <header className={styles.indexHead}>
        <h1 className={styles.indexTitle}>The Convertic.ai blog</h1>
        <p className={styles.indexSub}>
          Interactive email, retention and AI for DTC brands.
        </p>
      </header>

      <Rule className={styles.sectionRule}>
        <h2 className={styles.sectionLabel}>Featured story</h2>
      </Rule>
      <Featured post={featured} />

      <Rule className={styles.sectionRule}>
        <h2 className={styles.sectionLabel}>Recent stories</h2>
      </Rule>
      <CategoryChips categories={categories} active={null} />
      <CardList exclude={featured?.slug} />
    </div>
  );
}
