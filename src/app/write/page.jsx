"use client";

import React, { useEffect, useState } from 'react';
import styles from './writePage.module.css';
import Image from 'next/image';
import "react-quill/dist/quill.bubble.css"
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const WritePage = () => {
  const { status } = useSession();
  const ReactQuill = dynamic(() => import('react-quill', {ssr: false}));
  const router = useRouter();
  
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const upload = () => {
      setMedia("downloadUrl to paste here");
    };
    file && upload();
  }, [file]);

  if(status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }

  if(status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) => 
    str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSlug: "food",
        // cat: "coding",
      })
    })

    console.log("response is: ", res);
  };
  
  return (
    <div className={styles.container}>
      <input 
        type="text"
        placeholder='Title'
        className={styles.input}
        onChange={e => setTitle(e.target.value)}
      />
      <input type="text"
        className={styles.category}
        placeholder='Category'
      />
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={e => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
              <button className={styles.addButton}>
                <label htmlFor="image">
                    <Image src="/image.png" alt="" width={16} height={16} />
                </label>
              </button>
            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill 
          className={styles.textArea}
          theme="bubble" 
          value={value} 
          onChange={setValue} 
          placeholder='Tell your story...' 
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>Publish</button>
    </div>
  )
}

export default WritePage