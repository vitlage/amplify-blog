import React from 'react'
import styles from './blogPage.module.css'
import CardList from '@/components/cardList/CardList'
import Menu from '@/components/Menu/Menu'

export async function generateMetadata() {
  const siteUrl = 'https://convertic.ai';
  const basePath = '/blog/category';
  const url = `${siteUrl}${basePath}`;
  const title = 'Categories — Convertic AI';
  const description = 'Browse articles by category about AI-driven AMP email marketing, best practices, and product updates.';

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

// Enable static generation - no server costs
export const dynamic = 'force-static';

const CategoryPage = () => {
  // For static export, show all categories overview
  const page = 1;
  const cat = null; // Show all posts

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Categories</h1>
        <div className={styles.content}>
            <CardList page={page} cat={cat} />
            <Menu />
        </div>
    </div>
  )
}

export default CategoryPage
