import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const posts = await getCollection('blog');

  const staticUrls = ['/', '/blog/', '/faq/'].map((p) => ({
    loc: `${base}${p}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: p === '/' ? '1.0' : '0.8',
  }));

  const postUrls = posts.map((post) => ({
    loc: `${base}/blog/${post.id}/`,
    lastmod: post.data.date.toISOString(),
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const urls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
