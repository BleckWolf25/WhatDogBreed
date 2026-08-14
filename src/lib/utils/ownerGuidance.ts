/**
 * @file ownerGuidance.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Resolves and enriches structured owner guidance objects from scan results and catalog breed records.
 *
 * @description
 * Inspects incoming scan results for pre-existing owner guidance payloads, enriches missing sections using catalog breed data,
 * and synthesizes off-catalog guidance with adoptability advice when encountering unregistered mixes.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { BreedStats, OwnerGuidance, ScanResult } from '$lib/types/scan';
import {
  buildOffCatalogOwnerGuidance,
  buildOwnerGuidanceFromCatalog
} from '$lib/guidance/buildOwnerGuidance';

// ---------- GUIDANCE RESOLVER

export function resolveOwnerGuidance(
  result: Pick<
    ScanResult,
    'primaryBreed' | 'isMixed' | 'mixBreakdown' | 'careAdvice' | 'ownerGuidance'
  >,
  catalogMatches: { primary: BreedStats | null; secondary: BreedStats | null }
): OwnerGuidance {
  if (result.ownerGuidance) {
    return result.ownerGuidance;
  }

  if (catalogMatches.primary) {
    return buildOwnerGuidanceFromCatalog(catalogMatches.primary, {
      secondary: catalogMatches.secondary,
      isMixed: result.isMixed
    });
  }

  if (result.careAdvice && result.careAdvice.length > 80) {
    return {
      ...buildOffCatalogOwnerGuidance(result.primaryBreed, {
        isMixed: result.isMixed,
        mixComponents: result.mixBreakdown.map((m) => m.breed)
      }),
      adoptabilitySummary: result.careAdvice
    };
  }

  return buildOffCatalogOwnerGuidance(result.primaryBreed, {
    isMixed: result.isMixed,
    mixComponents: result.mixBreakdown.map((m) => m.breed)
  });
}
