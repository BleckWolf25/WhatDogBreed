/**
 * @file +page.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Static entries definition and prerender configuration for individual dynamic breed profile routes.
 *
 * @description
 * Inspects the canonical dog breed dataset at build time, enumerates all unique breed slug parameters,
 * and enables full SSG prerendering across all 65+ encyclopedia breed profile pages.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import breedsJson from '$lib/data/dogBreeds.json';
import type { BreedStats } from '$lib/types/scan';

// ---------- CONFIGURATION

export const prerender = true;

// ---------- STATIC ROUTE ENUMERATION

export function entries() {
  return (breedsJson as BreedStats[]).map((breed) => ({ slug: breed.id }));
}
