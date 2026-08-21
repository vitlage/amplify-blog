"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

const SAMPLE_AMP = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#fff;color:#1a1a1a}
  .wrap{max-width:600px;margin:0 auto;padding:24px}
  .btn{display:inline-block;background:#4a5fd9;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600}
  .card{border:1px solid #eee;border-radius:12px;padding:16px;margin:12px 0}
  .stars span{font-size:26px;cursor:pointer;color:#f5a623}
</style></head><body><div class="wrap">
  <h2>Hi there 👋</h2>
  <p>This is an interactive email. Try clicking anything below.</p>
  <a class="btn" href="#">Shop the new drop</a>
  <div class="card"><strong>Rate your last order</strong>
    <div class="stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
  </div>
  <a class="btn" href="#">Reorder in one tap</a>
</div></body></html>`;

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  hubspotId: "",
  templateId: "66c37609b2af3",
  subjectLine: "",
  senderName: "",
  senderEmail: "",
  snippet: "",
  videoUrl: "",
  previewHtml: SAMPLE_AMP,
};

// Interactive AMP4EMAIL presets copied into /public/amp-templates.
const TEMPLATE_PRESETS = [
  { key: "abandoned-cart-recovery", label: "Abandoned Cart Recovery" },
  { key: "upsell", label: "Upsell" },
  { key: "subscription", label: "Subscription" },
];

export default function AdminClient({ adminEmail }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);

  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchNote, setSearchNote] = useState("");

  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  const validateAmp = async () => {
    setValidating(true);
    setValidation(null);
    try {
      const res = await fetch("/api/admin/validate-amp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: form.previewHtml }),
      });
      setValidation(await res.json());
    } catch {
      setValidation({ status: "ERROR", errors: [{ message: "Validation request failed." }] });
    } finally {
      setValidating(false);
    }
  };

  const [productUrl, setProductUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState(null);
  // Scraped store catalog { main, others } — injected into the demo emails, saved on the lead.
  const [productData, setProductData] = useState(null);

  const generateFromUrl = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/admin/generate-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
      // Parse defensively: error responses (e.g. a 401 "Unauthorized") may not be JSON.
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || `Request failed (HTTP ${res.status}).` };
      }
      if (!res.ok) {
        setGenResult({
          error: data.error || `Generation failed (HTTP ${res.status}).`,
        });
        return;
      }
      setProductData(data.product || null);
      setGenResult({ summary: data.summary, warnings: data.warnings });
    } catch (e) {
      setGenResult({ error: "Request failed: " + e.message });
    } finally {
      setGenerating(false);
    }
  };

  // Load one of the interactive AMP presets into the preview box.
  const loadTemplatePreset = async (key) => {
    try {
      const res = await fetch(`/amp-templates/${key}.html`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      setForm((f) => ({ ...f, previewHtml: html }));
      setValidation(null);
      setGenResult(null);
    } catch (e) {
      setGenResult({ error: `Couldn't load template: ${e.message}` });
    }
  };

  // Internal (our own test) traffic is hidden by default; toggle to include it.
  const [showInternal, setShowInternal] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/leads${showInternal ? "?includeInternal=1" : ""}`
      );
      const data = await res.json();
      setLeads(data.leads || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInternal]);

  // One-time (idempotent) backfill: tag existing internal/test events.
  const [backfilling, setBackfilling] = useState(false);
  const runBackfill = async () => {
    if (!window.confirm("Tag all existing internal (test) events? Safe to re-run.")) return;
    setBackfilling(true);
    try {
      const res = await fetch("/api/admin/backfill-internal", { method: "POST" });
      const d = await res.json();
      window.alert(
        `Backfill done: tagged ${d.tagged} of ${d.totalEvents} events internal ` +
          `(email ${d.breakdown?.byEmail}, session ${d.breakdown?.bySession}, ip ${d.breakdown?.byIp}).`
      );
      loadLeads();
    } catch {
      window.alert("Backfill failed.");
    } finally {
      setBackfilling(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const searchHubspot = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearching(true);
    setSearchNote("");
    try {
      const res = await fetch(
        `/api/admin/hubspot/search?q=${encodeURIComponent(q.trim())}`
      );
      const data = await res.json();
      setContacts(data.contacts || []);
      if (data.error) setSearchNote(data.error);
      else if (!data.contacts?.length) setSearchNote("No contacts found.");
    } catch {
      setSearchNote("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const pickContact = (c) => {
    setForm((f) => ({
      ...f,
      firstName: c.firstName || "",
      lastName: c.lastName || "",
      company: c.company || "",
      email: c.email || "",
      hubspotId: c.hubspotId || "",
      senderName: f.senderName || "Convertic",
    }));
    setContacts([]);
    setQ("");
  };

  const createLead = async (e) => {
    e.preventDefault();
    setSaving(true);
    setCreated(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: productData }),
      });
      if (!res.ok) {
        alert("Could not create page: " + (await res.text()));
        return;
      }
      const data = await res.json();
      const url = `${window.location.origin}/l/${data.lead.token}`;
      setCreated(url);
      setForm(EMPTY_FORM);
      setProductData(null);
      loadLeads();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (token) => {
    if (!confirm("Delete this lead page and all its tracking?")) return;
    await fetch(`/api/admin/leads/${token}`, { method: "DELETE" });
    loadLeads();
  };

  const [rescraping, setRescraping] = useState(null);
  const rescrape = async (token) => {
    setRescraping(token);
    try {
      const res = await fetch(`/api/admin/leads/${token}/rescrape`, {
        method: "POST",
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text };
      }
      if (!res.ok) {
        alert("Re-scrape failed: " + (data.error || res.status));
      } else {
        alert(
          `Refreshed: ${data.summary?.title || "product"} · ${data.summary?.images} photos · ${data.summary?.others} other products`
        );
        loadLeads();
      }
    } finally {
      setRescraping(null);
    }
  };

  const copy = (url) => {
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.h1}>Lead pages</h1>
          <p className={styles.sub}>Signed in as {adminEmail}</p>
        </div>
        <Link href="/admin/tracking" className={styles.btnGhost}>
          View tracking →
        </Link>
      </div>

      {created && (
        <div className={styles.created}>
          <strong>Page created.</strong> Share this link:
          <div className={styles.createdRow}>
            <code>{created}</code>
            <button onClick={() => copy(created)} className={styles.btnSmall}>
              Copy
            </button>
            <a
              href={`${created}${created.includes("?") ? "&" : "?"}test=1`}
              target="_blank"
              rel="noreferrer"
              className={styles.btnSmall}
            >
              Open
            </a>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {/* Create form */}
        <form className={styles.card} onSubmit={createLead}>
          <h2 className={styles.h2}>New personalized page</h2>

          <label className={styles.label}>Find a HubSpot contact</label>
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="name, email or company"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchHubspot(e)}
            />
            <button
              type="button"
              className={styles.btnSmall}
              onClick={searchHubspot}
              disabled={searching}
            >
              {searching ? "…" : "Search"}
            </button>
          </div>
          {searchNote && <p className={styles.note}>{searchNote}</p>}
          {contacts.length > 0 && (
            <ul className={styles.contacts}>
              {contacts.map((c) => (
                <li key={c.hubspotId}>
                  <button type="button" onClick={() => pickContact(c)}>
                    <strong>
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") ||
                        c.email}
                    </strong>
                    <span>
                      {c.email}
                      {c.company ? ` · ${c.company}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.row2}>
            <div>
              <label className={styles.label}>First name</label>
              <input className={styles.input} value={form.firstName} onChange={set("firstName")} />
            </div>
            <div>
              <label className={styles.label}>Last name</label>
              <input className={styles.input} value={form.lastName} onChange={set("lastName")} />
            </div>
          </div>
          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Company</label>
              <input className={styles.input} value={form.company} onChange={set("company")} />
            </div>
            <div>
              <label className={styles.label}>Lead email (reference)</label>
              <input className={styles.input} value={form.email} onChange={set("email")} />
            </div>
          </div>

          <label className={styles.label}>Convertic template ID (used for the real send) *</label>
          <input className={styles.input} required value={form.templateId} onChange={set("templateId")} />

          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Inbox sender name</label>
              <input className={styles.input} value={form.senderName} onChange={set("senderName")} placeholder="Convertic" />
            </div>
            <div>
              <label className={styles.label}>Inbox subject line</label>
              <input className={styles.input} value={form.subjectLine} onChange={set("subjectLine")} placeholder="See what your emails could do" />
            </div>
          </div>

          <label className={styles.label}>Inbox snippet</label>
          <input className={styles.input} value={form.snippet} onChange={set("snippet")} placeholder="Open this to see your AMP email…" />

          <label className={styles.label}>Loom video URL (embed src)</label>
          <input className={styles.input} value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://www.loom.com/embed/…" />

          <label className={styles.label}>
            Generate from a product URL — scrapes the main product and other
            products from the same store, and bakes them into the 3 demo emails
            (abandoned cart · upsell grid · subscription) for this lead
          </label>
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              placeholder="https://store.com/products/…"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
            <button
              type="button"
              className={styles.btnSmall}
              onClick={generateFromUrl}
              disabled={generating}
            >
              {generating ? "Scraping…" : "Generate"}
            </button>
          </div>
          {genResult?.error && <p className={styles.valFail}>{genResult.error}</p>}
          {genResult?.summary && (
            <div className={styles.genResult}>
              <div>
                ✓ Main product:{" "}
                <b>{genResult.summary.main?.title || "(no title)"}</b>
                {genResult.summary.main?.price
                  ? ` · ${genResult.summary.main.currency || ""}${genResult.summary.main.price}`
                  : ""}
                {` · ${genResult.summary.main?.images || 0} image${
                  genResult.summary.main?.images === 1 ? "" : "s"
                }`}
              </div>
              <div>
                ✓ {genResult.summary.othersCount} other product
                {genResult.summary.othersCount === 1 ? "" : "s"} for the upsell grid
                {genResult.summary.others?.length
                  ? `: ${genResult.summary.others
                      .map((o) => o.title)
                      .filter(Boolean)
                      .join(", ")}`
                  : ""}
              </div>
              <div style={{ marginTop: 4, color: "#6b7280" }}>
                These get baked into the 3 demo emails when you create the page.
              </div>
              {genResult.warnings?.length > 0 && (
                <ul className={styles.valErrors}>
                  {genResult.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <label className={styles.label}>Preview AMP HTML (rendered in the inbox + sent to the lead)</label>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              margin: "0 0 8px",
            }}
          >
            <span style={{ fontSize: 13, color: "#6b7280" }}>Load a template:</span>
            {TEMPLATE_PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={styles.btnSmall}
                onClick={() => loadTemplatePreset(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            rows={8}
            value={form.previewHtml}
            onChange={(e) => {
              set("previewHtml")(e);
              setValidation(null);
            }}
          />
          <div className={styles.validateRow}>
            <button
              type="button"
              className={styles.btnSmall}
              onClick={validateAmp}
              disabled={validating}
            >
              {validating ? "Validating…" : "Validate AMP"}
            </button>
            {validation &&
              (validation.status === "PASS" ? (
                <span className={styles.valPass}>✓ Valid AMP4EMAIL</span>
              ) : (
                <span className={styles.valFail}>
                  ✗ {validation.errors?.length || 0} issue
                  {(validation.errors?.length || 0) === 1 ? "" : "s"}
                </span>
              ))}
          </div>
          {validation && validation.status !== "PASS" && validation.errors?.length > 0 && (
            <ul className={styles.valErrors}>
              {validation.errors.slice(0, 25).map((er, i) => (
                <li key={i}>
                  {er.line ? `Line ${er.line}: ` : ""}
                  {er.message}
                </li>
              ))}
            </ul>
          )}

          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create page & generate link"}
          </button>
        </form>

        {/* Existing leads */}
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2 className={styles.h2} style={{ margin: 0 }}>
              Existing pages ({leads.length})
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#6B7280",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={showInternal}
                  onChange={(e) => setShowInternal(e.target.checked)}
                />
                Show internal traffic
              </label>
              <button
                type="button"
                onClick={runBackfill}
                disabled={backfilling}
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  background: "none",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "4px 10px",
                  cursor: backfilling ? "default" : "pointer",
                }}
                title="Tag existing internal/test events (one-time, safe to re-run)"
              >
                {backfilling ? "Tagging…" : "Backfill internal"}
              </button>
            </div>
          </div>
          {loading ? (
            <p className={styles.note}>Loading…</p>
          ) : leads.length === 0 ? (
            <p className={styles.note}>No pages yet. Create your first one.</p>
          ) : (
            <ul className={styles.leadList}>
              {leads.map((l) => (
                <li key={l.token} className={styles.leadItem}>
                  <div className={styles.leadTop}>
                    <strong>{l.name}</strong>
                    {l.company && <span className={styles.tag}>{l.company}</span>}
                    {l.productTitle ? (
                      <span
                        className={styles.tag}
                        style={{ background: "#ecfdf5", color: "#059669" }}
                        title={`${l.storeName || "store"} · ${l.productCount} products baked in`}
                      >
                        🛍 {l.productTitle.slice(0, 24)}
                      </span>
                    ) : (
                      <span
                        className={styles.tag}
                        style={{ background: "#fef2f2", color: "#b91c1c" }}
                        title="No scraped catalog — emails show the demo products"
                      >
                        demo photos
                      </span>
                    )}
                  </div>
                  <div className={styles.leadMeta}>
                    {l.opened ? `Opened · ${l.stoppedAt}` : "Not opened yet"}
                  </div>
                  <div className={styles.leadActions}>
                    <button className={styles.btnSmall} onClick={() => copy(`${window.location.origin}/l/${l.token}`)}>
                      Copy link
                    </button>
                    <a className={styles.btnSmall} href={`/l/${l.token}?test=1`} target="_blank" rel="noreferrer">
                      Open
                    </a>
                    <button
                      className={styles.btnSmall}
                      onClick={() => rescrape(l.token)}
                      disabled={rescraping === l.token}
                      title="Re-scrape the product URL and refresh photos/prices"
                    >
                      {rescraping === l.token ? "Re-scraping…" : "Re-scrape"}
                    </button>
                    <button className={styles.btnSmallDanger} onClick={() => remove(l.token)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
