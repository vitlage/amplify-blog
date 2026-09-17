"use client";

import styles from "./converticSpark.module.css";
import AbandonedCartEmail from "@/components/emailTemplates/AbandonedCartEmail";
import SubscriptionEmail from "@/components/emailTemplates/SubscriptionEmail";
import BundleEmail from "@/components/emailTemplates/BundleEmail";

const TEMPLATES = [
  { key: "abandoned", Component: AbandonedCartEmail },
  { key: "subscription", Component: SubscriptionEmail },
  { key: "bundle", Component: BundleEmail },
];

// Map the BidWinDeliver scroll stage to a template index.
// stage 0..1 (intro / Send.)    -> Abandoned Cart Recovery
// stage 2    (Engage.)          -> Subscription
// stage 3..4 (Convert. / out)   -> Bundle
function stageToIndex(stage) {
  if (stage >= 3) return 2;
  if (stage === 2) return 1;
  return 0;
}

export default function ConverticSpark({ stage = 0 }) {
  const activeIdx = stageToIndex(stage);

  return (
    <div className={styles.sparkApp}>
      <aside className={styles.sparkSidebar}>
        <iconify-icon icon="solar:pen-2-linear"></iconify-icon>
        <iconify-icon icon="solar:chat-round-line-linear"></iconify-icon>
        <iconify-icon icon="solar:folder-linear"></iconify-icon>
        <iconify-icon icon="solar:clock-circle-linear"></iconify-icon>
      </aside>

      <div className={styles.sparkMain}>
        <p className={styles.sparkSubhead}>Put Convertic Spark to work for you</p>

        <div className={styles.sparkInputWrap}>
          <div className={styles.sparkInputGlow} aria-hidden="true" />
          <div className={styles.sparkInput}>
            <span className={styles.plusIcon}>
              <iconify-icon icon="solar:add-circle-linear"></iconify-icon>
            </span>
            <span className={styles.placeholder}>Describe your task</span>
            <iconify-icon icon="solar:bell-linear" class={styles.bellIcon}></iconify-icon>
          </div>
        </div>

        <div className={styles.templateStage}>
          {TEMPLATES.map(({ key, Component }, i) => (
            <div
              key={key}
              className={`${styles.templateCard} ${i === activeIdx ? styles.templateCardActive : ""}`}
              aria-hidden={i !== activeIdx}
            >
              <div className={styles.templateInner}>
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
