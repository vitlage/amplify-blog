import React from 'react'
import styles from './blogPage.module.css'
import CardList from '@/components/cardList/CardList'
import Menu from '@/components/Menu/Menu'

export async function generateMetadata({ searchParams }) {
  const siteUrl = 'https://convertic.ai';
  const cat = searchParams?.cat || 'All';
  const page = Number.parseInt(searchParams?.page) || 1;
  const basePath = '/blog/category';
  const qs = new URLSearchParams({ cat, ...(page > 1 ? { page: String(page) } : {}) }).toString();
  const url = `${siteUrl}${basePath}?${qs}`;
  const normalizedCat = String(cat).charAt(0).toUpperCase() + String(cat).slice(1);
  const title = page > 1 ? `${normalizedCat} — Page ${page} | Convertic AI` : `${normalizedCat} — Convertic AI`;
  const description = `Articles in ${normalizedCat} about AI-driven AMP email marketing, best practices, and product updates.`;

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

const CategoryPage = ({ searchParams }) => {
  const page = Number.parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat}</h1>
        <div className={styles.content}>
            <CardList page={page} cat={cat} />
            <Menu />
        </div>
    </div>
  )
}

export default CategoryPage
