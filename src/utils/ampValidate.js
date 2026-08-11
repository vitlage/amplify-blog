// Validate AMP4EMAIL HTML against the AMP validator service. Shared by the admin
// "validate" tool and the send-proxy's pre-send gate.
//
// Returns { status, errors }, where status is:
//   "PASS"  — valid AMP
//   "FAIL"  — definitively invalid (errors array populated)
//   "ERROR" — could not validate (validator unreachable/timed out/HTTP error).
// Callers distinguish FAIL (block) from ERROR (fail-open) themselves.

const VALIDATOR_URL = "https://amp-validator.convertic.ai/validate";

export async function validateAmpEmail(html, { timeoutMs = 4000 } = {}) {
  if (!html || !html.trim()) {
    return { status: "ERROR", errors: [{ message: "Nothing to validate." }] };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(VALIDATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format: "AMP4EMAIL", html }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        status: "ERROR",
        errors: [{ message: `Validator returned HTTP ${res.status}` }],
      };
    }

    // { status: "PASS" | "FAIL", errors: [{ line, col, message, ... }] }
    return await res.json();
  } catch (err) {
    return {
      status: "ERROR",
      errors: [{ message: "Could not reach the AMP validator: " + err.message }],
    };
  } finally {
    clearTimeout(timer);
  }
}
