// Server-side HubSpot CRM contact search using a Private App token.
// Requires HUBSPOT_TOKEN (scopes: crm.objects.contacts.read).
export async function searchHubspotContacts(query) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    const err = new Error("HUBSPOT_TOKEN is not set");
    err.code = "NO_TOKEN";
    throw err;
  }

  const res = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/search",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 10,
        properties: ["firstname", "lastname", "email", "company"],
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`HubSpot API error ${res.status}`);
  }

  const data = await res.json();
  return (data.results || []).map((r) => ({
    hubspotId: r.id,
    firstName: r.properties?.firstname || "",
    lastName: r.properties?.lastname || "",
    email: r.properties?.email || "",
    company: r.properties?.company || "",
  }));
}

const HUBSPOT_BASE = "https://api.hubapi.com";

// Patch contact properties. No-op (returns {skipped}) when unconfigured so callers
// can fire this safely. Throws only on a real HubSpot API error (caller wraps it).
// Requires HUBSPOT_TOKEN with scope crm.objects.contacts.write.
export async function updateContactProperties(hubspotId, properties) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token || !hubspotId) return { skipped: true };

  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(hubspotId)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HubSpot property update ${res.status}: ${text.slice(0, 200)}`
    );
  }
  return res.json();
}

// Append a custom event to a contact's timeline. No-op unless HUBSPOT_TOKEN and
// HUBSPOT_TIMELINE_TEMPLATE_ID are set (a one-time event template provisioned in
// the HubSpot app). Requires the timeline scope on the token.
export async function createTimelineEvent(
  hubspotId,
  { tokens = {}, timestamp } = {}
) {
  const token = process.env.HUBSPOT_TOKEN;
  const templateId = process.env.HUBSPOT_TIMELINE_TEMPLATE_ID;
  if (!token || !hubspotId || !templateId) return { skipped: true };

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/timeline/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventTemplateId: templateId,
      objectId: String(hubspotId),
      tokens,
      ...(timestamp ? { timestamp } : {}),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HubSpot timeline event ${res.status}: ${text.slice(0, 200)}`
    );
  }
  return res.json();
}
