import prisma from "@/utils/connect";
import { notFound } from "next/navigation";
import LeadLandingClient from "./LeadLandingClient";
import { readDemoEmails } from "@/utils/demoEmails";
import { personalizeEmail } from "@/utils/personalizeEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Personalized lead pages must never be indexed. The token is the only secret.
export const metadata = {
  robots: { index: false, follow: false },
  title: "A quick look, just for you",
};

export default async function LeadLandingPage({ params }) {
  const lead = await prisma.leadPage.findUnique({
    where: { token: params.token },
  });

  if (!lead) notFound();

  // Only pass what the client actually renders (previewHtml can be large).
  const data = {
    token: lead.token,
    firstName: lead.firstName || "",
    company: lead.company || "",
    email: lead.email || "",
    templateId: lead.templateId,
    previewHtml: lead.previewHtml || "",
    videoUrl: lead.videoUrl || "",
    subjectLine: lead.subjectLine || "See what your emails could do",
    senderName: lead.senderName || "Convertic",
    senderEmail: lead.senderEmail || "hello@convertic.ai",
    snippet:
      lead.snippet ||
      "Open this to see your interactive AMP email in action.",
    // The three interactive AMP demo emails, personalized with the lead's scraped
    // store catalog (main product -> abandoned cart/subscription, other products
    // -> upsell grid). Falls back to the demo products if no catalog was stored.
    emails: readDemoEmails()
      .filter((e) => e.html)
      .map((e) => ({
        ...e,
        // Use the real store name as the sender when we scraped one.
        sender: lead.product?.storeName || e.sender,
        html: lead.product
          ? personalizeEmail(e.key, e.html, lead.product)
          : e.html,
      })),
  };

  return <LeadLandingClient lead={data} />;
}
