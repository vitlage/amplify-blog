import prisma from "@/utils/connect";
import { syncLeadToHubspot } from "@/utils/hubspotSync";

// Persist one lead tracking event, then push the lead's updated engagement to its
// linked HubSpot contact. The HubSpot call is capped at ~2s and fully swallowed on
// error so tracking can never break the caller's response.
// Returns the lead, or null when the token is unknown.
export async function recordLeadEvent(token, type, { meta, sessionId } = {}) {
  const lead = await prisma.leadPage.findUnique({ where: { token } });
  if (!lead) return null;

  const created = await prisma.leadEvent.create({
    data: {
      leadToken: token,
      type,
      meta: meta ?? undefined,
      sessionId: sessionId ? String(sessionId).slice(0, 64) : undefined,
    },
  });

  if (lead.hubspotId) {
    try {
      const events = await prisma.leadEvent.findMany({
        where: { leadToken: token },
      });
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
