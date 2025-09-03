import React from 'react'
import styles from './categoryList.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticCategories } from '@/lib/staticData'

// Use static data for build-time generation (cheapest option)
const getData = async () => {
  console.log('Using static categories for build-time generation');
  return getStaticCategories();
};

const CategoryList = async () => {
  const data = await getData();
  // Static data returns array directly, no need to parse JSON
  const categories = Array.isArray(data) ? data : JSON.parse(data);
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
        {categories?.map((item) => (
          <Link 
            href={`/blog/category?cat=${item?.slug}`} 
            className={`${styles.category} ${styles[item.slug]}`}
            key={item.id || item._id}
          >
            {/* {item.img && (<Image 
              src={`/${item.img}`}
              alt="" width={32} 
              height={32} 
              className={styles.image}
            />)} */}
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryList