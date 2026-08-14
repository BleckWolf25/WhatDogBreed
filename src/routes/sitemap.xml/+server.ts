/**
 * @file +server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Static XML Sitemap generator endpoint indexing all application routes and individual breed profiles.
 *
 * @description
 * Generates an SEO-compliant XML sitemap enumerating core application routes and dynamic breed profile pages
 * for search engine discovery and indexation.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';

// ---------- CONSTANTS

const SITE = 'https://whatdogbreed.app';

const STATIC_ROUTES = [
  '/',
  '/scanner',
  '/encyclopedia',
  '/mixer',
  '/compare',
  '/history',
  '/help',
  '/privacy',
  '/terms'
];

// ---------- CONFIGURATION

export const prerender = true;

// ---------- HTTP GET ENDPOINT

export function GET() {
  const urls = [
    ...STATIC_ROUTES.map((path) => `${SITE}${path === '/' ? '' : path}`),
    ...DOG_BREEDS_DATABASE.map((breed) => `${SITE}/breeds/${breed.id}`)
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
