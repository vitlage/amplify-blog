import prisma from "@/utils/connect";
import { generateToken } from "@/utils/token";

// Create a lead page, retrying on the (astronomically unlikely) token collision.
// Shared by the admin create route and the HubSpot webhook. Returns the created
// lead, or null if it couldn't get a unique token after a few tries. Throws on
// any other DB error so callers can decide how to respond.
export async function createLeadPage(fields = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const token = generateToken();
    try {
      return await prisma.leadPage.create({
        data: {
          token,
          product: fields.product ?? undefined,
          hubspotId: fields.hubspotId || null,
          firstName: fields.firstName || null,
          lastName: fields.lastName || null,
          company: fields.company || null,
          email: fields.email || null,
          templateId: String(fields.templateId),
          previewHtml: fields.previewHtml || null,
          videoUrl: fields.videoUrl || null,
          subjectLine: fields.subjectLine || null,
          senderName: fields.senderName || null,
          senderEmail: fields.senderEmail || null,
          snippet: fields.snippet || null,
          createdBy: fields.createdBy || null,
        },
      });
    } catch (err) {
      if (err?.code === "P2002") continue; // unique token collision, retry
      throw err;
    }
  }
  return null;
}
