/**
 * @file +page.server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Server-side load function resolving full breed statistics and metadata for dynamic breed profile routes.
 *
 * @description
 * Matches route slug parameters against the server-side breed database, throws 404 HTTP errors if unmatched,
 * and passes the typed BreedStats object to the page component for server rendering.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';

// ---------- SERVER LOAD HANDLER

export const load: PageServerLoad = ({ params }) => {
  const breed = DOG_BREEDS_DATABASE.find((entry) => entry.id === params.slug);
  if (!breed) {
    error(404, 'Breed not found');
  }
  return { breed };
};
