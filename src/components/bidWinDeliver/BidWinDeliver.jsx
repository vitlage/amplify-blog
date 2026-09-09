"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./bidWinDeliver.module.css";
import ConverticSpark from "@/components/converticSpark/ConverticSpark";

export default function BidWinDeliver() {
  const wrapRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      if (p < 0.30) setStage(0);
      else if (p < 0.47) setStage(1);
      else if (p < 0.62) setStage(2);
      else if (p < 0.95) setStage(3);
      else setStage(4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stage3Span = 0.95 - 0.62;
  const stage3Progress = Math.min(Math.max((progress - 0.62) / stage3Span, 0), 1);
  const growEnd = 0.3;
  const holdEnd = 0.65;
  let confirmScale;
  if (stage3Progress < growEnd) {
    confirmScale = 0.75 + (1.08 - 0.75) * (stage3Progress / growEnd);
  } else if (stage3Progress < holdEnd) {
    confirmScale = 1.08;
  } else {
    confirmScale = 1.08 - (1.08 - 0.72) * ((stage3Progress - holdEnd) / (1 - holdEnd));
  }
  const phoneShrink = Math.min(Math.max((progress - 0.91) / 0.04, 0), 1);
  const phoneScale = 1 - phoneShrink * 0.4;

  return (
    <section className={styles.showcase} ref={wrapRef}>
      <div className={styles.showcaseSticky}>
        <span
          className={`${styles.showcaseWord} ${styles.showcaseWordLeft} ${stage >= 1 && stage < 4 ? styles.showcaseWordVisible : ""}`}
        >
          Send.
        </span>

        <span
          className={`${styles.showcaseWord} ${styles.showcaseWordRight} ${stage >= 2 && stage < 4 ? styles.showcaseWordVisible : ""}`}
        >
          Engage.
        </span>

        <span
          className={`${styles.showcaseWord} ${styles.showcaseWordBottom} ${stage === 3 ? styles.showcaseWordVisible : ""}`}
        >
          Convert.
        </span>

        <ConverticSpark stage={stage} />
      </div>
    </section>
  );
}
