import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";
import { truncateHtml } from "@/lib/staticData";

const Card = ({ key, item }) => {
  return (
    <div className={styles.container} key={key}>
      {item?.img && item.img.trim() !== '' && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item?.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={styles.category}>{item?.catSlug}</span>
        </div>
        <Link href={`/blog/posts/${item?.slug}`}>
          <h1>{item?.title}</h1>
        </Link>
        <p className={styles.desc}>
          {truncateHtml(item?.desc, 100)}
        </p>
        <Link href={`/blog/posts/${item?.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;