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
  const [inboxOpen, setInboxOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const iframeRef = useRef(null);
  const videoRef = useRef(null);

  const inboxTracked = useRef(false);
  const ampListenerAttached = useRef(false);
  const videoViewTracked = useRef(false);
  const videoPlayTracked = useRef(false);
  const videoSecondsRef = useRef(0);
  const videoVisibleRef = useRef(false);

  // --- tracking transport ---------------------------------------------------
  const track = useCallback(
    (type, meta) => {
      try {
        const payload = JSON.stringify({
          type,
          meta: meta || undefined,
          sessionId: getSessionId(),
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

  // --- open the inbox email -------------------------------------------------
  const openInbox = () => {
    setInboxOpen(true);
    setRead(true);
    if (!inboxTracked.current) {
      inboxTracked.current = true;
      track("inbox_open", { subject: lead.subjectLine });
    }
  };

  const closeInbox = () => {
    setInboxOpen(false);
    // Let the iframe re-instrument its click listener next time it opens.
    ampListenerAttached.current = false;
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
          tag: el?.tagName || "",
          text: (el?.textContent || "").trim().slice(0, 80),
          href: el?.getAttribute?.("href") || null,
          id: el?.id || null,
        });
      },
      true
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
    });
  };

  const greetName = lead.firstName ? `, ${lead.firstName}` : "";
  const initials = (lead.senderName || "C").trim().charAt(0).toUpperCase();

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.logo}>
          <Image
            src="/icon-192.png"
            alt="Convertic"
            width={44}
            height={44}
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>
            Convertic<span className={styles.logoDot}>.</span>ai
          </span>
        </a>
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
                <span className={`${styles.sideItem} ${styles.sideItemActive}`}>
                  <MdInbox />
                  Inbox
                  <b>1</b>
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
              {!inboxOpen ? (
                <button
                  type="button"
                  className={`${styles.mailRow} ${
                    read ? styles.mailRowRead : ""
                  }`}
                  onClick={openInbox}
                >
                  <span className={styles.avatar}>{initials}</span>
                  <span className={styles.mailMeta}>
                    <span className={styles.mailSender}>{lead.senderName}</span>
                    <span className={styles.mailSubject}>{lead.subjectLine}</span>
                    <span className={styles.mailSnippet}>{lead.snippet}</span>
                  </span>
                  <span className={styles.mailHint}>Click to open</span>
                </button>
              ) : (
                <div className={styles.mailDetail}>
                  <div className={styles.mailDetailBar}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={closeInbox}
                    >
                      <MdArrowBack />
                      <span>Back</span>
                    </button>
                    <span className={styles.detailSubject}>
                      {lead.subjectLine}
                    </span>
                  </div>
                  <div className={styles.mailBody}>
                    {lead.previewHtml ? (
                      <iframe
                        ref={iframeRef}
                        className={styles.ampFrame}
                        title="AMP email preview"
                        srcDoc={lead.previewHtml}
                        onLoad={onIframeLoad}
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
            Drop your email and we&apos;ll deliver this interactive AMP email
            straight to your inbox.
          </p>
          <TryItInInbox
            showTemplateOptions={false}
            showHeading={false}
            mode="lead"
            token={lead.token}
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
