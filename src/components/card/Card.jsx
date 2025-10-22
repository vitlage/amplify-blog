import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const extractIntroText = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Extract text from first <p> tag inside <section id="introduction">
  const introMatch = htmlContent.match(/<section id="introduction">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (introMatch && introMatch[1]) {
    // Remove HTML tags and get plain text
    const text = introMatch[1].replace(/<[^>]*>/g, '');
    // Limit to approximately 300 characters
    return text.length > 300 ? text.substring(0, 300) + '...' : text;
  }
  
  // Fallback: extract first paragraph if no introduction section
  const firstPMatch = htmlContent.match(/<p>([\s\S]*?)<\/p>/);
  if (firstPMatch && firstPMatch[1]) {
    const text = firstPMatch[1].replace(/<[^>]*>/g, '');
    return text.length > 300 ? text.substring(0, 300) + '...' : text;
  }
  
  return '';
};

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
          {extractIntroText(item?.desc)}
        </p>
        <Link href={`/blog/posts/${item?.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;