/**
 * @file +server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary REST API endpoint providing HTTP GET access to the full canonical dog breed dataset.
 *
 * @description
 * Returns all dog breed statistical records as JSON with aggressive edge CDN and browser caching headers (24hr max-age).
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';

// ---------- HTTP GET ENDPOINT

export const GET: RequestHandler = async () => {
  return json(DOG_BREEDS_DATABASE, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
    }
  });
};
