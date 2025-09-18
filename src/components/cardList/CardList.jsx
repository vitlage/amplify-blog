import React from 'react'
import styles from './cardList.module.css'
import Pagination from '../pagination/Pagination'
import Image from 'next/image'
import Card from '../card/Card'
import { getStaticPosts } from '@/lib/staticData'

// Use static data for build-time generation (cheapest option)
const getData = async (page, cat) => {
  // Always use static data for static export - cheapest option
  console.log('Using static data for build-time generation');
  return getStaticPosts(page, cat);
};

const CardList = async ({ page, cat }) => {
  console.log('CardList - page:', page, 'cat:', cat);
  const {posts, count} = await getData(page, cat);
  const POST_PER_PAGE = 5;
  const hasPrev = POST_PER_PAGE * (page-1) > 0;
  const hasNext = POST_PER_PAGE * (page-1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item._id}/>
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} cat={cat}/>
    </div>
  )
}

export default CardList