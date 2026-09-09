// Best-effort IP -> "City, CC" geolocation via ip-api.com (free, no key). Results are
// cached per server process so the dashboard doesn't re-hit the API for the same IP.
const cache = new Map();

const PRIVATE_RE =
  /^(::1$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|fc|fd|fe80:)/i;

export async function resolveLocation(ip) {
  if (!ip) return "";
  const key = String(ip).trim();
  if (cache.has(key)) return cache.get(key);
  if (PRIVATE_RE.test(key)) {
    cache.set(key, "");
    return "";
  }

  let loc = "";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(key)}?fields=status,country,countryCode,city`,
      { signal: ctrl.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d.status === "success") {
        loc = [d.city, d.countryCode || d.country].filter(Boolean).join(", ");
      }
    }
  } catch {
    /* leave loc empty on any failure */
  }
  cache.set(key, loc);
  return loc;
}

// Resolve a batch of IPs (deduped, in parallel). Returns Map<ip, "City, CC">.
export async function resolveLocations(ips) {
  const uniq = [...new Set((ips || []).filter(Boolean))];
  const out = new Map();
  await Promise.all(
    uniq.map(async (ip) => {
      out.set(ip, await resolveLocation(ip));
    })
  );
  return out;
}
