/**
 * @file buildOwnerGuidance.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying catalog and off-catalog owner guidance synthesis.
 *
 * @description
 * Tests generation of daily care plans, veterinary watchlists, training tips, and lifestyle compatibility
 * metrics derived from catalog breed statistics and dynamic mixed-breed parent pairs.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import {
  buildOwnerGuidanceFromCatalog,
  buildOffCatalogOwnerGuidance
} from '$lib/guidance/buildOwnerGuidance';
import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';

// ---------- TEST SUITE
describe('buildOwnerGuidance', () => {
  it('builds comprehensive guidance for a catalog purebred breed', () => {
    const gsd = DOG_BREEDS_DATABASE.find((b) => b.id === 'german-shepherd');
    expect(gsd).toBeDefined();

    if (gsd) {
      const guidance = buildOwnerGuidanceFromCatalog(gsd, { isMixed: false });
      expect(guidance.carePlan).toBeDefined();
      expect(guidance.carePlan.exercise).toContain('minutes');
      expect(guidance.healthWatchlist.length).toBeGreaterThan(0);
      expect(guidance.trainingTips.length).toBeGreaterThan(0);
      expect(guidance.ownershipCosts.monthlyEstimate).toBeDefined();
    }
  });

  it('builds balanced guidance for a crossbreed with two parents', () => {
    const gsd = DOG_BREEDS_DATABASE.find((b) => b.id === 'german-shepherd');
    const golden = DOG_BREEDS_DATABASE.find((b) => b.id === 'golden-retriever');

    if (gsd && golden) {
      const guidance = buildOwnerGuidanceFromCatalog(gsd, {
        secondary: golden,
        isMixed: true
      });

      expect(guidance.estimatedAdultSize).toContain('Mix estimate');
      expect(guidance.carePlan.diet).toBeDefined();
    }
  });

  it('generates coherent off-catalog guidance for unrecognized breeds', () => {
    const guidance = buildOffCatalogOwnerGuidance('Rare Mountain Hound', {
      isMixed: true,
      mixComponents: ['Hound', 'Shepherd']
    });

    expect(guidance.carePlan.exercise).toContain('Rare Mountain Hound');
    expect(guidance.healthWatchlist.length).toBeGreaterThan(0);
    expect(guidance.adoptionContext).toBeDefined();
  });
});
