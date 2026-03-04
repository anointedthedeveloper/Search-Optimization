import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://search.anobyte.online';
  const today = new Date().toISOString().split('T')[0];

  // Define all URLs to be indexed
  const urls = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
    },
    // Primary keyword searches
    {
      loc: `${baseUrl}?q=anointedthedeveloper`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.95',
    },
    {
      loc: `${baseUrl}?q=anointed`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}?q=agunloye`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}?q=anobyte`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
    // Secondary searches
    {
      loc: `${baseUrl}?q=anointed+agunloye`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}?q=agunloye+anointed`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}?q=github`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}?q=anobyte.online`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}?q=web+developer`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}?q=portfolio`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}?q=anointed+the+developer`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}?q=anointedthedeveloper+github`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.75',
    },
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <mobile:mobile/>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
