"use client";

import { useState } from "react";
import styles from "./subscriptionEmail.module.css";

export default function SubscriptionEmail() {
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
      frequency: "week",
      offerUnlocked: false,
      upsellActive: false,
    },
    subscriptionState: {
      subscribed: false,
    },
    sub: {
      portalOpen: false,
      frequency: "month",
      paused: false,
      skipped: false,
      addressSaved: false,
      freqSaved: false,
      added: { p1: false, p2: false, p3: false },
      cancelConfirming: false,
      canceled: false,
    },
  });

  const setCart = (patch) =>
    setState((s) => ({ ...s, cart: { ...s.cart, ...patch } }));
  const setSub = (patch) =>
    setState((s) => ({ ...s, sub: { ...s.sub, ...patch } }));
  const setSubscriptionState = (patch) =>
    setState((s) => ({
      ...s,
      subscriptionState: { ...s.subscriptionState, ...patch },
    }));

  const cx = (...names) =>
    names.filter(Boolean).map((n) => styles[n] ?? n).join(" ");

  const { cart, subscriptionState, sub } = state;

  const freqText =
    sub.frequency === "week"
      ? "week"
      : sub.frequency === "2weeks"
      ? "2 weeks"
      : sub.frequency === "month"
      ? "month"
      : "2 months";

  return (
    <div className={styles.root}>
      <div style={{ padding: "20px" }}>
        <div className={cx("techCard")}>
          <div className={cx("cardHeader")}>
            <div className={cx("timerPill")}>
              <span>Reserved for you for 15 min</span>
            </div>
          </div>

          <div className={cx("heroImageWrapper")}>
            <img
              src="/photos_of_products_in_amp/1.webp"
              width="416"
              height="416"
              className={cx("heroImg")}
              alt=""
              hidden={cart.color !== "Stone"}
            />
            <img
              src="/photos_of_products_in_amp/2.webp"
              width="416"
              height="416"
              className={cx("heroImg")}
              alt=""
              loading="lazy"
              hidden={cart.color !== "White"}
            />
            <img
              src="/photos_of_products_in_amp/3.webp"
              width="416"
              height="416"
              className={cx("heroImg")}
              alt=""
              loading="lazy"
              hidden={cart.color !== "Black"}
            />
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
              Subscribe and Save
            </p>
          </div>

          <div className={cx("productDetails")}>
            <div hidden={!!subscriptionState.subscribed}>
              <div style={{ marginBottom: "32px", textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <h1
                    className={cx("productTitle")}
                    style={{
                      fontSize: "24px",
                      fontWeight: 300,
                      color: "#000000",
                      margin: 0,
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    Save 20% every delivery:
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 300,
                        color: "#d1d5db",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        textDecoration: "line-through",
                      }}
                    >
                      $119
                    </span>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 300,
                        color: "#111",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      ${cart.price}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className={cx("controlLabel")}>Deliver every:</p>
                <div className={cx("sizeGrid")}>
                  <div
                    className={cx(
                      "sizeBox",
                      cart.frequency === "week" && "selected"
                    )}
                    onClick={() => setCart({ frequency: "week" })}
                  >
                    Week
                  </div>
                  <div
                    className={cx(
                      "sizeBox",
                      cart.frequency === "2weeks" && "selected"
                    )}
                    onClick={() => setCart({ frequency: "2weeks" })}
                  >
                    Second week
                  </div>
                  <div
                    className={cx(
                      "sizeBox",
                      cart.frequency === "month" && "selected"
                    )}
                    onClick={() => setCart({ frequency: "month" })}
                  >
                    Month
                  </div>
                  <div
                    className={cx(
                      "sizeBox",
                      cart.frequency === "2months" && "selected"
                    )}
                    onClick={() => setCart({ frequency: "2months" })}
                  >
                    Two months
                  </div>
                </div>
              </div>

              {/* DISCOUNT_BLOCK */}
              <div
                className={cx("smartOfferCard", cart.offerUnlocked && "active")}
                onClick={() =>
                  setCart({
                    price: cart.offerUnlocked ? 99 : 89,
                    offerUnlocked: !cart.offerUnlocked,
                    upsellActive: false,
                    shipping: 15,
                  })
                }
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
                    {!cart.offerUnlocked && (
                      <span>Tap to unlock exclusive cart benefit.</span>
                    )}
                    {cart.offerUnlocked && (
                      <span style={{ color: "#059669", fontWeight: 600 }}>
                        -10% OFF Price Unlocked!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* UPSELL_BLOCK */}
              <div className={cx("upsellContainer")}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <img
                    src="/photos_of_products_in_amp/2.webp"
                    className={cx("upsellThumb")}
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
                      {!cart.upsellActive && (
                        <span className={cx("freeShippingTag")}>
                          GET FREE SHIPPING
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      +$25.00{" "}
                      {!cart.upsellActive && (
                        <span>(Waives shipping fee)</span>
                      )}
                      {cart.upsellActive && (
                        <span style={{ color: "#059669", fontWeight: 600 }}>
                          ✓ Shipping Waived
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={cx("toggle", cart.upsellActive && "active")}
                  onClick={() =>
                    setCart({
                      shipping: !cart.upsellActive ? 0 : 15,
                      upsellActive: !cart.upsellActive,
                    })
                  }
                >
                  <div className={cx("toggleKnob")}></div>
                </div>
              </div>
            </div>

            {subscriptionState.subscribed && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
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
                  Subscribed successfully
                </p>
              </div>
            )}

            <div
              className={cx("footerPanel")}
              hidden={!!subscriptionState.subscribed}
            >
              <div className={cx("mathRow")}>
                <span>Subtotal</span>
                <span>${cart.price}</span>
              </div>
              {cart.upsellActive && (
                <div className={cx("mathRow")}>
                  <span>Gift Packaging</span>
                  <span>+$25</span>
                </div>
              )}
              <div className={cx("mathRow")}>
                <span>Shipping</span>
                <span
                  className={cx(cart.shipping === 0 && "greenText")}
                  style={{ fontWeight: 500 }}
                >
                  <span>
                    {cart.shipping === 0 ? "FREE" : `$${cart.shipping}`}
                  </span>
                </span>
              </div>
              <div className={cx("totalRow")}>
                <span>Total</span>
                <span>
                  $
                  {cart.price +
                    (cart.upsellActive ? cart.upsellPrice : 0) +
                    cart.shipping}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  className={cx("checkoutBtn")}
                  style={{ padding: "22px 32px", width: "auto" }}
                  onClick={() => setSubscriptionState({ subscribed: true })}
                >
                  Subscribe
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

          {/* ===== Manage subscription section ===== */}
          <div hidden={!!sub.canceled}>
            <div className={cx("manageHeader")}>
              <div className={cx("statusPill", sub.paused && "paused")}>
                <span>{sub.paused ? "Paused" : "Active"}</span>
              </div>
            </div>

            <div className={cx("manageHero")}>
              <p className={cx("manageHeroTitle")}>Your subscription</p>
              <p className={cx("manageHeroSub")}>
                Manage in one tap - no login needed.
              </p>
            </div>

            <div className={cx("subCardWrap")}>
              <div className={cx("subCard")}>
                <img
                  src="/photos_of_products_in_amp/1.webp"
                  width="72"
                  height="72"
                  className={cx("subCardImg")}
                  alt=""
                  loading="lazy"
                />
                <div className={cx("subCardBody")}>
                  <p className={cx("subCardName")}>Daily Defense Serum</p>
                  <p className={cx("subCardMeta")}>
                    Every <span>{freqText}</span> · $99
                  </p>
                  <p className={cx("subCardNext")}>
                    {sub.paused
                      ? "Paused - resume anytime"
                      : sub.skipped
                      ? "Next delivery: Thu, Jun 21"
                      : "Next delivery: Thu, May 21"}
                  </p>
                </div>
              </div>
            </div>

            <div className={cx("primaryCtaWrap")}>
              <button
                className={cx("outlineBtn")}
                onClick={() =>
                  setSub({
                    portalOpen: !sub.portalOpen,
                    cancelConfirming: false,
                  })
                }
              >
                {sub.portalOpen ? "Close" : "Manage your subscription"}
              </button>
            </div>

            {/* ===== Portal ===== */}
            {sub.portalOpen && (
              <div className={cx("portal")}>
                {/* Quick actions */}
                <div className={cx("portalSection")}>
                  <p className={cx("portalLabel")}>Quick actions</p>
                  <div className={cx("actionRow")}>
                    <button
                      className={cx("actionBtn", sub.skipped && "done")}
                      onClick={() =>
                        setSub({
                          skipped: !sub.skipped,
                          cancelConfirming: false,
                        })
                      }
                    >
                      <span className={cx("actionIcon")}>
                        {sub.skipped ? "✓" : "⏭"}
                      </span>
                      <span>
                        {sub.skipped
                          ? "Skipped to Jun 21"
                          : "Skip next delivery"}
                      </span>
                    </button>

                    <button
                      className={cx("actionBtn", sub.paused && "active")}
                      onClick={() =>
                        setSub({
                          paused: !sub.paused,
                          cancelConfirming: false,
                        })
                      }
                    >
                      <span className={cx("actionIcon")}>
                        {sub.paused ? "▶" : "⏸"}
                      </span>
                      <span>{sub.paused ? "Resume" : "Pause subscription"}</span>
                    </button>
                  </div>
                </div>

                {/* Delivery frequency */}
                <div className={cx("portalSection")}>
                  <p className={cx("portalLabel")}>Delivery frequency</p>
                  <div className={cx("freqGrid")}>
                    <div
                      className={cx(
                        "freqPill",
                        sub.frequency === "week" && "selected"
                      )}
                      onClick={() =>
                        setSub({
                          frequency: "week",
                          freqSaved: true,
                          cancelConfirming: false,
                        })
                      }
                    >
                      Week
                    </div>
                    <div
                      className={cx(
                        "freqPill",
                        sub.frequency === "2weeks" && "selected"
                      )}
                      onClick={() =>
                        setSub({
                          frequency: "2weeks",
                          freqSaved: true,
                          cancelConfirming: false,
                        })
                      }
                    >
                      2 weeks
                    </div>
                    <div
                      className={cx(
                        "freqPill",
                        sub.frequency === "month" && "selected"
                      )}
                      onClick={() =>
                        setSub({
                          frequency: "month",
                          freqSaved: true,
                          cancelConfirming: false,
                        })
                      }
                    >
                      Month
                    </div>
                    <div
                      className={cx(
                        "freqPill",
                        sub.frequency === "2months" && "selected"
                      )}
                      onClick={() =>
                        setSub({
                          frequency: "2months",
                          freqSaved: true,
                          cancelConfirming: false,
                        })
                      }
                    >
                      2 months
                    </div>
                  </div>
                  {sub.freqSaved && (
                    <div className={cx("feedback")}>
                      ✓ Frequency updated - your next delivery reflects this
                      change.
                    </div>
                  )}
                </div>

                {/* Shipping address */}
                <div className={cx("portalSection")}>
                  <p className={cx("portalLabel")}>Shipping address</p>
                  <div className={cx("addressRow")}>
                    <input
                      type="text"
                      name="address"
                      className={cx("addressInput")}
                      defaultValue="123 Main St, Brooklyn NY 11201"
                    />
                    <button
                      className={cx("updateBtn")}
                      onClick={() =>
                        setSub({
                          addressSaved: true,
                          cancelConfirming: false,
                        })
                      }
                    >
                      Update
                    </button>
                  </div>
                  {sub.addressSaved && (
                    <div className={cx("feedback")}>
                      ✓ Address saved for your next delivery.
                    </div>
                  )}
                </div>

                {/* Add to next delivery */}
                <div className={cx("portalSection")}>
                  <p className={cx("portalLabel")}>Add to your next delivery</p>
                  <div className={cx("upsellGrid")}>
                    <div
                      className={cx("upsellCard", sub.added.p1 && "added")}
                    >
                      <img
                        src="/photos_of_products_in_amp/2.webp"
                        width="72"
                        height="72"
                        className={cx("upsellImg")}
                        alt=""
                        loading="lazy"
                      />
                      <div className={cx("upsellName")}>Vitamin C Boost</div>
                      <div className={cx("upsellPrice")}>$28</div>
                      <button
                        className={cx("upsellAdd", sub.added.p1 && "added")}
                        onClick={() =>
                          setSub({
                            added: { ...sub.added, p1: !sub.added.p1 },
                            cancelConfirming: false,
                          })
                        }
                      >
                        {sub.added.p1 ? "✓ Added" : "+ Add"}
                      </button>
                    </div>

                    <div
                      className={cx("upsellCard", sub.added.p2 && "added")}
                    >
                      <img
                        src="/photos_of_products_in_amp/3.webp"
                        width="72"
                        height="72"
                        className={cx("upsellImg")}
                        alt=""
                        loading="lazy"
                      />
                      <div className={cx("upsellName")}>Eye Cream</div>
                      <div className={cx("upsellPrice")}>$42</div>
                      <button
                        className={cx("upsellAdd", sub.added.p2 && "added")}
                        onClick={() =>
                          setSub({
                            added: { ...sub.added, p2: !sub.added.p2 },
                            cancelConfirming: false,
                          })
                        }
                      >
                        {sub.added.p2 ? "✓ Added" : "+ Add"}
                      </button>
                    </div>

                    <div
                      className={cx("upsellCard", sub.added.p3 && "added")}
                    >
                      <img
                        src="/photos_of_products_in_amp/1.webp"
                        width="72"
                        height="72"
                        className={cx("upsellImg")}
                        alt=""
                        loading="lazy"
                      />
                      <div className={cx("upsellName")}>Daily SPF 50</div>
                      <div className={cx("upsellPrice")}>$32</div>
                      <button
                        className={cx("upsellAdd", sub.added.p3 && "added")}
                        onClick={() =>
                          setSub({
                            added: { ...sub.added, p3: !sub.added.p3 },
                            cancelConfirming: false,
                          })
                        }
                      >
                        {sub.added.p3 ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cancel section */}
                <div className={cx("portalSection")}>
                  {!sub.cancelConfirming && (
                    <div
                      className={cx("cancelLink")}
                      onClick={() => setSub({ cancelConfirming: true })}
                    >
                      Cancel subscription
                    </div>
                  )}

                  {sub.cancelConfirming && (
                    <div className={cx("cancelConfirm")}>
                      <p className={cx("cancelConfirmTitle")}>
                        Cancel your subscription?
                      </p>
                      <p className={cx("cancelConfirmSub")}>
                        You&apos;ll lose your 20% discount and your next
                        delivery on May 21 will not ship.
                      </p>
                      <div className={cx("cancelConfirmActions")}>
                        <button
                          className={cx("keepBtn")}
                          onClick={() => setSub({ cancelConfirming: false })}
                        >
                          Keep subscription
                        </button>
                        <button
                          className={cx("cancelAnywayBtn")}
                          onClick={() =>
                            setSub({
                              cancelConfirming: false,
                              canceled: true,
                            })
                          }
                        >
                          Cancel anyway
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===== Canceled state ===== */}
          {sub.canceled && (
            <div className={cx("canceledPanel")}>
              <div className={cx("manageHeader")}>
                <div className={cx("statusPill", "canceled")}>Canceled</div>
              </div>
              <p className={cx("canceledTitle")}>Subscription canceled</p>
              <p className={cx("canceledSub")}>
                Sorry to see you go. You&apos;ll receive a confirmation email
                shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
