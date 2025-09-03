import { NextResponse } from 'next/server';

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = 'https://convertic.ai';

  async function fetchPage(page) {
    const res = await fetch(`${process.env.HOST_URL}/api/posts?page=${page}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch posts for RSS');
    return res.json();
  }

  let posts = [];
  try {
    const first = await fetchPage(1);
    const count = first?.count || 0;
    const perPage = first?.posts?.length || 0;
    posts = first?.posts || [];

    if (perPage > 0) {
      const totalPages = Math.ceil(count / perPage);
      const remaining = [];
      for (let p = 2; p <= totalPages; p++) remaining.push(fetchPage(p));
      const rest = await Promise.allSettled(remaining);
      for (const r of rest) if (r.status === 'fulfilled') posts = posts.concat(r.value?.posts || []);
    }
  } catch (e) {
    posts = [];
  }

  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/posts/${post.slug}`;
    const title = escapeXml(post.title || '');
    const description = escapeXml((post.desc || '').replace(/<[^>]*>/g, ''));
    const pubDate = post.createdAt ? new Date(post.createdAt).toUTCString() : new Date().toUTCString();
    return `\n      <item>\n        <title>${title}</title>\n        <link>${url}</link>\n        <guid>${url}</guid>\n        <pubDate>${pubDate}</pubDate>\n        <description>${description}</description>\n      </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Convertic AI Blog</title>
      <link>${siteUrl}/blog</link>
      <description>Latest posts from Convertic AI</description>
      <language>en-us</language>${items}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300',
    },
  });
}

