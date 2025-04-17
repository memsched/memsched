import { DOMAIN } from '$lib/constants';
import { handleDbError } from '$lib/server/utils.js';

import type { RequestEvent } from './$types';

export const prerender = false;

export async function GET(event: RequestEvent) {
  // Get all public user profiles
  const usernamesResult = await event.locals.usersService.getUsernames();
  if (usernamesResult.isErr()) {
    return handleDbError(usernamesResult);
  }
  const usernames = usernamesResult.value;

  // Create the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static routes -->
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${DOMAIN}/auth/signin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <!-- Documentation routes -->
  <url>
    <loc>${DOMAIN}/docs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${DOMAIN}/docs/embedding/html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${DOMAIN}/docs/customization/styling</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <!-- Legal routes -->
  <url>
    <loc>${DOMAIN}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${DOMAIN}/tos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <!-- Blog routes -->
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap><loc>${DOMAIN}/blog/sitemap-0.xml</loc></sitemap>
  </sitemapindex>
  <!-- Dynamic user profile routes -->
  ${usernames
    .map(
      (username) => `
  <url>
    <loc>${DOMAIN}/${username}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  });
}
