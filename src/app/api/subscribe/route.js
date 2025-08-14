import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email;
    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    const token = process.env.CONVERTIC_API_TOKEN;
    const listUid = process.env.CONVERTIC_LIST_UID;
    if (!token || !listUid) {
      return NextResponse.json({ message: 'Server is not configured' }, { status: 500 });
    }

    const form = new URLSearchParams({
      api_token: token,
      list_uid: listUid,
      EMAIL: email,
    });

    const res = await fetch('https://app.convertic.ai/public/api/v2/subscribers', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ message: 'Upstream error', details: txt }, { status: 502 });
    }

    // Return minimal info
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ message: 'Internal error', error: e.message }, { status: 500 });
  }
}

