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

// Fetch a single contact by its object id, including the "Website URL" property
// (internal name `website`). Returns null if unconfigured or not found.
export async function fetchContactById(id) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token || id == null) return null;
  const props = ["firstname", "lastname", "email", "company", "website"];
  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(
      String(id)
    )}?properties=${props.join(",")}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  if (!res.ok) return null;
  const r = await res.json();
  const p = r.properties || {};
  return {
    hubspotId: String(r.id ?? id),
    firstName: p.firstname || "",
    lastName: p.lastname || "",
    email: p.email || "",
    company: p.company || "",
    website: p.website || "",
  };
}

const HUBSPOT_BASE = "https://api.hubapi.com";

// Warn only once per process that the target property is missing, then skip quietly.
let warnedMissingProperty = false;

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
    // Property not created in HubSpot yet — this is a one-time setup step, not a
    // real failure. Warn once and skip so it doesn't spam the logs on every event.
    if (res.status === 400 && text.includes("PROPERTY_DOESNT_EXIST")) {
      if (!warnedMissingProperty) {
        warnedMissingProperty = true;
        console.warn(
          'HubSpot engagement sync skipped: create a "Multi-line text" contact ' +
            'property named "amp_engagement" in HubSpot to enable it. (Tracking is ' +
            "unaffected.)"
        );
      }
      return { skipped: true };
    }
    throw new Error(
      `HubSpot property update ${res.status}: ${text.slice(0, 200)}`
    );
  }
  return res.json();
}

// Create or update a contact keyed by email. Uses HubSpot's upsert batch endpoint
// with idProperty "email" so a repeat submit updates the existing contact instead
// of creating a duplicate. No-op (returns {skipped}) when unconfigured so callers
// can fire it safely. Returns { id } on success. Requires HUBSPOT_TOKEN with scope
// crm.objects.contacts.write.
export async function upsertContactByEmail(email, properties = {}) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token || !email) return { skipped: true };

  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/batch/upsert`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            idProperty: "email",
            id: email,
            properties: { email, ...properties },
          },
        ],
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot contact upsert ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return { id: data.results?.[0]?.id || null };
}

// Merge one contact into another. The primary survives (keeps its id and primary
// email); the merged contact's data — including its email, as a secondary — folds
// into the primary. Irreversible in HubSpot. Requires crm.objects.contacts.write.
// No-ops when unconfigured, ids missing, or the two ids are the same.
export async function mergeContacts(primaryObjectId, objectIdToMerge) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token || !primaryObjectId || !objectIdToMerge) return { skipped: true };
  if (String(primaryObjectId) === String(objectIdToMerge)) return { skipped: true };

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/merge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primaryObjectId: String(primaryObjectId),
      objectIdToMerge: String(objectIdToMerge),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot merge ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json().catch(() => ({}));
  return { id: data.id || String(primaryObjectId) };
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
