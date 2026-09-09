"use client";

import { useState } from "react";
import styles from "./abandonedCartEmail.module.css";

const cx = (...names) =>
  names
    .filter(Boolean)
    .map((n) => styles[n] ?? n)
    .join(" ");

const COLORS = [
  { name: "Stone", style: { background: "#B8B0A2" } },
  { name: "White", style: { background: "#FFFFFF", border: "1px solid #E5E7EB" } },
  { name: "Black", style: { background: "#000000" } },
];

const SIZES = ["6", "7", "8", "9", "10"];

const COLOR_IMG = {
  Stone: "/photos_of_products_in_amp/1.webp",
  White: "/photos_of_products_in_amp/2.webp",
  Black: "/photos_of_products_in_amp/3.webp",
};

export default function AbandonedCartEmail() {
  const [state, setState] = useState({
    cart: {
      basePrice: 99,
      discountPrice: 89,
      price: 99,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      color: "Stone",
      size: "8",
      offerUnlocked: false,
      upsellActive: false,
    },
  });

  const cart = state.cart;

  const updateCart = (patch) =>
    setState((s) => ({ ...s, cart: { ...s.cart, ...patch } }));

  const selectColor = (color) => updateCart({ color });
  const selectSize = (size) => updateCart({ size });

  const toggleOffer = () => {
    const nextUnlocked = !cart.offerUnlocked;
    updateCart({
      offerUnlocked: nextUnlocked,
      price: nextUnlocked ? cart.discountPrice : cart.basePrice,
    });
  };

  const toggleUpsell = () => {
    const nextActive = !cart.upsellActive;
    updateCart({
      upsellActive: nextActive,
      shipping: nextActive ? 0 : cart.baseShipping,
    });
  };

  const total = cart.price + (cart.upsellActive ? cart.upsellPrice : 0) + cart.shipping;

  return (
    <div className={styles.root}>
      <div className={styles.techCard}>
        <div className={styles.cardHeader}>
          <div className={styles.timerPill}>
            <span>Reserved for you for 15 min</span>
          </div>
        </div>

        <div className={styles.heroImageWrapper}>
          <img
            src={COLOR_IMG[cart.color] || COLOR_IMG.Stone}
            width="416"
            height="416"
            alt=""
            loading="lazy"
            className={styles.heroImg}
          />
        </div>

        <div className={styles.productDetails}>
          <div className={styles.titleBlock}>
            <h1 className={styles.productTitle}>
              New Balance Fresh Foam X 1080v14
            </h1>
            <div className={styles.priceRow}>
              {cart.offerUnlocked && (
                <span className={styles.strikePrice}>
                  ${cart.basePrice}
                </span>
              )}
              <span className={styles.priceMain}>${cart.price}</span>
            </div>
          </div>

          <div>
            <p className={styles.controlLabel}>Select Color</p>
            <div className={styles.swatchContainer}>
              {COLORS.map((c) => (
                <div
                  key={c.name}
                  className={cx(
                    "swatch",
                    cart.color === c.name && "swatchSelected"
                  )}
                  style={c.style}
                  onClick={() => selectColor(c.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectColor(c.name);
                    }
                  }}
                  aria-label={`Select color ${c.name}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className={styles.controlLabel}>Select Size</p>
            <div className={styles.sizeGrid}>
              {SIZES.map((s) => (
                <div
                  key={s}
                  className={cx(
                    "sizeBox",
                    cart.size === s && "sizeBoxSelected"
                  )}
                  onClick={() => selectSize(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectSize(s);
                    }
                  }}
                  aria-label={`Select size ${s}`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* DISCOUNT BLOCK */}
          <div
            className={cx(
              "smartOfferCard",
              cart.offerUnlocked && "smartOfferActive"
            )}
            onClick={toggleOffer}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleOffer();
              }
            }}
          >
            <div className={styles.offerIcon}>
              <span>{cart.offerUnlocked ? "⚡️" : "🔒"}</span>
            </div>
            <div>
              <div className={styles.offerTitle}>
                {cart.offerUnlocked
                  ? "Private Deal Applied"
                  : "Is price holding you back?"}
              </div>
              <div className={styles.offerSubtitle}>
                {cart.offerUnlocked ? (
                  <span className={styles.offerSuccess}>
                    -10% OFF Price Unlocked!
                  </span>
                ) : (
                  <span>Tap to unlock exclusive cart benefit.</span>
                )}
              </div>
            </div>
          </div>

          {/* UPSELL BLOCK */}
          <div className={styles.upsellContainer}>
            <div className={styles.upsellLeft}>
              <img
                src="/photos_of_products_in_amp/2.webp"
                width="48"
                height="48"
                alt=""
                loading="lazy"
                className={styles.upsellThumb}
              />
              <div>
                <div className={styles.upsellTitle}>
                  <span>Add Gift Packaging</span>
                  {!cart.upsellActive && (
                    <span className={styles.freeShippingTag}>
                      GET FREE SHIPPING
                    </span>
                  )}
                </div>
                <div className={styles.upsellSubtitle}>
                  +$25.00{" "}
                  {cart.upsellActive ? (
                    <span className={styles.offerSuccess}>
                      ✓ Shipping Waived
                    </span>
                  ) : (
                    <span>(Waives shipping fee)</span>
                  )}
                </div>
              </div>
            </div>
            <div
              className={cx("toggle", cart.upsellActive && "toggleActive")}
              onClick={toggleUpsell}
              role="button"
              tabIndex={0}
              aria-pressed={cart.upsellActive}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleUpsell();
                }
              }}
            >
              <div className={styles.toggleKnob} />
            </div>
          </div>

          <div className={styles.footerPanel}>
            <div className={styles.mathRow}>
              <span>Subtotal</span>
              <span>${cart.price}</span>
            </div>
            {cart.upsellActive && (
              <div className={styles.mathRow}>
                <span>Gift Packaging</span>
                <span>+$25</span>
              </div>
            )}
            <div className={styles.mathRow}>
              <span>Shipping</span>
              <span
                className={cx(
                  "shippingValue",
                  cart.shipping === 0 && "greenText"
                )}
              >
                {cart.shipping === 0 ? "FREE" : `$${cart.shipping}`}
              </span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${total}</span>
            </div>
            <div className={styles.checkoutWrap}>
              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={(e) => e.preventDefault()}
              >
                SECURE CHECKOUT
              </button>
            </div>
            <div className={styles.checkoutFootnote}>
              Processed via Shopify Secure Checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
