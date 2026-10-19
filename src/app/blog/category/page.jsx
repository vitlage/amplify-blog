import React from 'react'
import CardList from '@/components/cardList/CardList'
import { blogStyles as styles, Rule, CategoryChips } from '@/components/blogUi/BlogUi'
import { STATIC_POSTS } from '@/lib/staticData'

export async function generateMetadata({ searchParams }) {
  const cat = searchParams.cat;
  const siteUrl = 'https://convertic.ai';
  const basePath = '/blog/category';
  const url = cat ? `${siteUrl}${basePath}?cat=${cat}` : `${siteUrl}${basePath}`;
  
  const getCategoryTitle = (catSlug) => {
    const categoryNames = {
      'ai-marketing': 'AI Marketing',
      'amp-email': 'AMP Email',
      'product': 'Product'
    };
    return categoryNames[catSlug] || 'Categories';
  };
  
  const categoryTitle = getCategoryTitle(cat);
  const title = cat ? `${categoryTitle} — Convertic AI` : 'Categories — Convertic AI';
  const description = cat 
    ? `Browse ${categoryTitle.toLowerCase()} articles about AI-driven AMP email marketing, best practices, and product updates.`
    : 'Browse articles by category about AI-driven AMP email marketing, best practices, and product updates.';

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

const CategoryPage = ({ searchParams }) => {
  const cat = searchParams.cat || null;

  // Get category title for display
  const getCategoryTitle = (catSlug) => {
    if (!catSlug) return "All Categories";
    
    // Map category slugs to display names (matching static data)
    const categoryNames = {
      'ai-marketing': 'AI Marketing',
      'amp-email': 'AMP Email',
      'product': 'Product',
      'email': 'Email Marketing',
      'technology': 'Technology',
      'd2c': 'D2C',
      'amp': 'AMP',
      'marketing': 'Marketing',
      'ai': 'AI'
    };
    
    return categoryNames[catSlug] || catSlug.charAt(0).toUpperCase() + catSlug.slice(1);
  };

  const categoryTitle = getCategoryTitle(cat);

  return (
    <div className={styles.page}>
      <header className={styles.indexHead}>
        <h1 className={styles.indexTitle}>{categoryTitle}</h1>
      </header>
      <Rule className={styles.sectionRule}>
        <h2 className={styles.sectionLabel}>Stories</h2>
      </Rule>
      <CategoryChips
        categories={[...new Set(STATIC_POSTS.map((p) => p.catSlug))]}
        active={cat}
      />
      <CardList cat={cat} />
    </div>
  )
}

export default CategoryPage
