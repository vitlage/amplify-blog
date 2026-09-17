"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./tracking.module.css";

function fmt(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
}

const EVENT_LABELS = {
  page_view: "Opened the page",
  page_leave: "Left the page",
  inbox_open: "Opened the inbox email",
  amp_click: "Clicked in the AMP email",
  video_view: "Scrolled to the video",
  video_play: "Played the video",
  video_time: "Watched the video",
  email_submit: "Submitted their email",
  real_amp_click: "Clicked in the real email",
  real_amp_submit: "Submitted in the real email",
};

function Yes({ on }) {
  return (
    <span className={on ? styles.yes : styles.no}>{on ? "Yes" : "No"}</span>
  );
}

export default function TrackingClient() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // My own (internal/test) logs are hidden by default; toggle to show them.
  const [showInternal, setShowInternal] = useState(false);
  const [deleting, setDeleting] = useState("");

  const qs = showInternal ? "?includeInternal=1" : "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads${qs}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInternal]);

  const openDetail = async (token) => {
    setDetailLoading(true);
    setDetail({ token });
    try {
      const res = await fetch(`/api/admin/leads/${token}${qs}`);
      const data = await res.json();
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  };

  // Delete one row: removes the lead page and all of its tracking events.
  const del = async (token) => {
    if (!window.confirm("Delete this lead and all of its tracking events?")) return;
    setDeleting(token);
    try {
      await fetch(`/api/admin/leads/${token}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.token !== token));
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.chrome}>
        <div className={styles.chromeInner}>
          <div>
            <h1 className={styles.title}>Tracking</h1>
            <p className={styles.subtitle}>
              Who opened, what they did, where they stopped.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={`${styles.pill} ${showInternal ? styles.pillActive : ""}`}
              onClick={() => setShowInternal((v) => !v)}
              title="Your own test/admin visits are hidden by default"
            >
              {showInternal ? "Hide my logs" : "Show my logs"}
            </button>
            <button className={styles.pill} onClick={load}>
              Refresh
            </button>
            <Link href="/admin" className={styles.pill}>
              ← Pages
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.card}>
            <p className={styles.note}>Loading…</p>
          </div>
        ) : leads.length === 0 ? (
          <div className={styles.card}>
            <p className={styles.note}>No lead pages yet.</p>
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Opened</th>
                    <th>Inbox</th>
                    <th>AMP clicks</th>
                    <th>Video</th>
                    <th>Watch (s)</th>
                    <th>Submitted email</th>
                    <th>Location</th>
                    <th>Stopped at</th>
                    <th>Last seen</th>
                    <th aria-label="Delete" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr
                      key={l.token}
                      className={styles.row}
                      onClick={() => openDetail(l.token)}
                    >
                      <td>
                        <div className={styles.leadName}>{l.name}</div>
                        {l.company && (
                          <div className={styles.leadSub}>{l.company}</div>
                        )}
                      </td>
                      <td>
                        <Yes on={l.opened} />
                        {l.views > 1 && (
                          <span className={styles.mut}> ×{l.views}</span>
                        )}
                      </td>
                      <td>
                        <Yes on={l.inboxOpened} />
                      </td>
                      <td>{l.ampClicks}</td>
                      <td>
                        {l.videoPlayed
                          ? "Played"
                          : l.videoViewed
                          ? "Viewed"
                          : <span className={styles.no}>No</span>}
                      </td>
                      <td>{l.videoTimeSecs || 0}</td>
                      <td>
                        {l.submittedEmail ? (
                          <span className={styles.email}>
                            {l.submittedAddress || "Yes"}
                          </span>
                        ) : (
                          <span className={styles.no}>No</span>
                        )}
                      </td>
                      <td>
                        {l.location ? (
                          <span className={styles.loc}>📍 {l.location}</span>
                        ) : (
                          <span className={styles.no}>—</span>
                        )}
                      </td>
                      <td>{l.stoppedAt}</td>
                      <td className={styles.mut}>{fmt(l.lastSeen)}</td>
                      <td className={styles.delCell}>
                        <button
                          className={styles.del}
                          disabled={deleting === l.token}
                          onClick={(e) => {
                            e.stopPropagation();
                            del(l.token);
                          }}
                          title="Delete this lead and its events"
                          aria-label="Delete lead"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {detail && (
        <div className={styles.overlay} onClick={() => setDetail(null)}>
          <div
            className={styles.sheet}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.sheetClose} onClick={() => setDetail(null)}>
              ×
            </button>
            {detailLoading || !detail.lead ? (
              <p className={styles.note}>Loading timeline…</p>
            ) : (
              <>
                <h2 className={styles.sheetTitle}>{detail.summary?.name}</h2>
                <p className={styles.sheetSub}>
                  {[detail.lead.company, detail.lead.email]
                    .filter(Boolean)
                    .join(" · ")}
                  {detail.summary?.location ? ` · 📍 ${detail.summary.location}` : ""}
                </p>
                <div className={styles.timeline}>
                  {detail.events.length === 0 ? (
                    <p className={styles.note}>No activity recorded yet.</p>
                  ) : (
                    detail.events.map((e) => (
                      <div key={e.id} className={styles.titem}>
                        <span className={styles.tiTime}>{fmt(e.createdAt)}</span>
                        <span className={styles.tiLabel}>
                          {EVENT_LABELS[e.type] || e.type}
                          {e.type === "amp_click" && e.meta?.text
                            ? `: “${e.meta.text}”`
                            : ""}
                          {e.type === "video_time" && e.meta?.seconds
                            ? `: ${e.meta.seconds}s`
                            : ""}
                          {e.type === "email_submit" && e.meta?.email
                            ? `: ${e.meta.email}`
                            : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
