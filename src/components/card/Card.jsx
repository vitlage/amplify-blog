import React from 'react'
import styles from "./card.module.css"
import Image from 'next/image'
import Link from 'next/link'

const Card = () => {
  return (
    <div className={styles.container}>
        <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.Image} />
        </div>
        <div className={styles.textContainer}>
            <div className={styles.detail}>
                <span className={styles.date}>11.02.2024 - </span>
                <span className={styles.category}>CULTURE</span>
            </div>
            <Link href="/">
                <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus sed exercitationem similique esse quo</h1>
            </Link>
            <p className={styles.desc}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur nobis modi necessitatibus? Ipsum officiis iste ullam rerum, quas omnis maiores assumenda dignissimos recusandae velit dolores, possimus provident incidunt harum nostrum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum corrupti veniam soluta labore. Repellat, voluptas voluptate, quas non numquam excepturi tenetur facere fuga beatae deleniti deserunt voluptates atque placeat expedita.</p>
            <Link href="/" className={styles.link}>Read More</Link>
        </div>
    </div>
  )
}

export default Card