import React from 'react'
import { blogStyles as styles, PostGrid } from '@/components/blogUi/BlogUi'
import { STATIC_POSTS } from '@/lib/staticData'

// Every post (optionally one category) as a card grid, newest first.
const CardList = ({ cat, exclude }) => {
  const posts = STATIC_POSTS.filter(
    (p) => (!cat || p.catSlug === cat) && p.slug !== exclude
  )
  if (!posts.length) return <p className={styles.empty}>No posts here yet.</p>
  return <PostGrid posts={posts} />
}

export default CardList
