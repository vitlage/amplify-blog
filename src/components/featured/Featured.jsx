import React from 'react'
import Link from 'next/link'
import { blogStyles as styles, Byline, ReadTime } from '@/components/blogUi/BlogUi'
import { categoryLabel, excerpt } from '@/lib/blogMeta'

// Newest post as a wide card; the whole card links to the article.
const Featured = ({ post }) => {
  if (!post) return null
  return (
    <Link href={`/blog/posts/${post.slug}`} className={styles.featured}>
      <div>
        <span className={styles.chip}>{categoryLabel(post.catSlug)}</span>
        <h2 className={styles.featuredTitle}>{post.title}</h2>
      </div>
      <div className={styles.featuredSide}>
        <p className={styles.featuredExcerpt}>{excerpt(post.desc, 260)}</p>
        <div className={styles.featuredFoot}>
          <Byline post={post} />
          <ReadTime html={post.desc} />
        </div>
      </div>
    </Link>
  )
}

export default Featured
