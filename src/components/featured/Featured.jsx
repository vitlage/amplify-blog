import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'
import Link from 'next/link'

const getData = async (page, cat) => {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page}&cat=${cat || ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Getting categories failed");
  }

  return res.json();
};

const Featured = async ({item}) => {
  const { posts } = await getData(item);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, we are Convertic AI</b> and we write about marketing, AI, and technology
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{posts[0].title}</h1>
          <p className={styles.postDesc}>{posts[0].desc}</p>
          <Link href={`/posts/${posts[0].slug}`}>
            <button className={styles.button}>Read More</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Featured