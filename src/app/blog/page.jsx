import styles from "./homepage.module.css";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Featured from "@/components/featured/Featured";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export async function generateMetadata({ searchParams }) {
  const siteUrl = 'https://convertic.ai';
  const basePath = '/blog';
  const page = Number.parseInt(searchParams?.page) || 1;
  const url = page > 1 ? `${siteUrl}${basePath}?page=${page}` : `${siteUrl}${basePath}`;
  const title = page > 1 ? `Blog — Page ${page} | Convertic AI` : 'Blog — Convertic AI';
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

export default function Home({ searchParams }) {
  const page = Number.parseInt(searchParams.page) || 1;

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
