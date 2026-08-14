/**
 * @file dogBreeds.server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Server-side database access, prompt hint generator, and in-memory search for the breed catalog.
 *
 * @description
 * Synchronously loads and sorts the full canonical breed dataset for server-side endpoints, extracts concise
 * name lists for LLM system prompt context windows, and provides synchronous search filtering.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import breedsJson from '$lib/data/dogBreeds.json';
import type { BreedStats } from '$lib/types/scan';

// ---------- CONSTANTS

export const BREED_CATALOG_COUNT = (breedsJson as BreedStats[]).length;

export const DOG_BREEDS_DATABASE: BreedStats[] = [...(breedsJson as BreedStats[])].sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
);

// ---------- PROMPT UTILITIES

export function getPromptBreedHintList(): string {
  return DOG_BREEDS_DATABASE.map((breed) => breed.name).join(', ');
}

// ---------- QUERY UTILITIES

export function searchDogBreeds(query: string): BreedStats[] {
  if (!query || query.trim() === '') return DOG_BREEDS_DATABASE;

  const normalized = query.toLowerCase().trim();

  return DOG_BREEDS_DATABASE.filter(
    (breed) =>
      breed.name.toLowerCase().includes(normalized) ||
      breed.group.toLowerCase().includes(normalized) ||
      breed.originCountry.toLowerCase().includes(normalized) ||
      breed.temperament.some((trait) => trait.toLowerCase().includes(normalized))
  );
}
