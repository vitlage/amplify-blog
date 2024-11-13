import React from 'react'
import styles from './singlePage.module.css'
import Menu from '@/components/Menu/Menu'
import Image from 'next/image'
import Comments from '@/components/comments/Comments'

const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {r
    throw new Error("Getting categories failed");
  }

  return res.json();
};

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const data = await getData(slug);
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            {/* {data?.title} */}
            Lorem ipsum dolor sit amet concestuar
          </h1>
          <div className={styles.user}>
            {/* {data?.user?.image && <div className={styles.userImageContainer}>
              <Image src={data.user.image} alt="" fill className={styles.avatar} />
            </div>} */}
            <div className={styles.userImageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.avatar} />
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>John Doe</span>
              <span className={styles.username}>{data?.user?.name}</span>
              <span className={styles.date}>08.04.2024</span>
            </div>
          </div>
        </div>
            {/* {data?.img && <div className={styles.imageContainer}>
              <Image src={data.img} alt="" fill className={styles.avatar} />
            </div>} */}
        <div className={styles.imageContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: `${data?.desc}` }}
          />
          <div className={styles.description}>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum quia unde consectetur voluptas minima sed inventore voluptatum amet numquam totam assumenda, necessitatibus, minus, a quam ullam debitis saepe tenetur!</p>
            <h2>Lorem ipsum dolor sit amet</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum quia unde consectetur voluptas minima sed inventore voluptatum amet numquam totam assumenda, necessitatibus, minus, a quam ullam debitis saepe tenetur!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eum quia unde consectetur voluptas minima sed inventore voluptatum amet numquam totam assumenda, necessitatibus, minus, a quam ullam debitis saepe tenetur!</p>
          </div>
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  )
}

export default SinglePage