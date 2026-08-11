import prisma from "@/utils/connect";
import { notFound } from "next/navigation";
import LeadLandingClient from "./LeadLandingClient";

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
  };

  return <LeadLandingClient lead={data} />;
}
