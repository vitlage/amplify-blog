import Link from 'next/link'
import Image from 'next/image'
import styles from './blog.module.css'
import { categoryLabel, excerpt, formatDate, readTime } from '@/lib/blogMeta'

// Full-width hairline with dots, broken in the middle by its children.
export const Rule = ({ children, className = '' }) => (
  <div className={`${styles.rule} ${className}`}>
    <span className={`${styles.ruleLine} ${styles.ruleLeft}`} aria-hidden />
    {children}
    <span className={`${styles.ruleLine} ${styles.ruleRight}`} aria-hidden />
  </div>
)

export const Chip = ({ children, href }) =>
  href ? (
    <Link href={href} className={styles.chip}>
      {children}
    </Link>
  ) : (
    <span className={styles.chip}>{children}</span>
  )

export const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const ReadTime = ({ html }) => (
  <span className={styles.readTime}>
    <ClockIcon />
    {readTime(html)} min
  </span>
)

export const Byline = ({ post, size = 'sm' }) => (
  <div className={`${styles.byline} ${size === 'lg' ? styles.bylineLg : ''}`}>
    <span className={styles.avatar}>
      <Image src="/logo-mark-universal.png" alt="" width={40} height={40} />
    </span>
    <span className={styles.bylineText}>
      <span className={styles.author}>{post?.user?.name || 'Convertic.ai'}</span>
      <time className={styles.date} dateTime={post?.createdAt}>
        {formatDate(post?.createdAt)}
      </time>
    </span>
  </div>
)

// Grid card: the whole card links to the article.
export const PostCard = ({ post }) => (
  <Link href={`/blog/posts/${post.slug}`} className={styles.card}>
    <div className={styles.cardTop}>
      <span className={styles.chip}>{categoryLabel(post.catSlug)}</span>
      <h3 className={styles.cardTitle}>{post.title}</h3>
      <p className={styles.cardExcerpt}>{excerpt(post.desc, 150)}</p>
    </div>
    <div className={styles.cardFoot}>
      <Byline post={post} />
      <ReadTime html={post.desc} />
    </div>
  </Link>
)

export const PostGrid = ({ posts }) => (
  <div className={styles.grid}>
    {posts.map((p) => (
      <PostCard post={p} key={p._id || p.slug} />
    ))}
  </div>
)

// Category filter row. `active` is the current category slug (null = all).
export const CategoryChips = ({ categories, active }) => (
  <nav className={styles.filters} aria-label="Categories">
    <Link
      href="/blog"
      className={`${styles.filter} ${!active ? styles.filterActive : ''}`}
    >
      View all
    </Link>
    {categories.map((slug) => (
      <Link
        key={slug}
        href={`/blog/category?cat=${slug}`}
        className={`${styles.filter} ${active === slug ? styles.filterActive : ''}`}
      >
        {categoryLabel(slug)}
      </Link>
    ))}
  </nav>
)

export { styles as blogStyles }
