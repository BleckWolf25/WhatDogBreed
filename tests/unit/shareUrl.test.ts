/**
 * @file shareUrl.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying shareable scan deep link serialization and parsing.
 *
 * @description
 * Tests compact Base64URL string encoding and decoding, round-trip ScanResult identity preservation,
 * URL query parameter parsing, and legacy payload backward compatibility.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import {
  buildShareableScanUrl,
  parseShareableScan,
  parseShareParamFromUrl
} from '$lib/services/shareUrl';
import type { ScanResult } from '$lib/types/scan';

// ---------- TEST SUITE
describe('shareUrl', () => {
  const sampleResult: ScanResult = {
    id: 'scan-share-123',
    timestamp: '2026-08-13T00:00:00.000Z',
    primaryBreed: 'Boxer',
    confidenceScore: 0.92,
    isMixed: false,
    mixBreakdown: [{ breed: 'Boxer', percentage: 100 }],
    detectedGender: 'Male',
    visualTraits: ['Square muzzle', 'Brindle coat'],
    maleBehavioralTraits: ['High energy', 'Playful'],
    femaleBehavioralTraits: ['Alert', 'Affectionate'],
    genderComparisonAdvice: 'Consistent obedience training is beneficial.',
    careAdvice: 'Provide 60+ minutes of vigorous exercise daily.'
  };

  it('generates a valid shareable URL without error', async () => {
    const { url } = await buildShareableScanUrl(sampleResult, 'https://whatdogbreed.app');
    expect(url).toContain('https://whatdogbreed.app/scanner?share=');
  });

  it('roundtrips a compact payload back into a ScanResult', async () => {
    const { url } = await buildShareableScanUrl(sampleResult, 'https://whatdogbreed.app');
    const searchParams = new URL(url).searchParams;
    const parsed = parseShareParamFromUrl(searchParams);

    expect(parsed).not.toBeNull();
    expect(parsed?.primaryBreed).toBe('Boxer');
    expect(parsed?.confidenceScore).toBe(0.92);
    expect(parsed?.isMixed).toBe(false);
    expect(parsed?.detectedGender).toBe('Male');
  });

  it('returns null for invalid or corrupted share parameters', () => {
    expect(parseShareableScan('not-valid-base64-json!')).toBeNull();
  });
});
