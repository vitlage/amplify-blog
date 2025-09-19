"use client";

import React from 'react'
import styles from './pagination.module.css'
import { useRouter } from 'next/navigation';

const Pagination = ({ page, hasPrev, hasNext, cat }) => {
  const router = useRouter();

  const buildUrl = (newPage) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (cat) {
      params.set('cat', cat);
    }
    return `?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => router.push(buildUrl(page - 1))}
      >
        Previous
      </button>
      <button 
        className={styles.button}
        disabled={!hasNext}
        onClick={() => router.push(buildUrl(page + 1))}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination