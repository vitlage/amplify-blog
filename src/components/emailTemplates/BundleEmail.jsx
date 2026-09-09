"use client";
import { useState } from "react";
import styles from "./bundleEmail.module.css";

export default function BundleEmail() {
  const [state, setState] = useState({
    cart: {
      basePrice: 50,
      discountPrice: 89,
      price: 50,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      color: "Stone",
      size: "8",
      frequency: "week",
      bundleOption: "1bag",
      bundleColor1: "beige",
      bundleColor2: "beige",
      offerUnlocked: false,
      upsellActive: false,
    },
    subscriptionState: {
      subscribed: false,
    },
  });

  const setCart = (patch) =>
    setState((s) => ({ ...s, cart: { ...s.cart, ...patch } }));
  const setSubscriptionState = (patch) =>
    setState((s) => ({
      ...s,
      subscriptionState: { ...s.subscriptionState, ...patch },
    }));

  const cx = (...names) =>
    names
      .filter(Boolean)
      .map((n) => styles[n] ?? n)
      .join(" ");

  const { cart, subscriptionState } = state;

  // Bundle option tap handlers (mirror AMP.setState payloads)
  const selectBundle1Bag = () =>
    setCart({
      basePrice: 50,
      discountPrice: 50,
      price: 50,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      bundleOption: "1bag",
    });

  const selectBundle2Bags = () =>
    setCart({
      basePrice: 100,
      discountPrice: 90,
      price: 90,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      bundleOption: "2bags",
    });

  const selectBundle2BagsClip = () =>
    setCart({
      basePrice: 130,
      discountPrice: 104,
      price: 104,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      bundleOption: "2bagsclip",
    });

  const setBundleColor1 = (color) => (e) => {
    e.stopPropagation();
    setCart({ bundleColor1: color });
  };

  const setBundleColor2 = (color) => (e) => {
    e.stopPropagation();
    setCart({ bundleColor2: color });
  };

  const toggleOffer = () =>
    setCart({
      basePrice: 99,
      discountPrice: 89,
      price: cart.offerUnlocked ? 99 : 89,
      baseShipping: 15,
      shipping: 15,
      upsellPrice: 25,
      color: "Stone",
      size: "8",
      offerUnlocked: !cart.offerUnlocked,
      upsellActive: false,
    });

  const toggleUpsell = () =>
    setCart({
      basePrice: 99,
      discountPrice: 89,
      price: cart.offerUnlocked ? 89 : 99,
      baseShipping: 15,
      shipping: !cart.upsellActive ? 0 : 15,
      upsellPrice: 25,
      upsellActive: !cart.upsellActive,
    });

  const handleCheckout = () => setSubscriptionState({ subscribed: true });

  // Determine which 2bags image to show based on color combo
  const showBag2Beige =
    cart.bundleColor1 === "beige" && cart.bundleColor2 === "beige";
  const showBag2BlackBeige =
    cart.bundleColor1 === "black" && cart.bundleColor2 === "beige";
  const showBag2BeigeBlack =
    cart.bundleColor1 === "beige" && cart.bundleColor2 === "black";
  const showBag2BlackBlack =
    cart.bundleColor1 === "black" && cart.bundleColor2 === "black";

  const swatch1BeigeStyle =
    cart.bundleColor1 === "beige"
      ? {
          background: "#E8D5C4",
          cursor: "pointer",
          border: "2px solid #111",
        }
      : {
          background: "#E8D5C4",
          cursor: "pointer",
          border: "1px solid rgba(0,0,0,0.1)",
        };

  const swatch1BlackStyle =
    cart.bundleColor1 === "black"
      ? {
          background: "#2C2C2C",
          cursor: "pointer",
          border: "2px solid #111",
        }
      : {
          background: "#2C2C2C",
          cursor: "pointer",
          border: "1px solid rgba(0,0,0,0.1)",
        };

  const giftCheckMascaraHidden = !(
    cart.bundleOption === "2bags" || cart.bundleOption === "2bagsclip"
  );
  const giftCheckEyelinerHidden = !(cart.bundleOption === "2bagsclip");

  return (
    <div className={styles.root}>
      <div style={{ padding: "20px" }}>
        <div className={cx("techCard")}>
          <div className={cx("cardHeader")}>
            <div className={cx("timerPill")}>
              <span>Reserved for you for 15 min</span>
            </div>
          </div>

          <div
            style={{ textAlign: "center", padding: "24px 32px 0" }}
            hidden={!!subscriptionState.subscribed}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 300,
                color: "#000000",
                margin: 0,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Build a bundle and save
            </p>
          </div>

          {/* Bundle Selection Block */}
          <div
            style={{ padding: "24px 12px 0" }}
            hidden={!!subscriptionState.subscribed}
          >
            {/* Option 1: 1 Bag */}
            <div
              className={cx(
                "bundleOption",
                cart.bundleOption === "1bag" && "selected"
              )}
              onClick={selectBundle1Bag}
            >
              <div className={cx("bundleRadio")}></div>
              <img
                src="/photos_of_products_in_amp/1.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
              />
              <div className={cx("bundleDetails")}>
                <div className={cx("bundleTitle")}>1 Bag</div>
              </div>
              <div className={cx("bundlePrice")}>
                <span className={cx("bundlePriceCurrent")}>$50.00</span>
              </div>
            </div>

            {/* Option 2: 2 Bags (Most Popular) */}
            <div
              className={cx(
                "bundleOption",
                cart.bundleOption === "2bags" && "selected"
              )}
              onClick={selectBundle2Bags}
              style={{ position: "relative" }}
            >
              <div className={cx("bundlePopular")}>Most popular</div>
              <div className={cx("bundleRadio")}></div>

              {/* Dynamic images based on color selection */}
              <img
                src="/photos_of_products_in_amp/1.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
                hidden={!showBag2Beige}
              />
              <img
                src="/photos_of_products_in_amp/2.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
                hidden={!showBag2BlackBeige}
              />
              <img
                src="/photos_of_products_in_amp/3.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
                hidden={!showBag2BeigeBlack}
              />
              <img
                src="/photos_of_products_in_amp/2.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
                hidden={!showBag2BlackBlack}
              />

              <div className={cx("bundleDetails")}>
                <div className={cx("bundleTitle")}>
                  2 Bags
                  <span className={cx("bundleBadge")}>-10%</span>
                </div>
                <div className={cx("bundleColors")}>
                  <span className={cx("bundleColorLabel")}>Color #1</span>
                  <div
                    className={cx("bundleColorSwatch")}
                    style={swatch1BeigeStyle}
                    onClick={setBundleColor1("beige")}
                  ></div>
                  <div
                    className={cx("bundleColorSwatch")}
                    style={swatch1BlackStyle}
                    onClick={setBundleColor1("black")}
                  ></div>
                </div>
              </div>
              <div className={cx("bundlePrice")}>
                <span className={cx("bundlePriceCurrent")}>$90.00</span>
                <span className={cx("bundlePriceOriginal")}>$100.00</span>
              </div>
            </div>

            {/* Option 3: 2 Bags + Clip */}
            <div
              className={cx(
                "bundleOption",
                cart.bundleOption === "2bagsclip" && "selected"
              )}
              onClick={selectBundle2BagsClip}
            >
              <div className={cx("bundleRadio")}></div>
              <img
                src="/photos_of_products_in_amp/3.webp"
                width="60"
                height="60"
                alt=""
                loading="lazy"
                className={cx("bundleImage")}
              />
              <div className={cx("bundleDetails")}>
                <div className={cx("bundleTitle")}>
                  2 Bags + Clip
                  <span className={cx("bundleBadge")}>-20%</span>
                </div>
              </div>
              <div className={cx("bundlePrice")}>
                <span className={cx("bundlePriceCurrent")}>$104.00</span>
                <span className={cx("bundlePriceOriginal")}>$130.00</span>
              </div>
            </div>

            {/* Free Gifts Section */}
            <div className={cx("bundleGiftSection")}>
              <div className={cx("bundleGiftTitle")}>
                Unlock free gifts with your bundles 🎁
              </div>
              <div className={cx("bundleGifts")}>
                <div className={cx("bundleGiftItem")}>
                  <div
                    className={cx("bundleGiftBox")}
                    style={{ background: "#E8D5C4" }}
                  >
                    <span style={{ fontSize: "40px" }}>💄</span>
                    <div className={cx("bundleGiftCheck")}>✓</div>
                  </div>
                  <div className={cx("bundleGiftPrice")}>
                    $0.00{" "}
                    <span style={{ textDecoration: "line-through" }}>
                      $10.00
                    </span>
                  </div>
                  <div className={cx("bundleGiftName")}>Lipstick</div>
                </div>
                <div className={cx("bundleGiftItem")}>
                  <div
                    className={cx("bundleGiftBox")}
                    style={{ background: "#E8D5C4" }}
                  >
                    <span style={{ fontSize: "40px" }}>🖌️</span>
                    <div
                      className={cx("bundleGiftCheck")}
                      hidden={!!giftCheckMascaraHidden}
                    >
                      ✓
                    </div>
                  </div>
                  <div className={cx("bundleGiftPrice")}>
                    $0.00{" "}
                    <span style={{ textDecoration: "line-through" }}>
                      $10.00
                    </span>
                  </div>
                  <div className={cx("bundleGiftName")}>Mascara</div>
                </div>
                <div className={cx("bundleGiftItem")}>
                  <div
                    className={cx("bundleGiftBox")}
                    style={{ background: "#E5E7EB" }}
                  >
                    <span style={{ fontSize: "40px" }}>🎁</span>
                    <div
                      className={cx("bundleGiftCheck")}
                      hidden={!!giftCheckEyelinerHidden}
                    >
                      ✓
                    </div>
                  </div>
                  <div className={cx("bundleGiftPrice")}>
                    $0.00{" "}
                    <span style={{ textDecoration: "line-through" }}>
                      $10.00
                    </span>
                  </div>
                  <div className={cx("bundleGiftName")}>Eyeliner</div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("productDetails")}>
            <div hidden={!!subscriptionState.subscribed}>
              {/* DISCOUNT_BLOCK (hidden in source via style="display:none") */}
              <div
                className={cx("smartOfferCard", cart.offerUnlocked && "active")}
                style={{ display: "none" }}
                onClick={toggleOffer}
              >
                <div className={cx("offerIcon")}>
                  <span>{cart.offerUnlocked ? "⚡️" : "🔒"}</span>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#111",
                      marginBottom: "2px",
                    }}
                  >
                    <span>
                      {cart.offerUnlocked
                        ? "Private Deal Applied"
                        : "Is price holding you back?"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    <span hidden={!!cart.offerUnlocked}>
                      Tap to unlock exclusive cart benefit.
                    </span>
                    <span
                      hidden={!cart.offerUnlocked}
                      style={{ color: "#059669", fontWeight: 600 }}
                    >
                      -10% OFF Price Unlocked!
                    </span>
                  </div>
                </div>
              </div>

              {/* UPSELL_BLOCK (hidden in source via style="display:none") */}
              <div
                className={cx("upsellContainer")}
                style={{ display: "none" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    src="/photos_of_products_in_amp/2.webp"
                    width="48"
                    height="48"
                    alt=""
                    loading="lazy"
                    style={{ borderRadius: "8px", background: "#eee" }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Add Gift Packaging
                      <span
                        className={cx("freeShippingTag")}
                        hidden={!!cart.upsellActive}
                      >
                        GET FREE SHIPPING
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      +$25.00{" "}
                      <span hidden={!!cart.upsellActive}>
                        (Waives shipping fee)
                      </span>
                      <span
                        hidden={!cart.upsellActive}
                        style={{ color: "#059669", fontWeight: 600 }}
                      >
                        ✓ Shipping Waived
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={cx("toggle", cart.upsellActive && "active")}
                  onClick={toggleUpsell}
                >
                  <div className={cx("toggleKnob")}></div>
                </div>
              </div>
            </div>

            <div
              hidden={!subscriptionState.subscribed}
              style={{ textAlign: "center", padding: "60px 20px" }}
            >
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 300,
                  color: "#000000",
                  margin: 0,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Bundle purchased successfully
              </p>
            </div>

            <div
              className={cx("footerPanel")}
              hidden={!!subscriptionState.subscribed}
            >
              <div className={cx("mathRow")}>
                <span>Subtotal</span>
                <span>
                  $<span>{cart.price}</span>
                </span>
              </div>
              <div className={cx("mathRow")} hidden={!cart.upsellActive}>
                <span>Gift Packaging</span>
                <span>+$25</span>
              </div>
              <div className={cx("mathRow")}>
                <span>Shipping</span>
                <span
                  className={cx(cart.shipping === 0 && "greenText")}
                  style={{ fontWeight: 500 }}
                >
                  <span>
                    {cart.shipping === 0 ? "FREE" : "$" + cart.shipping}
                  </span>
                </span>
              </div>
              <div className={cx("totalRow")}>
                <span>Total</span>
                <span>
                  $
                  <span>
                    {cart.price +
                      (cart.upsellActive ? cart.upsellPrice : 0) +
                      cart.shipping}
                  </span>
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  className={cx("checkoutBtn")}
                  style={{ padding: "22px 32px", width: "auto" }}
                  onClick={handleCheckout}
                  type="button"
                >
                  Buy bundle
                </button>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "16px",
                  fontSize: "11px",
                  color: "#9CA3AF",
                }}
              >
                Processed via Shopify Secure Checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
