import { NextResponse } from "next/server";
import { recordLeadEvent } from "@/utils/leadEvents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// amp-form submit tracker for the delivered (real) AMP email. Logs a
// real_amp_submit event, then proxies the submission to the form's original
// action-xhr so the email's form still works. Must satisfy AMP's CORS contract or
// amp-form will reject the response in-client.
function ampCorsHeaders(req) {
  const url = new URL(req.url);
  const sourceOrigin = url.searchParams.get("__amp_source_origin") || "";
  const origin = req.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "AMP-Access-Control-Allow-Source-Origin",
    "AMP-Access-Control-Allow-Source-Origin": sourceOrigin,
  };
}

export async function OPTIONS(req) {
  return new NextResponse(null, { status: 204, headers: ampCorsHeaders(req) });
}

export async function POST(req, { params }) {
  const { token } = params;
  const url = new URL(req.url);
  const headers = ampCorsHeaders(req);

  // Read the submitted fields (AMP internal params excluded, values size-capped).
  let rawBody = "";
  const fields = {};
  try {
    rawBody = await req.text();
    new URLSearchParams(rawBody).forEach((v, k) => {
      if (k.startsWith("__amp")) return;
      fields[k] = String(v).slice(0, 200);
    });
  } catch {
    /* keep fields empty */
  }

  try {
    await recordLeadEvent(token, "real_amp_submit", { meta: { fields } });
  } catch (err) {
    console.error("real amp submit log error", err);
  }

  // Proxy to the original action-xhr so the form behaves as designed.
  let original = "";
  try {
    original = decodeURIComponent(url.searchParams.get("u") || "");
  } catch {
    original = "";
  }

  if (/^https?:\/\//i.test(original)) {
    try {
      const upstream = await fetch(original, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: rawBody,
      });
      const data = await upstream.text();
      return new NextResponse(data, {
        status: upstream.status,
        headers: {
          ...headers,
          "Content-Type":
            upstream.headers.get("content-type") || "application/json",
        },
      });
    } catch (err) {
      console.error("amp submit proxy error", err);
    }
  }

  // Fallback success response so amp-form shows its submit-success state.
  return NextResponse.json({ result: "ok" }, { headers });
}
