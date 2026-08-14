/**
 * @file breedMatcher.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Fuzzy breed identity matching, scan result reconciliation, and morphological similarity scoring.
 *
 * @description
 * Matches raw model breed names and URL identifiers against encyclopedia records, resolves primary and secondary
 * parent candidates from scan breakdown arrays, and ranks similar breeds based on shared group classification, temperament traits, and energy levels.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { BreedStats, ScanResult } from '$lib/types/scan';

// ---------- TYPES

export interface ResolvedScanBreeds {
  primary: BreedStats | null;
  secondary: BreedStats | null;
  mixBreeds: BreedStats[];
  unmatchedNames: string[];
}

// ---------- MATCHING UTILITIES

export function findBreedByName(breeds: BreedStats[], name: string): BreedStats | null {
  if (!name?.trim()) return null;

  const query = name.toLowerCase().trim();

  return (
    breeds.find(
      (breed) =>
        query.includes(breed.name.toLowerCase()) ||
        breed.name.toLowerCase().includes(query) ||
        query.includes(breed.id.replace(/-/g, ' '))
    ) ?? null
  );
}

export function resolveBreedsFromScanResult(
  breeds: BreedStats[],
  result: ScanResult
): ResolvedScanBreeds {
  const mixBreeds: BreedStats[] = [];
  const unmatchedNames: string[] = [];
  const seenIds = new Set<string>();

  // ---------- MIX BREAKDOWN MAPPING
  for (const item of result.mixBreakdown) {
    const match = findBreedByName(breeds, item.breed);
    if (match && !seenIds.has(match.id)) {
      mixBreeds.push(match);
      seenIds.add(match.id);
    } else if (!match) {
      unmatchedNames.push(item.breed);
    }
  }

  // ---------- PRIMARY BREED IDENTIFICATION
  let primary = findBreedByName(breeds, result.primaryBreed);
  if (!primary && mixBreeds.length > 0) {
    primary = mixBreeds[0] ?? null;
  }

  const secondary = mixBreeds.find((b) => b.id !== primary?.id) ?? mixBreeds[1] ?? null;

  return { primary, secondary, mixBreeds, unmatchedNames };
}

export function findSimilarBreeds(
  breeds: BreedStats[],
  breed: BreedStats,
  limit = 4
): BreedStats[] {
  return breeds
    .filter((candidate) => candidate.id !== breed.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.group === breed.group) score += 3;
      for (const trait of breed.temperament) {
        if (candidate.temperament.includes(trait)) score += 1;
      }
      if (Math.abs(candidate.energyLevel - breed.energyLevel) <= 1) score += 1;
      return { breed: candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ breed: matched }) => matched);
}
