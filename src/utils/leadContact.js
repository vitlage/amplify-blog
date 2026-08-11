import prisma from "@/utils/connect";
import { upsertContactByEmail } from "@/utils/hubspot";

// Ensure the email a visitor submitted on their /l/[token] page exists as a HubSpot
// contact, then wire it into the lead-tracking system.
//
// Mirrors the main landing's "try it" behavior (which creates a contact on submit),
// and additionally: enriches the contact with what we already know about the lead,
// and — the first time — links the contact id back onto the leadPage row so every
// future engagement event flows through the existing syncLeadToHubspot pipeline.
//
// Enrichment only ever ADDS non-empty name/company fields, so we never blank out or
// clobber values already on an existing HubSpot contact.
//
// Best-effort: returns { skipped } / swallows nothing here — the caller is expected
// to run this fire-and-forget so HubSpot can never break the email send.
export async function ensureLeadContact(lead, email) {
  if (!lead || !email) return { skipped: true };

  const properties = {};
  if (lead.firstName) properties.firstname = lead.firstName;
  if (lead.lastName) properties.lastname = lead.lastName;
  if (lead.company) properties.company = lead.company;

  const { id, skipped } = await upsertContactByEmail(email, properties);
  if (skipped || !id) return { skipped: true };

  // Link the contact on first submit so engagement tracking starts syncing to it.
  if (!lead.hubspotId) {
    await prisma.leadPage.update({
      where: { token: lead.token },
      data: { hubspotId: id },
    });
  }

  return { id };
}
