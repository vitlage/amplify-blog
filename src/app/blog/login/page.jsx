"use client";

import React from 'react'
import styles from './loginPage.module.css'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const {data, status} = useSession();
  const router = useRouter();

  if(status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }
  if(status === "authenticated") {
    router.push("/blog");
  }
  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            <div className={styles.socialButtons} onClick={() => signIn("google")}>
              Sign in with Google
            </div>
        </div>
    </div>
  )
}

export default LoginPage