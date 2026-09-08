"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// HubSpot's tracking code includes Collected Forms, which auto-captures form
// submissions across the whole site and reconverts the associated contact. That's
// wanted for real visitors, but during our own testing it creates fake "form
// submitted" reconversions that fool the dashboard. So we DON'T load HubSpot when:
//   - the browser carries the internal/test flag (set via ?test=1, same key the lead
//     page uses), i.e. it's one of our own test sessions, or
//   - we're on the /admin tool (internal-only; HubSpot has no business tracking it).
// Real leads on /l/... with no test flag load HubSpot normally.
export default function HubSpotScript() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      // Honor ?test=1 / ?test=0 here too, so toggling test mode on any page takes
      // effect immediately (mirrors the lead landing page's own handling).
      const param = new URLSearchParams(window.location.search).get("test");
      if (param === "1") localStorage.setItem("convertic_internal", "true");
      else if (param === "0") localStorage.removeItem("convertic_internal");

      const internal = localStorage.getItem("convertic_internal") === "true";
      const onAdmin = window.location.pathname.startsWith("/admin");
      setEnabled(!internal && !onAdmin);
    } catch {
      setEnabled(true); // storage blocked -> treat as a normal visitor
    }
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="hs-script-loader"
      src="//js-na1.hs-scripts.com/46429058.js"
      strategy="afterInteractive"
      async
      defer
    />
  );
}
