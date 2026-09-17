import prisma from "@/utils/connect";
import { syncLeadToHubspot } from "@/utils/hubspotSync";
import {
  isInternalEmail,
  isInternalIp,
  submittedEmailOf,
} from "@/utils/internalTraffic";

// Persist one lead tracking event, then push the lead's updated engagement to its
// linked HubSpot contact.
//
// Internal-traffic tagging (never drops events): an event is tagged `internal` when
// the browser sent the test flag, OR the request IP is in INTERNAL_IPS, OR the
// submitted email is in INTERNAL_EMAILS. When an internal email is submitted, the
// whole visit (sessionId) is retroactively tagged. Internal events are excluded from
// the HubSpot sync so test traffic never inflates a contact's engagement.
//
// Returns the lead, or null when the token is unknown.
export async function recordLeadEvent(
  token,
  type,
  { meta, sessionId, ip, clientInternal } = {}
) {
  const lead = await prisma.leadPage.findUnique({ where: { token } });
  if (!lead) return null;

  const email = submittedEmailOf(type, meta);
  const internal =
    clientInternal === true || isInternalIp(ip) || isInternalEmail(email);

  const sid = sessionId ? String(sessionId).slice(0, 64) : undefined;

  const created = await prisma.leadEvent.create({
    data: {
      leadToken: token,
      type,
      meta: meta ?? undefined,
      sessionId: sid,
      ip: ip ? String(ip).slice(0, 64) : undefined,
      internal,
    },
  });

  // Internal email just submitted -> retro-tag this whole visit; the earlier opens/
  // clicks in this session were us too.
  if (isInternalEmail(email) && sid && sid !== "nosession") {
    try {
      await prisma.leadEvent.updateMany({
        where: { sessionId: sid },
        data: { internal: true },
      });
    } catch (err) {
      console.error("internal session tag error", err);
    }
  }

  // Push engagement to HubSpot — real traffic only, computed from non-internal
  // events so test visits never inflate the contact.
  if (!internal && lead.hubspotId) {
    try {
      const all = await prisma.leadEvent.findMany({ where: { leadToken: token } });
      const events = all.filter((e) => e.internal !== true);
      await Promise.race([
        syncLeadToHubspot(lead, events, created).catch((err) =>
          console.error("hubspot sync error", err)
        ),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    } catch (err) {
      console.error("hubspot sync setup error", err);
    }
  }

  return lead;
}
