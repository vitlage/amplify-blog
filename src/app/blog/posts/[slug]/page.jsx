import React from 'react'
import Link from 'next/link'
import { STATIC_POSTS } from '@/lib/staticData'
import { blogStyles as styles, Rule, Chip, Byline, ReadTime, PostGrid } from '@/components/blogUi/BlogUi'
import { categoryLabel, prepareArticle } from '@/lib/blogMeta'

// Use static data for build-time generation (cheapest option)
const getData = async (slug) => {
  console.log('Using static data for single post generation:', slug);
  // Find post by slug in static data
  const post = STATIC_POSTS.find(p => p.slug === slug);
  if (!post) {
    throw new Error(`Post with slug ${slug} not found`);
  }
  return post;
};

// Generate static params for all posts
export async function generateStaticParams() {
  // Generate static pages for all posts
  return STATIC_POSTS.map(post => ({
    slug: post.slug
  }));
}

// Enable static generation
export const dynamic = 'force-static';

// SEO metadata for blog posts using metatags
export async function generateMetadata({ params }) {
  const post = await getData(params.slug);
  const siteUrl = 'https://convertic.ai';
  const url = `${siteUrl}/blog/posts/${params.slug}`;
  
  // Use metatags if available, otherwise fallback to defaults
  const metatags = post?.metatags;
  const title = metatags?.title || post?.title || 'Article — Convertic AI';
  const description = metatags?.description || post?.desc?.replace(/<[^>]*>/g, '').substring(0, 160) || '';
  const canonical = metatags?.canonical || url;
  const image = metatags?.ogImage || post?.img || `${siteUrl}/logo-mark-universal.png`;
  const keywords = metatags?.keywords || '';

  return {
    title,
    description,
    keywords,
    authors: metatags?.author ? [{ name: metatags.author }] : [{ name: 'Convertic AI Team' }],
    alternates: {
      canonical,
    },
    openGraph: {
      type: metatags?.ogType || 'article',
      url,
      title: metatags?.ogTitle || title,
      description: metatags?.ogDescription || description,
      siteName: 'Convertic AI',
      images: [{ url: image }],
      publishedTime: post?.createdAt,
      modifiedTime: post?.updatedAt || post?.createdAt,
    },
    twitter: {
      card: metatags?.twitterCard || 'summary_large_image',
      title: metatags?.twitterTitle || title,
      description: metatags?.twitterDescription || description,
      images: [metatags?.twitterImage || image],
    },
  };
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);
  const siteUrl = 'https://convertic.ai';
  const url = `${siteUrl}/blog/posts/${slug}`;
  const plainDesc = (data?.desc || '').replace(/<[^>]*>/g, '');
  const { body, toc } = prepareArticle(data?.desc);
  // Same category first, then the newest of the rest.
  const others = STATIC_POSTS.filter((p) => p.slug !== slug);
  const related = [
    ...others.filter((p) => p.catSlug === data?.catSlug),
    ...others.filter((p) => p.catSlug !== data?.catSlug),
  ].slice(0, 3);
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            data?.metatags?.schema || {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              headline: data?.title || 'Article — Convertic AI',
              description: plainDesc,
              image: data?.img ? [data.img] : undefined,
              datePublished: data?.createdAt || undefined,
              dateModified: data?.updatedAt || data?.createdAt || undefined,
              author: data?.user?.name ? { '@type': 'Person', name: data.user.name } : { '@type': 'Organization', name: 'Convertic AI' },
              publisher: {
                '@type': 'Organization',
                name: 'Convertic AI',
                logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-mark-universal.png` },
              },
            }
          ),
        }}
      />
      <header className={styles.hero}>
        <Rule>
          <Chip href={`/blog/category?cat=${data?.catSlug}`}>{categoryLabel(data?.catSlug)}</Chip>
        </Rule>
        <h1 className={styles.heroTitle}>{data?.title}</h1>
        <Rule>
          <div className={styles.heroMeta}>
            <Byline post={data} size="lg" />
            <ReadTime html={data?.desc} />
          </div>
        </Rule>
      </header>

      <div className={styles.articleLayout}>
        <aside className={styles.aside}>
          <Link href="/blog" className={styles.back}>
            <svg width="18" height="15" viewBox="0 0 20 16" fill="none" aria-hidden>
              <path d="M17.5 14C17.5 8 13.5 4.75 8 4.75H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M6.75 1L3 4.75L6.75 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go back to blog
          </Link>
          {toc.length > 1 && (
            <nav className={styles.toc} aria-label="On this page">
              <div className={styles.tocLabel}>On this page</div>
              <ol>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>
        <div className={styles.prose} dangerouslySetInnerHTML={{ __html: body }} />
        <div className={styles.articleSpacer} aria-hidden />
      </div>

      {related.length > 0 && (
        <>
          <Rule className={styles.sectionRule}>
            <h2 className={styles.sectionLabel}>Related stories</h2>
          </Rule>
          <PostGrid posts={related} />
        </>
      )}
    </div>
  )
}

export default SinglePage
