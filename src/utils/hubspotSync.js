// Push a lead's engagement state to its linked HubSpot contact.
//
// Design: always compute ABSOLUTE values from the full event set (never
// read-modify-write HubSpot), so the sync is idempotent and race-free even when
// events arrive concurrently. Contact properties update on every event; timeline
// entries are emitted for milestones only.

import { summarizeEvents } from "@/utils/leadSummary";
import {
  updateContactProperties,
  createTimelineEvent,
} from "@/utils/hubspot";

// Weighted contribution of each event type to amp_engagement_score.
const SCORE_WEIGHTS = {
  page_view: 1,
  inbox_open: 3,
  amp_click: 5,
  video_view: 2,
  video_play: 4,
  email_submit: 10,
  real_amp_click: 8,
  real_amp_submit: 12,
};

// amp_click can fire many times in one session; cap its contribution so a single
// active visitor can't dominate the score.
const AMP_CLICK_CAP = 5;

export function computeEngagementScore(events) {
  const counts = {};
  for (const e of events) counts[e.type] = (counts[e.type] || 0) + 1;

  let score = 0;
  for (const [type, weight] of Object.entries(SCORE_WEIGHTS)) {
    let n = counts[type] || 0;
    if (type === "amp_click") n = Math.min(n, AMP_CLICK_CAP);
    score += n * weight;
  }
  return score;
}

// Events that warrant a timeline entry. amp_click / real_amp_click only on their
// FIRST occurrence, so an active lead doesn't flood the contact record.
const MILESTONE_TYPES = new Set([
  "inbox_open",
  "amp_click",
  "email_submit",
  "real_amp_click",
  "real_amp_submit",
]);
const FIRST_ONLY = new Set(["amp_click", "real_amp_click"]);

const MILESTONE_LABELS = {
  inbox_open: "Opened inbox email",
  amp_click: "Clicked in AMP preview",
  email_submit: "Submitted email",
  real_amp_click: "Clicked in real email",
  real_amp_submit: "Submitted form in real email",
};

function isMilestone(newEvent, events) {
  if (!newEvent || !MILESTONE_TYPES.has(newEvent.type)) return false;
  if (FIRST_ONLY.has(newEvent.type)) {
    const count = events.filter((e) => e.type === newEvent.type).length;
    return count <= 1; // this new event is the first of its type
  }
  return true;
}

function hostBase() {
  return (process.env.HOST_URL || "").replace(/\/+$/, "");
}

// Map a lead + its full event set to the HubSpot contact properties we write.
// Property names must exist in HubSpot (created manually by the account owner).
export function buildContactProperties(lead, events) {
  const summary = summarizeEvents(lead, events);
  const sorted = [...events].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const last = sorted[sorted.length - 1];

  const props = {
    amp_stopped_at: summary.stoppedAt,
    amp_engagement_score: computeEngagementScore(events),
    amp_landing_url: hostBase() ? `${hostBase()}/l/${lead.token}` : "",
  };
  if (last) {
    props.amp_last_event = last.type;
    // A manually-created HubSpot "Date picker" property must receive a midnight-UTC
    // epoch (ms) or the API rejects it. Normalize to the event's UTC date.
    const d = new Date(last.createdAt);
    props.amp_last_event_at = Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate()
    );
  }
  return props;
}

// Recompute + push. Returns silently for leads without a hubspotId. Any HubSpot
// error propagates to the caller, which is expected to run this fire-and-forget.
export async function syncLeadToHubspot(lead, events, newEvent) {
  if (!lead?.hubspotId) return;

  await updateContactProperties(lead.hubspotId, buildContactProperties(lead, events));

  if (isMilestone(newEvent, events)) {
    await createTimelineEvent(lead.hubspotId, {
      timestamp: new Date(newEvent.createdAt || Date.now()).toISOString(),
      tokens: {
        eventType: newEvent.type,
        milestone: MILESTONE_LABELS[newEvent.type] || newEvent.type,
        detail:
          newEvent.meta?.text ||
          newEvent.meta?.href ||
          newEvent.meta?.email ||
          "",
      },
    });
  }
}
