"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  MdMenu,
  MdSearch,
  MdEdit,
  MdInbox,
  MdStarBorder,
  MdSend,
  MdDrafts,
  MdDeleteOutline,
  MdArrowBack,
} from "react-icons/md";
import TryItInInbox from "@/components/tryItInInbox/TryItInInbox";
import styles from "./landing.module.css";

function DesktopIcon() {
  return (
    <svg viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 2A4.5 4.5 0 0 0 0 6.5v18A4.5 4.5 0 0 0 4.5 29h25a4.5 4.5 0 0 0 4.5-4.5v-18A4.5 4.5 0 0 0 29.5 2zM3 6.5A1.5 1.5 0 0 1 4.5 5h25A1.5 1.5 0 0 1 31 6.5v18a1.5 1.5 0 0 1-1.5 1.5h-25A1.5 1.5 0 0 1 3 24.5zM8.5 31a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3h-17"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 1A4.5 4.5 0 0 0 0 5.5v25A4.5 4.5 0 0 0 4.5 35h15a4.5 4.5 0 0 0 4.5-4.5v-25A4.5 4.5 0 0 0 19.5 1zM3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v25a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 30.5zM9.5 26a1.5 1.5 0 0 0 0 3h5a1.5 1.5 0 0 0 0-3h-5"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Stable per-visit id so the dashboard can group a single session's events.
function getSessionId() {
  try {
    let id = sessionStorage.getItem("lead_sess");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("lead_sess", id);
    }
    return id;
  } catch {
    return "nosession";
  }
}

export default function LeadLandingClient({ lead }) {
  const emails = lead.emails || [];
  const [openIndex, setOpenIndex] = useState(null);
  const [readSet, setReadSet] = useState(() => new Set());
  const [sendKey, setSendKey] = useState(emails[0]?.key || "");
  const [viewMode, setViewMode] = useState("desktop");
  const iframeRef = useRef(null);
  const videoRef = useRef(null);

  const openKeyRef = useRef("");
  const openTracked = useRef(new Set());
  const ampListenerAttached = useRef(false);
  const resizeObsRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(560);
  const videoViewTracked = useRef(false);
  const videoPlayTracked = useRef(false);
  const videoSecondsRef = useRef(0);
  const videoVisibleRef = useRef(false);

  // --- internal (our own testing) traffic flag ------------------------------
  // ?test=1 sets a persistent localStorage flag so every event from this browser
  // is tagged internal in the DB (kept, just excluded from the dashboard by
  // default). ?test=0 clears it. Read into a ref so track() stays stable.
  const internalRef = useRef(false);
  const [internalMode, setInternalMode] = useState(false);
  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("test");
      if (param === "1") localStorage.setItem("convertic_internal", "true");
      else if (param === "0") localStorage.removeItem("convertic_internal");
      const on = localStorage.getItem("convertic_internal") === "true";
      internalRef.current = on;
      setInternalMode(on);
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

  // Copy the current URL WITHOUT the ?test flag — the clean link to share with a
  // real lead. Only surfaced in test mode.
  const [copiedReal, setCopiedReal] = useState(false);
  const copyRealUrl = () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("test");
      navigator.clipboard.writeText(u.toString());
      setCopiedReal(true);
      setTimeout(() => setCopiedReal(false), 1500);
    } catch {
      /* clipboard may be blocked */
    }
  };

  // --- tracking transport ---------------------------------------------------
  const track = useCallback(
    (type, meta) => {
      try {
        const payload = JSON.stringify({
          type,
          meta: meta || undefined,
          sessionId: getSessionId(),
          internal: internalRef.current,
        });
        const url = `/api/lead/${lead.token}/event`;
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon(
            url,
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        /* tracking must never break the page */
      }
    },
    [lead.token]
  );

  // --- page view + time on page --------------------------------------------
  useEffect(() => {
    track("page_view");
    const start = Date.now();

    const onLeave = () => {
      track("page_leave", { seconds: Math.round((Date.now() - start) / 1000) });
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [track]);

  // Disconnect any live iframe ResizeObserver on unmount.
  useEffect(() => {
    return () => {
      if (resizeObsRef.current) {
        try {
          resizeObsRef.current.disconnect();
        } catch {
          /* ignore */
        }
        resizeObsRef.current = null;
      }
    };
  }, []);

  // The iframe remounts on view-mode change (key includes viewMode). Reset the
  // instrument flag + height so onIframeLoad re-measures at the new width — the
  // responsive email is a different height on mobile vs desktop.
  useEffect(() => {
    ampListenerAttached.current = false;
    if (resizeObsRef.current) {
      try {
        resizeObsRef.current.disconnect();
      } catch {
        /* ignore */
      }
      resizeObsRef.current = null;
    }
    setFrameHeight(560);
  }, [viewMode]);

  // --- open one of the inbox emails ----------------------------------------
  const openEmail = (i) => {
    const email = emails[i];
    if (!email) return;
    setOpenIndex(i);
    setSendKey(email.key); // default the "send" picker to what they're viewing
    setReadSet((s) => {
      const next = new Set(s);
      next.add(i);
      return next;
    });
    openKeyRef.current = email.key;
    // Re-instrument the newly loaded iframe and reset its measured height.
    ampListenerAttached.current = false;
    if (resizeObsRef.current) {
      try {
        resizeObsRef.current.disconnect();
      } catch {
        /* ignore */
      }
      resizeObsRef.current = null;
    }
    setFrameHeight(560);
    if (!openTracked.current.has(email.key)) {
      openTracked.current.add(email.key);
      track("inbox_open", { template: email.key, subject: email.subject });
    }
  };

  const closeEmail = () => {
    setOpenIndex(null);
    ampListenerAttached.current = false;
    if (resizeObsRef.current) {
      try {
        resizeObsRef.current.disconnect();
      } catch {
        /* ignore */
      }
      resizeObsRef.current = null;
    }
  };

  // Attach a click listener inside the srcDoc iframe (same-origin) so every
  // click on an interactive element in the AMP email is captured.
  const onIframeLoad = () => {
    if (ampListenerAttached.current) return;
    const iframe = iframeRef.current;
    let doc;
    try {
      doc = iframe?.contentDocument;
    } catch {
      return; // cross-origin, cannot instrument
    }
    if (!doc) return;
    ampListenerAttached.current = true;
    doc.addEventListener(
      "click",
      (ev) => {
        const el =
          ev.target?.closest?.(
            "a,button,[role='button'],input,label,[on]"
          ) || ev.target;
        track("amp_click", {
          template: openKeyRef.current || null,
          tag: el?.tagName || "",
          text: (el?.textContent || "").trim().slice(0, 80),
          href: el?.getAttribute?.("href") || null,
          id: el?.id || null,
        });
      },
      true
    );

    // Size the iframe to its full content so nothing is clipped; the wrapper
    // (.mailBody) is the scroll container. AMP4EMAIL can lock scrollHeight to the
    // viewport, so measure the true content extent from the body's children's
    // bounding boxes (that reflects real layout regardless of the viewport lock).
    const measure = () => {
      try {
        const sc = doc.scrollingElement || doc.documentElement || doc.body;
        const scrolled = sc ? sc.scrollTop || 0 : 0;
        let bottom = 0;
        for (const el of doc.body ? doc.body.children : []) {
          const b = el.getBoundingClientRect().bottom + scrolled;
          if (b > bottom) bottom = b;
        }
        const fallback = Math.max(
          doc.body?.scrollHeight || 0,
          doc.documentElement?.scrollHeight || 0
        );
        const h = bottom > 200 ? bottom : fallback;
        if (h > 200 && h < 12000) setFrameHeight(Math.ceil(h) + 24);
      } catch {
        /* ignore */
      }
    };
    measure();
    try {
      const ro = new ResizeObserver(measure);
      ro.observe(doc.documentElement);
      if (doc.body) ro.observe(doc.body);
      resizeObsRef.current = ro;
    } catch {
      /* ResizeObserver unavailable — the delayed measures still run */
    }
    // The AMP runtime + images render async; re-measure a few times after load.
    [250, 700, 1500, 3000].forEach((ms) => setTimeout(measure, ms));

    // The email renders at full height; the page scrolls. A non-scrollable iframe
    // swallows wheel events (and some browsers won't chain them to the page), so
    // intercept them (non-passive, capture phase) and scroll the page manually —
    // preventDefault stops any native chaining so it never double-scrolls.
    doc.addEventListener(
      "wheel",
      (ev) => {
        ev.preventDefault();
        const step = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
        window.scrollBy(0, step);
      },
      { passive: false, capture: true }
    );
  };

  // --- video (Loom embed, coarse tracking) ----------------------------------
  useEffect(() => {
    if (!lead.videoUrl) return;
    const node = videoRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        videoVisibleRef.current = visible;
        if (visible && !videoViewTracked.current) {
          videoViewTracked.current = true;
          track("video_view");
        }
      },
      { threshold: 0.5 }
    );
    io.observe(node);

    // Accumulate "seconds the video was on screen" while the tab is focused.
    const tick = setInterval(() => {
      if (videoVisibleRef.current && !document.hidden) {
        videoSecondsRef.current += 1;
      }
    }, 1000);

    // Heuristic play signal: focus leaving the page while the video is on
    // screen usually means the user clicked into the Loom iframe to play it.
    const onBlur = () => {
      if (videoVisibleRef.current && !videoPlayTracked.current) {
        videoPlayTracked.current = true;
        track("video_play");
      }
    };
    window.addEventListener("blur", onBlur);

    // Flush accumulated watch time periodically and on unmount.
    const flush = setInterval(() => {
      if (videoSecondsRef.current > 0) {
        track("video_time", { seconds: videoSecondsRef.current });
      }
    }, 10000);

    return () => {
      io.disconnect();
      clearInterval(tick);
      clearInterval(flush);
      window.removeEventListener("blur", onBlur);
      if (videoSecondsRef.current > 0) {
        track("video_time", { seconds: videoSecondsRef.current });
      }
    };
  }, [lead.videoUrl, track]);

  const onEmailResult = (r) => {
    track("email_submit", {
      email: r.email || "",
      status: r.status || "",
      template: sendKey || null,
    });
  };

  // Use only the first name token (e.g. "Léo (Leo)" or "John Smith" -> first word).
  const firstNameOnly = (lead.firstName || "").split(/[\s(]/)[0].trim();
  const greetName = firstNameOnly ? `, ${firstNameOnly}` : "";

  return (
    <main className={styles.page}>
      <header
        className={styles.topbar}
        style={{
          position: "relative",
          ...(internalMode ? { background: "#FB923C", borderBottomColor: "#F97316" } : {}),
        }}
      >
        <a href="/" className={styles.logo}>
          <Image
            src="/logo-mark-universal.png"
            alt="Convertic"
            width={44}
            height={44}
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>
            Convertic<span className={styles.logoDot}>.</span>ai
          </span>
        </a>
        {internalMode && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              aria-label="Internal test mode active — events are excluded from analytics"
              style={{
                background: "#111",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "5px 10px",
                borderRadius: 999,
              }}
            >
              TEST MODE
            </span>
            <button
              type="button"
              onClick={copyRealUrl}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#111",
                background: "#fff",
                border: "1px solid #d7d9e2",
                borderRadius: 999,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {copiedReal ? "Copied ✓" : "Copy real URL"}
            </button>
          </div>
        )}
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Made just for you</p>
        <h1 className={styles.title}>
          Hi{greetName} <span aria-hidden>👋</span>
        </h1>
        <p className={styles.subtitle}>
          {lead.company
            ? `A quick, interactive look at what AMP email could do for ${lead.company}.`
            : "A quick, interactive look at what interactive AMP email can do."}{" "}
          Click into the inbox below and try it yourself.
        </p>
      </section>

      {/* Gmail emulation ---------------------------------------------------- */}
      <section className={styles.inboxSection}>
        <div className={styles.viewSwitch}>
          <button
            type="button"
            className={`${styles.viewBtn} ${
              viewMode === "desktop" ? styles.viewBtnActive : ""
            }`}
            onClick={() => setViewMode("desktop")}
            aria-label="Desktop view"
          >
            <DesktopIcon />
          </button>
          <button
            type="button"
            className={`${styles.viewBtn} ${
              viewMode === "mobile" ? styles.viewBtnActive : ""
            }`}
            onClick={() => setViewMode("mobile")}
            aria-label="Mobile view"
          >
            <MobileIcon />
          </button>
        </div>

        <div
          className={`${styles.inboxCard} ${
            viewMode === "mobile" ? styles.inboxCardMobile : ""
          }`}
        >
          {/* Gmail top bar */}
          <div className={styles.gmailTopbar}>
            <span className={styles.gmailMenu} aria-hidden>
              <MdMenu />
            </span>
            <span className={styles.gmailLogo}>
              <Image
                src="/gmail-logo.png"
                alt="Gmail"
                width={98}
                height={36}
                className={styles.gmailLogoImg}
                priority
              />
            </span>
            <span className={styles.gmailSearch}>
              <MdSearch />
              <span>Search mail</span>
            </span>
          </div>

          {/* Sidebar + message list */}
          <div className={styles.gmailBody}>
            <aside className={styles.gmailSidebar}>
              <span className={styles.composeBtn}>
                <MdEdit />
                Compose
              </span>
              <nav className={styles.sideNav}>
                <span
                  className={`${styles.sideItem} ${styles.sideItemActive}`}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onClick={closeEmail}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") closeEmail();
                  }}
                >
                  <MdInbox />
                  Inbox
                  {emails.length - readSet.size > 0 && (
                    <b>{emails.length - readSet.size}</b>
                  )}
                </span>
                <span className={styles.sideItem}>
                  <MdStarBorder />
                  Starred
                </span>
                <span className={styles.sideItem}>
                  <MdSend />
                  Sent
                </span>
                <span className={styles.sideItem}>
                  <MdDrafts />
                  Drafts
                </span>
                <span className={styles.sideItem}>
                  <MdDeleteOutline />
                  Trash
                </span>
              </nav>
            </aside>

            <div className={styles.gmailMain}>
              {openIndex === null ? (
                <div className={styles.mailList}>
                  {emails.map((email, i) => (
                    <button
                      key={email.key}
                      type="button"
                      className={`${styles.mailRow} ${
                        readSet.has(i) ? styles.mailRowRead : ""
                      }`}
                      onClick={() => openEmail(i)}
                    >
                      <span className={styles.avatar}>
                        {(email.sender || "S").trim().charAt(0).toUpperCase()}
                      </span>
                      <span className={styles.mailMeta}>
                        <span className={styles.mailSender}>{email.sender}</span>
                        <span className={styles.mailSubject}>{email.subject}</span>
                        <span className={styles.mailSnippet}>{email.snippet}</span>
                      </span>
                      <span className={styles.mailHint}>Click to open</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.mailDetail}>
                  <div className={styles.mailDetailBar}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={closeEmail}
                    >
                      <MdArrowBack />
                      <span>Back</span>
                    </button>
                    <span className={styles.detailSubject}>
                      {emails[openIndex]?.subject}
                    </span>
                  </div>
                  <div className={styles.mailBody}>
                    {emails[openIndex]?.html ? (
                      <iframe
                        ref={iframeRef}
                        key={`${emails[openIndex].key}-${viewMode}`}
                        className={styles.ampFrame}
                        title="AMP email preview"
                        srcDoc={emails[openIndex].html}
                        onLoad={onIframeLoad}
                        scrolling="no"
                        style={{ height: frameHeight }}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    ) : (
                      <div className={styles.emptyMail}>
                        This email has no preview content yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Loom video -------------------------------------------------------- */}
      {lead.videoUrl && (
        <section className={styles.videoSection} ref={videoRef}>
          <h2 className={styles.sectionHeading}>A short walkthrough for you</h2>
          <div className={styles.videoWrap}>
            <iframe
              className={styles.videoFrame}
              src={lead.videoUrl}
              title="Personalized walkthrough"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Send a real AMP email to yourself -------------------------------- */}
      <section className={styles.trySection}>
        <div className={styles.tryInner}>
          <h2 className={styles.sendHeading}>Send it to your own inbox</h2>
          <p className={styles.sendSub}>
            Feel it in your real inbox — drop your email and this exact experience
            lands there in minutes
          </p>
          <div className={styles.sendPicker}>
            {emails.map((email) => (
              <button
                key={email.key}
                type="button"
                className={`${styles.sendChip} ${
                  sendKey === email.key ? styles.sendChipActive : ""
                }`}
                onClick={() => setSendKey(email.key)}
              >
                {email.label || email.subject}
              </button>
            ))}
          </div>
          <TryItInInbox
            showTemplateOptions={false}
            showHeading={false}
            mode="lead"
            token={lead.token}
            templateKey={sendKey}
            onResult={onEmailResult}
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Powered by Convertic</span>
      </footer>
    </main>
  );
}
