// Best-effort IP intelligence via ip-api.com (free, no key): "City, CC" location
// plus a "bot" flag for datacenter/hosting/proxy IPs — i.e. email link-scanners
// (Microsoft Defender/SafeLinks, Google, etc.) that fetch a shared /l/ link in a
// headless sandbox and would otherwise look like a real "open". One API call per IP
// returns both; results are cached per server process.
const cache = new Map(); // ip -> { loc, bot }

const PRIVATE_RE =
  /^(::1$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|fc|fd|fe80:)/i;

async function lookup(ip) {
  const key = String(ip || "").trim();
  if (!key) return { loc: "", bot: false };
  if (cache.has(key)) return cache.get(key);
  if (PRIVATE_RE.test(key)) {
    const rec = { loc: "", bot: false };
    cache.set(key, rec);
    return rec;
  }

  let rec = { loc: "", bot: false };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(
        key
      )}?fields=status,country,countryCode,city,hosting,proxy`,
      { signal: ctrl.signal, cache: "no-store" }
    );
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d.status === "success") {
        rec = {
          loc: [d.city, d.countryCode || d.country].filter(Boolean).join(", "),
          // hosting = datacenter, proxy = VPN/proxy/scanner. Both mean "not a
          // person browsing on a normal ISP".
          bot: d.hosting === true || d.proxy === true,
        };
      }
    }
  } catch {
    /* leave rec empty on any failure — fail open (treat as a real visitor) */
  }
  cache.set(key, rec);
  return rec;
}

export async function resolveLocation(ip) {
  return (await lookup(ip)).loc;
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

// Which IPs are datacenter/hosting/proxy (link-scanner bots, not real visitors)?
// Returns Map<ip, boolean>. Unknown/unreachable -> false (never hide a real open).
export async function resolveBotIps(ips) {
  const uniq = [...new Set((ips || []).filter(Boolean))];
  const out = new Map();
  await Promise.all(
    uniq.map(async (ip) => {
      out.set(ip, (await lookup(ip)).bot);
    })
  );
  return out;
}
