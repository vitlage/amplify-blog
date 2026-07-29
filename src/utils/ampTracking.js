// Instrument AMP email HTML so interactions in the delivered inbox test ping back
// to this app with the lead token. Two mechanisms:
//   - link-wrapping: <a href> -> a redirect endpoint that logs real_amp_click
//   - amp-form: action-xhr -> a proxy endpoint that logs real_amp_submit
//
// Regex-based rewriting is intentionally conservative (skips anchors, mailto/tel,
// and already-wrapped URLs). It is best-effort for exotic templates; see the design
// doc caveats.

function hostBase() {
  return (process.env.HOST_URL || "").replace(/\/+$/, "");
}

// Rewrite <a href="X"> to ${HOST}/api/lead/{token}/click?u=<enc(X)>.
export function wrapLinks(html, token) {
  const base = hostBase();
  if (!base || !html) return html;

  return html.replace(
    /(<a\b[^>]*\bhref=)(["'])(.*?)\2/gi,
    (match, pre, quote, url) => {
      if (
        !url ||
        /^(#|mailto:|tel:|javascript:)/i.test(url) ||
        url.includes(`/api/lead/${token}/click`)
      ) {
        return match;
      }
      const wrapped = `${base}/api/lead/${token}/click?u=${encodeURIComponent(
        url
      )}`;
      return `${pre}${quote}${wrapped}${quote}`;
    }
  );
}

// Rewrite amp-form action-xhr="X" to ${HOST}/api/lead/{token}/amp-submit?u=<enc(X)>.
export function wrapForms(html, token) {
  const base = hostBase();
  if (!base || !html) return html;

  return html.replace(
    /(\baction-xhr=)(["'])(.*?)\2/gi,
    (match, pre, quote, url) => {
      if (!url || url.includes(`/api/lead/${token}/amp-submit`)) return match;
      const wrapped = `${base}/api/lead/${token}/amp-submit?u=${encodeURIComponent(
        url
      )}`;
      return `${pre}${quote}${wrapped}${quote}`;
    }
  );
}

export function instrumentAmpHtml(html, token) {
  return wrapForms(wrapLinks(html, token), token);
}
