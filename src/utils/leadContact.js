import prisma from "@/utils/connect";
import { upsertContactByEmail, mergeContacts } from "@/utils/hubspot";

// Handle the email a visitor submitted on their /l/[token] page in HubSpot, keeping
// the submission tied to the RIGHT contact.
//
// Enrichment only ever ADDS non-empty name/company fields, so we never blank out or
// clobber values already on an existing HubSpot contact.
//
// Best-effort: the caller runs this fire-and-forget so HubSpot can never break the
// email send.
export async function ensureLeadContact(lead, email) {
  if (!lead || !email) return { skipped: true };

  const properties = {};
  if (lead.firstName) properties.firstname = lead.firstName;
  if (lead.lastName) properties.lastname = lead.lastName;
  if (lead.company) properties.company = lead.company;

  // Known contact (personalized landing page): keep the submission on THIS contact.
  // Upserting by the submitted email may resolve to a different contact — a brand-new
  // one when the email differs, or one HubSpot's Collected Forms just created. Merge
  // that into the current contact so the current one stays primary and simply gains
  // the submitted email as a secondary email: no duplicate, no lost original email.
  if (lead.hubspotId) {
    const { id, skipped } = await upsertContactByEmail(email, properties);
    if (!skipped && id && String(id) !== String(lead.hubspotId)) {
      await mergeContacts(lead.hubspotId, id);
    }
    return { id: lead.hubspotId };
  }

  // Unknown contact (e.g. the main-site "try it"): create the contact by email and
  // link it on first submit so engagement tracking starts syncing to it.
  const { id, skipped } = await upsertContactByEmail(email, properties);
  if (skipped || !id) return { skipped: true };
  await prisma.leadPage.update({
    where: { token: lead.token },
    data: { hubspotId: id },
  });
  return { id };
}
