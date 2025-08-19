import styles from "./homepage.module.css";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Featured from "@/components/featured/Featured";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

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
      images: [{ url: `${siteUrl}/logo.png` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/logo.png`],
    },
  };
}

// Enable static generation - no server costs but maximum caching
export const dynamic = 'force-static';

export default function Home() {
  // For static export, we show the main blog page (page 1)
  // Pagination can be handled client-side or via separate static pages
  const page = 1;

  return (
    <div className={styles.container}>
      <Featured item={page} />
      <CategoryList />
      <div className={styles.content}>
        <CardList page={page}/>
        <Menu />
      </div>
    </div>
  );
}
