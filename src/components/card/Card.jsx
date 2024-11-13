import React from 'react'
import styles from "./card.module.css"
import Image from 'next/image'
import Link from 'next/link'

const Card = ({key, item}) => {
  return (
    <div className={styles.container} key={key}>
        <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.Image} />
        </div>
        {/* {item.img && <div className={styles.imageContainer}>
            <Image src={item.img} alt="" fill className={styles.Image} />
        </div>} */}
        {/* <div className={styles.textContainer}>
            <div className={styles.detail}>
                <span className={styles.date}>{item.createdAt.substring(0, 10)} - </span>
                <span className={styles.category}>{item.catSlug}</span>
            </div>
            <Link href="/">
                <h1>{item?.title}</h1>
                <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus sed exercitationem similique esse quo</h1>
            </Link>
            <p className={styles.desc}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur nobis modi necessitatibus? Ipsum officiis iste ullam rerum, quas omnis maiores assumenda dignissimos recusandae velit dolores, possimus provident incidunt harum nostrum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum corrupti veniam soluta labore. Repellat, voluptas voluptate, quas non numquam excepturi tenetur facere fuga beatae deleniti deserunt voluptates atque placeat expedita.</p>
            <Link href="/" className={styles.link}>Read More</Link>
        </div> */}
        <div className={styles.textContainer}>
            <div className={styles.detail}>
                <span className={styles.date}>11.02.2024 - </span>
                <span className={styles.category}>CULTURE</span>
            </div>
            {/* <Link href={`/posts/${item.slug}`}> */}
            <Link href="/">
                <h1>{item?.title}</h1>
                <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus sed exercitationem similique esse quo</h1>
            </Link>
            <p className={styles.desc}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur nobis modi necessitatibus? Ipsum officiis iste ullam rerum, quas omnis maiores assumenda dignissimos recusandae velit dolores, possimus provident incidunt harum nostrum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum corrupti veniam soluta labore. Repellat, voluptas voluptate, quas non numquam excepturi tenetur facere fuga beatae deleniti deserunt voluptates atque placeat expedita.</p>
            {/* <p className={styles.desc}>
                {item.desc.substring(0, 60)}
            </p> */}
            {/* <Link href={`/posts/${item.slug}`} className={styles.link}>Read More</Link> */}
            <Link href="/" className={styles.link}>Read More</Link>
        </div>
    </div>
  )
}

export default Card