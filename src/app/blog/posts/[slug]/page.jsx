import React from 'react'
import styles from './singlePage.module.css'
import Menu from '@/components/Menu/Menu'
import Image from 'next/image'
import Comments from '@/components/comments/Comments'

const getData = async (slug) => {
  const res = await fetch(`${process.env.HOST_URL}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Getting single page failed");
  }

  return res.json();
};

// SEO metadata for blog posts
export async function generateMetadata({ params }) {
  const post = await getData(params.slug);
  const siteUrl = 'https://convertic.ai';
  const url = `${siteUrl}/blog/posts/${params.slug}`;
  const title = post?.title || 'Article — Convertic AI';
  // Strip HTML from description safely and trim to ~160 chars
  const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || '';
  const descRaw = stripHtml(post?.desc || '');
  const description = descRaw.length > 160 ? `${descRaw.slice(0, 157)}...` : descRaw;
  const image = post?.img || `${siteUrl}/logo.png`;
  const publishedTime = post?.createdAt || undefined;
  const modifiedTime = post?.updatedAt || post?.createdAt || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Convertic AI',
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);
  const siteUrl = 'https://convertic.ai';
  const url = `${siteUrl}/blog/posts/${slug}`;
  const plainDesc = (data?.desc || '').replace(/<[^>]*>/g, '');
  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            headline: data?.title || 'Article — Convertic AI',
            description: plainDesc,
            image: data?.img ? [data.img] : undefined,
            datePublished: data?.createdAt || undefined,
            dateModified: data?.updatedAt || data?.createdAt || undefined,
            author: data?.user?.name ? { '@type': 'Person', name: data.user.name } : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'Convertic AI',
              logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
          }),
        }}
      />
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            {data?.title}
          </h1>
          {data?.img && <div className={styles.imageContainer}>
            <Image src={data.img} alt={data?.title || 'Article image'} fill className={styles.image} />
          </div>}
          <div className={styles.user}>
            {data?.user?.image && <div className={styles.userImageContainer}>
              <Image src={data?.user?.image} alt={data?.user?.name || 'Author avatar'} fill className={styles.avatar} />
            </div>}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.user?.name}</span>
              <span className={styles.date}>{data.createdAt?.substring(0, 10)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: `${data?.desc}` }}
          />
        </div>
        <Menu />
      </div>
    </div>
  )
}

export default SinglePage
