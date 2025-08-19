import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticPosts } from '@/lib/staticData'

// Use static data for build-time generation (cheapest option)
const getData = async (page, cat) => {
  console.log('Using static data for featured post generation');
  return getStaticPosts(page, cat);
};

const Featured = async ({item}) => {
  const { posts } = await getData(item);
  const featuredPost = posts[posts.length-1];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Hey, we are Convertic<span style={{color: "#1C71E8"}}>.</span>ai and we write about marketing, AI, and technology
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src={featuredPost.img} alt="" fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{featuredPost.title}</h1>
          <p className={styles.postDesc}>{featuredPost.desc}</p>
          <Link href={`blog/posts/${featuredPost.slug}`}>
            <button className={styles.button}>Read More</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Featured