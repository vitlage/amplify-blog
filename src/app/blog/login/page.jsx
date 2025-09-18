"use client";

import React from 'react'
import styles from './loginPage.module.css'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage = () => {
  const {data, status} = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if(status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }
  if(status === "authenticated") {
    router.push("/blog");
  }
  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            {error && (
              <div className={styles.error}>
                <p>Authentication Error: {error}</p>
                <p>Please try again or contact support if the issue persists.</p>
              </div>
            )}
            <div className={styles.socialButtons} onClick={() => signIn("google")}>
              Sign in with Google
            </div>
        </div>
    </div>
  )
}

export default LoginPage