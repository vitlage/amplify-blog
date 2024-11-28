import Link from 'next/link'
import React from 'react'
import styles from '../menuPosts/menuPosts.module.css'
import Image from 'next/image';

const getData = async (page, cat) => {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page || ""}&cat=${cat || ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Getting categories failed");
  }

  return res.json();
};

const MenuPosts = async ({ withImage }) => {
  const { posts } = await getData(1);
  return (
    <div className={styles.items}>
        <Link href={`blog/posts/${posts[0].slug}`} className={styles.item}>
            {withImage && (
                <div className={styles.imageContainer}>
                <Image src="/p1.jpeg" alt="" fill className={styles.image}/>  
            </div>
            )}
            <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[posts[0].catSlug]}`}>{posts[0].catSlug}</span>
            <h3 className={styles.postTitle}>{posts[0].title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}>{posts[0].createdAt?.substring(0, 10)}</span>
            </div>
          </div> 
        </Link>
        <Link href={`blog/posts/${posts[1].slug}`} className={styles.item}>
            {withImage && (
                <div className={styles.imageContainer}>
                <Image src="/p1.jpeg" alt="" fill className={styles.image}/>  
            </div>
            )}
            <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[posts[1].catSlug]}`}>{posts[1].catSlug}</span>
            <h3 className={styles.postTitle}>{posts[1].title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}>{posts[1].createdAt?.substring(0, 10)}</span>
            </div>
          </div> 
        </Link>
        <Link href={`blog/posts/${posts[2].slug}`} className={styles.item}>
            {withImage && (
                <div className={styles.imageContainer}>
                <Image src="/p1.jpeg" alt="" fill className={styles.image}/>  
            </div>
            )}
            <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[posts[2].catSlug]}`}>{posts[2].catSlug}</span>
            <h3 className={styles.postTitle}>{posts[2].title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}>{posts[2].createdAt?.substring(0, 10)}</span>
            </div>
          </div> 
        </Link>
        <Link href={`blog/posts/${posts[3].slug}`} className={styles.item}>
            {withImage && (
                <div className={styles.imageContainer}>
                <Image src="/p1.jpeg" alt="" fill className={styles.image}/>  
            </div>
            )}
            <div className={styles.textContainer}>
            <span className={`${styles.category} ${styles[posts[3].catSlug]}`}>{posts[3].catSlug}</span>
            <h3 className={styles.postTitle}>{posts[3].title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}>{posts[3].createdAt?.substring(0, 10)}</span>
            </div>
          </div> 
        </Link>
      </div>
  )
}

export default MenuPosts