import React from 'react'
import styles from './blogPage.module.css'
import CardList from '@/components/cardList/CardList'
import Menu from '@/components/Menu/Menu'

const CategoryPage = ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat}</h1>
        <div className={styles.content}>
            <CardList page={page} cat={cat} />
            <Menu />
        </div>
    </div>
  )
}

export default CategoryPage