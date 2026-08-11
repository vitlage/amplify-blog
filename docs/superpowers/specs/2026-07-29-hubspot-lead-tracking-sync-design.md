# HubSpot Lead Tracking Sync — Design

Date: 2026-07-29
Status: Approved for planning

## Goal

Push lead-engagement signals to HubSpot in real time. Two sources of signal:

1. **Landing page** (`/l/[token]`) — already fully tracked today (page views, inbox
   open, AMP-preview clicks, video engagement, email submit). These land as
   `LeadEvent` rows via `POST /api/lead/[token]/event`.
2. **Real AMP email** the visitor sends to their own inbox from the landing page.
   Clicks and form submits inside that delivered email are not tracked today.

For any lead that carries a `hubspotId`, both sources should flow to the linked
HubSpot contact as (a) updated contact properties and (b) milestone timeline events.

## Scope

**In scope**
- HubSpot write path (contact properties + milestone timeline events).
- Real-time sync triggered off the existing event endpoint.
- Real-email tracking limited to the **lead's own inbox test** (the "Send it to your
  own inbox" flow), tied to a known lead token. Events: element clicks and
  `amp-form` submits.

**Out of scope**
- Tracking production AMP sends to customers' real subscriber lists.
- Open tracking for the real email (not requested).
- Any change to how `app.convertic.ai` delivers mail beyond accepting pre-instrumented
  HTML (that backend lives in a separate repo).

## Existing state (verified)

- `POST /api/lead/[token]/event/route.js` — public endpoint; stores one `LeadEvent`
  (`type`, `meta`, `sessionId`). Called via `sendBeacon`/`fetch keepalive`.
- `LeadPage` model carries optional `hubspotId`; `LeadEvent` indexed by `leadToken`.
- `src/utils/leadSummary.js#summarizeEvents(lead, events)` rolls events into the
  milestones the admin dashboard shows (incl. `stoppedAt`).
- `src/utils/hubspot.js` — currently **read-only**: `searchHubspotContacts(query)`.
- `TryItInInbox.jsx` (mode `"lead"`) POSTs `email, html, subject, from_name` directly
  to `https://app.convertic.ai/landing/lead/send`.
- Env available: `HUBSPOT_TOKEN` (private app token), `HOST_URL` (site base URL).

## Architecture

Single choke point: everything becomes a `LeadEvent`, and HubSpot sync hangs off the
event write. No parallel pipeline, no client→HubSpot calls (keeps token/scopes server-side).

```
Landing page JS ─┐
                 ├─► POST /api/lead/[token]/event ─► LeadEvent.create ─► (fire-and-forget) syncLeadToHubspot()
Real email  ─────┘        ▲                                                     │
  clicks  ► GET  /api/lead/[token]/click   (log real_amp_click, 302 redirect)   ├─► PATCH contact properties (absolute)
  submits ► POST /api/lead/[token]/amp-submit (log real_amp_submit, proxy)      └─► POST milestone timeline event (deduped)
```

### 1. HubSpot write module — extend `src/utils/hubspot.js`

- `updateContactProperties(hubspotId, props)` → `PATCH /crm/v3/objects/contacts/{id}`
  with `{ properties }`. Requires `crm.objects.contacts.write` scope.
- `createTimelineEvent(hubspotId, { eventTemplateId, tokens })` → HubSpot Timeline
  Events API. Requires a one-time **event template** provisioned in the HubSpot app
  and the timeline scope. Template id read from env (`HUBSPOT_TIMELINE_TEMPLATE_ID`).
- Both no-op cleanly (log + return) when `HUBSPOT_TOKEN` is missing, matching the
  existing `searchHubspotContacts` guard style.

### 2. Sync function — new `src/utils/hubspotSync.js`

`syncLeadToHubspot(lead, events, newEvent)`:

- **Compute absolute values from all events** — never read-modify-write HubSpot.
  Reuses `summarizeEvents(lead, events)`. Race-free and idempotent.
- Property mapping (properties are **created manually** by the user in HubSpot;
  code only writes values):

  | HubSpot property        | Type     | Source                                             |
  |-------------------------|----------|----------------------------------------------------|
  | `amp_last_event`        | string   | latest event `type`                                |
  | `amp_last_event_at`     | datetime | latest event `createdAt` (ms epoch, HubSpot format)|
  | `amp_stopped_at`        | string   | `summary.stoppedAt`                                |
  | `amp_engagement_score`  | number   | weighted score from all events (see below)         |
  | `amp_landing_url`       | string   | `${HOST_URL}/l/${lead.token}`                       |

- Engagement score weights (absolute, summed over all events):
  `page_view 1, inbox_open 3, amp_click 5, video_view 2, video_play 4,
  email_submit 10, real_amp_click 8, real_amp_submit 12`.
  `amp_click` contribution is capped (e.g. 5 clicks) so a single active session can't
  dominate the score.
- **Timeline: milestones only.** Emit a timeline event only when `newEvent.type` is one
  of `inbox_open`, `amp_click` (first only), `email_submit`, `real_amp_click` (first
  only), `real_amp_submit`. "First only" is determined by checking prior events of that
  type in the loaded set. Properties still update on *every* event.

### 3. Wire into the event route

In `POST /api/lead/[token]/event/route.js`, after `leadEvent.create`:

- If `lead.hubspotId`: load the lead's events (indexed query), call
  `syncLeadToHubspot(...)` as **fire-and-forget** with a ~2s timeout
  (`Promise.race` against a timeout; failures `console.error` only).
- Sync must never throw into the request path or change the `204` response.

### 4. Real-email tracking (lead's own inbox test)

New **send-proxy** route `POST /api/lead/[token]/send`:

1. Loads the lead, takes `lead.previewHtml` (server-side; token never exposed to client).
2. Injects tracking into the HTML:
   - **Clicks (link-wrapping):** rewrite each `<a href="X">` to
     `${HOST_URL}/api/lead/${token}/click?u=<enc(X)>&t=<label>`.
   - **`amp-form` submits:** rewrite each form's `action-xhr` to
     `${HOST_URL}/api/lead/${token}/amp-submit?u=<enc(original)>`.
3. Forwards `email, html(instrumented), subject, from_name` to
   `https://app.convertic.ai/landing/lead/send`, returns its result.

`TryItInInbox` (mode `"lead"`) calls this proxy instead of app.convertic.ai directly.

New tracking endpoints in this repo:
- `GET /api/lead/[token]/click` — records `real_amp_click`
  (`meta: { href, label }`), then `302` to the decoded original URL.
- `POST /api/lead/[token]/amp-submit` — responds with AMP-required CORS headers
  (`Access-Control-Allow-Origin` per AMP source origin, `AMP-Access-Control-Allow-Source-Origin`,
  `Access-Control-Expose-Headers`), records `real_amp_submit` (`meta` = submitted fields,
  size-capped), then proxies to the original `action-xhr` and returns its JSON.

Both reuse the same `LeadEvent` write path, so real-email events sync to HubSpot exactly
like landing-page events.

**Honest caveats**
- Link-wrapping is robust and covers CTA buttons that are `<a>` links.
- `amp-form` submit rewriting is **best-effort and template-dependent**; complex or
  nested forms may not instrument cleanly. Ship clicks first; treat submit tracking as a
  follow-on if a template resists.
- Interactive AMP renders in Gmail only because the send domain is already
  AMP-registered with Google (it is — real AMP email is sent today). The `amp-submit`
  endpoint must satisfy AMP CORS or the form will fail in-client.

### 5. New event types

Added: `real_amp_click`, `real_amp_submit`. `summarizeEvents` extended so
`stoppedAt` recognizes them (e.g. "Clicked in real email" / "Submitted in real email")
and the dashboard reflects them.

## Configuration / prerequisites

- `HUBSPOT_TOKEN` private app scopes: add `crm.objects.contacts.write` (+ timeline
  scope for timeline events). `crm.objects.contacts.read` already in use.
- New env: `HUBSPOT_TIMELINE_TEMPLATE_ID` (from the one-time event template).
- User manually creates the five `amp_*` contact properties in HubSpot with the types above.
- `HOST_URL` already present; used for absolute tracking + landing URLs.

## Error handling

- All HubSpot calls are non-blocking and swallow errors (`console.error`), never
  surfacing to the visitor or changing endpoint status codes.
- Missing `HUBSPOT_TOKEN` / `hubspotId` / template id → sync is a clean no-op.
- Redirect endpoint always redirects even if logging fails (tracking must not break UX).

## Testing

- Unit (pure functions): engagement-score/property mapping from a synthetic event set;
  HTML link-rewriter and `action-xhr` rewriter (input HTML → expected instrumented HTML).
- Milestone dedupe logic (first-click only) against ordered event fixtures.
- Manual: one live HubSpot write against a test contact (properties + one timeline event);
  one end-to-end real-email send to a personal inbox, click a wrapped link, confirm
  `real_amp_click` stored and contact updated.

## Rollout order

1. HubSpot write module + sync function + wire into event route (landing-page signals
   to HubSpot). Independently valuable.
2. Real-email click tracking (send proxy + `/click` endpoint + `TryItInInbox` switch).
3. Real-email `amp-form` submit tracking (best-effort).
