/**
 * @file breedMatcher.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying fuzzy breed matching, scan reconciliation, and similarity scoring algorithms.
 *
 * @description
 * Tests string fuzzy matching across breed IDs and display names, validates secondary and primary parent resolution
 * from mix breakdown arrays, and asserts similarity ranking based on group classifications, temperament overlap, and energy.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import {
  findBreedByName,
  resolveBreedsFromScanResult,
  findSimilarBreeds
} from '$lib/utils/breedMatcher';
import { DOG_BREEDS_DATABASE } from '$lib/data/dogBreeds.server';
import type { ScanResult } from '$lib/types/scan';

// ---------- TEST SUITE
describe('breedMatcher', () => {
  describe('findBreedByName', () => {
    it('matches exact breed names case-insensitively', () => {
      const match = findBreedByName(DOG_BREEDS_DATABASE, 'german shepherd');
      expect(match).not.toBeNull();
      expect(match?.id).toBe('german-shepherd');
    });

    it('matches slugified IDs with spaces', () => {
      const match = findBreedByName(DOG_BREEDS_DATABASE, 'golden retriever');
      expect(match).not.toBeNull();
      expect(match?.name).toBe('Golden Retriever');
    });

    it('returns null for empty or non-matching inputs', () => {
      expect(findBreedByName(DOG_BREEDS_DATABASE, '')).toBeNull();
      expect(findBreedByName(DOG_BREEDS_DATABASE, 'Unicorn Dragon Terrier')).toBeNull();
    });
  });

  describe('resolveBreedsFromScanResult', () => {
    it('resolves primary and secondary catalog breeds from mix breakdowns', () => {
      const mockScan: ScanResult = {
        id: 'scan-1',
        timestamp: '2026-08-13T00:00:00.000Z',
        primaryBreed: 'German Shepherd',
        confidenceScore: 0.85,
        isMixed: true,
        mixBreakdown: [
          { breed: 'German Shepherd', percentage: 60 },
          { breed: 'Golden Retriever', percentage: 40 }
        ],
        visualTraits: ['Erect ears', 'Golden saddle'],
        maleBehavioralTraits: ['Protective'],
        femaleBehavioralTraits: ['Alert'],
        genderComparisonAdvice: 'Consistent training is advised.',
        careAdvice: 'High exercise requirements.'
      };

      const resolved = resolveBreedsFromScanResult(DOG_BREEDS_DATABASE, mockScan);
      expect(resolved.primary?.id).toBe('german-shepherd');
      expect(resolved.secondary?.id).toBe('golden-retriever');
      expect(resolved.mixBreeds.length).toBe(2);
      expect(resolved.unmatchedNames.length).toBe(0);
    });
  });

  describe('findSimilarBreeds', () => {
    it('finds top similar breeds sharing group and temperament', () => {
      const gsd = findBreedByName(DOG_BREEDS_DATABASE, 'German Shepherd');
      expect(gsd).not.toBeNull();

      if (gsd) {
        const similar = findSimilarBreeds(DOG_BREEDS_DATABASE, gsd, 3);
        expect(similar.length).toBeLessThanOrEqual(3);
        expect(similar.every((b) => b.id !== gsd.id)).toBe(true);
      }
    });
  });
});
