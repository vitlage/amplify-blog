import Link from 'next/link'
import React from 'react'
import styles from '../menuPosts/menuPosts.module.css'
import Image from 'next/image';
import { getStaticPosts } from '@/lib/staticData'

// Use static data for build-time generation (cheapest option)
const getData = async (page, cat) => {
  console.log('Using static data for menu posts generation');
  return getStaticPosts(page, cat);
};

const MenuPosts = async ({ withImage }) => {
  const { posts } = await getData(1);
  
  // Take only first 4 posts, handle cases with fewer posts
  const displayPosts = posts.slice(0, 4);
  
  return (
    <div className={styles.items}>
      {displayPosts.map((post, index) => (
        <Link href={`/blog/posts/${post.slug}`} className={styles.item} key={post._id || index}>
          {withImage && (
            <div className={styles.imageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.image}/>  
            </div>
          )}
          <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[post.catSlug]}`}>{post.catSlug}</span>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}>{post.createdAt?.substring(0, 10)}</span>
            </div>
          </div> 
        </Link>
      ))}
    </div>
  )
}

export default MenuPosts