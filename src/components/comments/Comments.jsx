import React from 'react'
import Link from "next/link";
import styles from './comments.module.css'
import Image from 'next/image';

const Comments = () => {
  const status = "authentificated";
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Comments</h1>
        {status === "authentificated" ? (
            <div className={styles.write}>
                <textarea placeholder='Write a comment...' className={styles.input} />
                <button className={styles.button}>Send</button>
            </div>
        ) : (
            <Link href="/login">Login to write a comment</Link>
        )}
        <div className={styles.comments}>
            <div className={styles.comment}>
                <div className={styles.user}>
                    <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
                    <div className={styles.userInfo}>
                        <span className={styles.username}>John Doe</span>
                        <span className={styles.date}>03.02.2024</span>
                    </div>
                </div>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore explicabo, soluta obcaecati temporibus ducimus rem esse earum, animi, ipsam architecto voluptate enim ad sint libero molestiae qui fugit itaque? Itaque?</p>
            </div>
        </div>
        <div className={styles.comments}>
            <div className={styles.comment}>
                <div className={styles.user}>
                    <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
                    <div className={styles.userInfo}>
                        <span className={styles.username}>John Doe</span>
                        <span className={styles.date}>03.02.2024</span>
                    </div>
                </div>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore explicabo, soluta obcaecati temporibus ducimus rem esse earum, animi, ipsam architecto voluptate enim ad sint libero molestiae qui fugit itaque? Itaque?</p>
            </div>
        </div>
        <div className={styles.comments}>
            <div className={styles.comment}>
                <div className={styles.user}>
                    <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
                    <div className={styles.userInfo}>
                        <span className={styles.username}>John Doe</span>
                        <span className={styles.date}>03.02.2024</span>
                    </div>
                </div>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore explicabo, soluta obcaecati temporibus ducimus rem esse earum, animi, ipsam architecto voluptate enim ad sint libero molestiae qui fugit itaque? Itaque?</p>
            </div>
        </div>
        <div className={styles.comments}>
            <div className={styles.comment}>
                <div className={styles.user}>
                    <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
                    <div className={styles.userInfo}>
                        <span className={styles.username}>John Doe</span>
                        <span className={styles.date}>03.02.2024</span>
                    </div>
                </div>
                <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore explicabo, soluta obcaecati temporibus ducimus rem esse earum, animi, ipsam architecto voluptate enim ad sint libero molestiae qui fugit itaque? Itaque?</p>
            </div>
        </div>
    </div>
  )
}

export default Comments