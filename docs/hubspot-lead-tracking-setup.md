# HubSpot Lead Tracking — Setup Guide

This app pushes lead engagement (landing page + real-email test) to the matching
HubSpot contact. To turn it on you need to do three things in HubSpot + env. Nothing
here is destructive; if a step is skipped, the code no-ops gracefully.

---

## 1. Private app scopes

Settings → Integrations → **Private Apps** → your app → **Scopes**. Ensure these are
checked, then copy the access token into `HUBSPOT_TOKEN`:

- `crm.objects.contacts.read`  ← already used (contact search)
- `crm.objects.contacts.write` ← **new** (writing engagement properties)

The token you already have in `HUBSPOT_TOKEN` just needs the `write` scope added.
After changing scopes, HubSpot may issue a new token — update the env var if so.

---

## 2. Create 1 contact property

Settings → Data Management → **Properties** → Contact properties → **Create property**.
Create a single property. The **internal name must match exactly** (HubSpot lowercases
and underscores automatically, but verify the internal name after saving):

| Label          | Internal name    | Field type          |
|----------------|------------------|---------------------|
| AMP Engagement | `amp_engagement` | Multi-line text     |

On every tracked event the code overwrites this property with a readable summary:

```
Score: 38
Furthest: Clicked in real email
Last event: real_amp_click (Jul 30, 2026)
Page: https://convertic.ai/l/abc123
```

What each line means:
- **Score** — absolute weighted engagement score, recomputed from all events
  (page_view 1, inbox_open 3, amp_click 5 ×capped-at-5, video_view 2, video_play 4,
  email_submit 10, real_amp_click 8, real_amp_submit 12).
- **Furthest** — furthest milestone reached; mirrors the admin dashboard (`Opened page`,
  `Opened inbox email`, `Clicked in AMP email`, `Viewed video`, `Played video`,
  `Submitted email`, `Clicked in real email`, `Submitted in real email`).
- **Last event** — most recent event type and its date.
- **Page** — the lead's personalized landing page.

That's all that's required for property sync to work.

> Note: because everything lives in one text property, you can't build HubSpot list
> filters on the numeric score or the date individually. If you later want to segment on
> those, split them back into separate properties (see git history for the 5-property
> version).

---

## 3. (Optional) Timeline milestone events

Contact-record timeline entries for key milestones (inbox open, first click, email
submit, real-email click/submit). This is **optional** — properties alone already give
you milestone + score data. Timeline events need a one-time event template.

Timeline events are provisioned against a HubSpot **app**. Create an event template
(one-time), then put its id in `HUBSPOT_TIMELINE_TEMPLATE_ID`:

```bash
curl -X POST \
  "https://api.hubapi.com/crm/v3/timeline/event-templates?appId=YOUR_APP_ID" \
  -H "Authorization: Bearer $HUBSPOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Convertic AMP Engagement",
    "objectType": "contacts",
    "headerTemplate": "{{milestone}}",
    "detailTemplate": "Event: {{eventType}} — {{detail}}",
    "tokens": [
      { "name": "eventType", "label": "Event type", "type": "string" },
      { "name": "milestone", "label": "Milestone", "type": "string" },
      { "name": "detail",    "label": "Detail",    "type": "string" }
    ]
  }'
```

Copy the `id` from the response into `HUBSPOT_TIMELINE_TEMPLATE_ID`.

If `HUBSPOT_TIMELINE_TEMPLATE_ID` is left unset, timeline pushes are skipped and only
properties are written — no errors.

> Heads up: timeline event templates are an app-level HubSpot feature. If your account
> plan makes this awkward, skip section 3 entirely — you still get the full property
> sync from sections 1–2.

---

## 4. Environment variables

| Variable                       | Required | Purpose                                  |
|--------------------------------|----------|------------------------------------------|
| `HUBSPOT_TOKEN`                | yes      | Private app token (read + write scopes)  |
| `HOST_URL`                     | yes*     | Site base URL for the landing link in `amp_engagement` + real-email tracking links (already set) |
| `HUBSPOT_TIMELINE_TEMPLATE_ID` | no       | Enables timeline milestone events        |

\* `HOST_URL` is already configured for this app.

---

## 5. How to link a lead to a contact

Property/timeline sync only fires for leads that have a `hubspotId`. That's set when the
lead page is created (admin flow uses the HubSpot contact search to attach it). Leads
without a linked contact are still tracked in the dashboard — they're just not pushed.

---

## 6. Verifying it works

1. Create a lead page linked to a test HubSpot contact.
2. Open the lead's `/l/<token>` page, open the inbox email, click inside the preview.
3. In HubSpot, open the test contact → the `amp_engagement` property should populate
   within a couple of seconds (score, furthest milestone, last event, page); with a
   timeline template configured, milestone entries also appear on the activity timeline.
4. For the real-email test: use "Send it to your own inbox", open the delivered email,
   click a link → `amp_engagement` updates to `Furthest: Clicked in real email` (plus a
   timeline entry if configured).

Failures are logged server-side (`hubspot sync error …`) and never affect the visitor.
