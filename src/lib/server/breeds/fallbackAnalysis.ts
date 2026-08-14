/**
 * @file fallbackAnalysis.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Deterministic signature-based fallback analyzer for offline, demo sample, or rate-limited environments.
 *
 * @description
 * Computes deterministic integer hashes from image bitstreams, selects primary and secondary breed profiles
 * from the database, synthesizes percentage breakdowns and morphological descriptions, and constructs complete owner guidance objects.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';
import { buildOwnerGuidanceFromCatalog, summarizeCarePlan } from '$lib/guidance/buildOwnerGuidance';
import type { ScanResult } from '$lib/types/scan';

// ---------- HELPER FUNCTIONS

function computeImageSignatureHash(cleanBase64: string): number {
  let hash = 0;
  const step = Math.max(1, Math.floor(cleanBase64.length / 500));
  for (let i = 0; i < cleanBase64.length; i += step) {
    const charCode = cleanBase64.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---------- FALLBACK GENERATOR

export function generateFeatureHashAnalysisResult(
  cleanBase64: string,
  userGender?: 'Male' | 'Female',
  presetBreedName?: string | null
): Omit<ScanResult, 'id' | 'timestamp' | 'imageUrl'> {
  const defaultBreed = DOG_BREEDS_DATABASE[0]!;
  let primaryBreedObj = defaultBreed;

  // ---------- PRIMARY BREED RESOLUTION
  if (presetBreedName) {
    const matched = DOG_BREEDS_DATABASE.find(
      (b) => b.name.toLowerCase() === presetBreedName.toLowerCase()
    );
    if (matched) {
      primaryBreedObj = matched;
    }
  } else {
    const seed = computeImageSignatureHash(cleanBase64);
    const primaryIndex = seed % DOG_BREEDS_DATABASE.length;
    primaryBreedObj = DOG_BREEDS_DATABASE[primaryIndex] ?? defaultBreed;
  }

  // ---------- CONFIDENCE CALCULATION
  const confidenceScore = presetBreedName
    ? Number((0.88 + (computeImageSignatureHash(cleanBase64) % 4) / 100).toFixed(2))
    : Number((0.64 + (computeImageSignatureHash(cleanBase64) % 6) / 100).toFixed(2));

  // ---------- PROPORTION ALLOCATION
  const primaryPercentage = presetBreedName ? 88 : 62;
  const secondaryPercentage = Math.round((100 - primaryPercentage) * 0.7);
  const tertiaryPercentage = 100 - primaryPercentage - secondaryPercentage;

  const secondaryIndex =
    (DOG_BREEDS_DATABASE.indexOf(primaryBreedObj) + 3) % DOG_BREEDS_DATABASE.length;
  const secondaryBreedObj = DOG_BREEDS_DATABASE[secondaryIndex] ?? defaultBreed;

  const mixBreakdown = [
    { breed: primaryBreedObj.name, percentage: primaryPercentage },
    { breed: secondaryBreedObj.name, percentage: secondaryPercentage }
  ];

  if (tertiaryPercentage > 0) {
    mixBreakdown.push({ breed: 'Ancestral / Other', percentage: tertiaryPercentage });
  }

  // ---------- TRAIT SYNTHESIS
  const firstTemperament = primaryBreedObj.temperament[0]?.toLowerCase() ?? 'alert';
  const visualTraits = [
    `Cranial structure and stop angle characteristic of ${primaryBreedObj.name} lineage`,
    `Coat texture and coloring showing ${primaryBreedObj.group} heritage`,
    `Body frame density and ear carriage displaying ${firstTemperament} focus`
  ];

  const detectedGender = userGender || 'Male';

  const ownerGuidance = buildOwnerGuidanceFromCatalog(primaryBreedObj, {
    secondary: secondaryBreedObj,
    isMixed: !presetBreedName || primaryPercentage < 90
  });

  // ---------- OUTPUT SYNTHESIS
  return {
    primaryBreed: presetBreedName ? primaryBreedObj.name : `${primaryBreedObj.name} Mix`,
    isMixed: !presetBreedName || primaryPercentage < 90,
    confidenceScore,
    aiModelUsed: presetBreedName ? 'Demo sample (no AI vision)' : 'Local estimate (no AI vision)',
    detectedGender,
    mixBreakdown,
    visualTraits,
    maleBehavioralTraits: primaryBreedObj.maleBehavioralTraits,
    femaleBehavioralTraits: primaryBreedObj.femaleBehavioralTraits,
    genderComparisonAdvice: primaryBreedObj.genderBehaviorSummary,
    careAdvice: summarizeCarePlan(ownerGuidance.carePlan),
    ownerGuidance
  };
}
