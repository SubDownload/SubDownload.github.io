import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.data.title)}</title>
      <link>${base}/blog/${p.id}/</link>
      <guid isPermaLink="true">${base}/blog/${p.id}/</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      ${p.data.description ? `<description>${escape(p.data.description)}</description>` : ''}
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SubDownload Blog</title>
    <link>${base}/</link>
    <description>Field notes, guides, and updates from building SubDownload — turning YouTube into searchable text for your AI agents.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
