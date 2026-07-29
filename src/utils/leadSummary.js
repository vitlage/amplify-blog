// Roll a lead's raw events up into the milestones the dashboard shows:
// opened, inbox opened, AMP clicks, video watched, email submitted.
export function summarizeEvents(lead, events) {
  const byType = {};
  for (const e of events) {
    (byType[e.type] = byType[e.type] || []).push(e);
  }

  const times = events.map((e) => new Date(e.createdAt).getTime());
  const firstSeen = times.length ? new Date(Math.min(...times)) : null;
  const lastSeen = times.length ? new Date(Math.max(...times)) : null;

  const emailSubmits = byType.email_submit || [];
  const lastSubmit = emailSubmits[emailSubmits.length - 1];

  const videoTimeSecs = (byType.video_time || []).reduce(
    (max, e) => Math.max(max, Number(e.meta?.seconds) || 0),
    0
  );

  // Furthest milestone reached, for the "where did they stop" column.
  let stoppedAt = "Not opened";
  if (byType.page_view) stoppedAt = "Opened page";
  if (byType.inbox_open) stoppedAt = "Opened inbox email";
  if (byType.amp_click) stoppedAt = "Clicked in AMP email";
  if (byType.video_view) stoppedAt = "Viewed video";
  if (byType.video_play) stoppedAt = "Played video";
  if (byType.email_submit) stoppedAt = "Submitted email";
  // Real-email interactions can only happen after the email is sent, so they sit
  // furthest along the funnel.
  if (byType.real_amp_click) stoppedAt = "Clicked in real email";
  if (byType.real_amp_submit) stoppedAt = "Submitted in real email";

  const name =
    [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
    lead.email ||
    "(no name)";

  return {
    token: lead.token,
    name,
    company: lead.company || "",
    leadEmail: lead.email || "",
    templateId: lead.templateId,
    createdAt: lead.createdAt,
    opened: !!byType.page_view,
    views: (byType.page_view || []).length,
    firstSeen,
    lastSeen,
    inboxOpened: !!byType.inbox_open,
    ampClicks: (byType.amp_click || []).length,
    realAmpClicks: (byType.real_amp_click || []).length,
    realAmpSubmits: (byType.real_amp_submit || []).length,
    videoViewed: !!byType.video_view,
    videoPlayed: !!byType.video_play,
    videoTimeSecs,
    submittedEmail: !!lastSubmit,
    submittedAddress: lastSubmit?.meta?.email || "",
    stoppedAt,
    totalEvents: events.length,
  };
}
