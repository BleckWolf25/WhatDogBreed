/**
 * @file parseResponse.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying Gemini AI JSON analysis response normalization and validation.
 *
 * @description
 * Tests raw structured payload normalization, non-canine rejection assertions, confidence scoring fallbacks,
 * and mix breakdown integrity enforcement.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import {
  parseGeminiAnalysisResponse,
  type GeminiAnalysisPayload
} from '$lib/server/ai/parseResponse';

// ---------- TEST SUITE
describe('parseResponse', () => {
  it('normalizes valid structured AI response payload', () => {
    const payload: GeminiAnalysisPayload = {
      isDog: true,
      primaryBreed: 'Rottweiler',
      isMixed: false,
      confidenceScore: 0.95,
      detectedGender: 'Male',
      mixBreakdown: [{ breed: 'Rottweiler', percentage: 100 }],
      visualTraits: ['Broad skull', 'Tan markings'],
      maleBehavioralTraits: ['Confident'],
      femaleBehavioralTraits: ['Devoted'],
      genderComparisonAdvice: 'Early socialization is important.',
      careAdvice: 'High strength, requires experienced handler.'
    };

    const parsed = parseGeminiAnalysisResponse(payload);
    expect(parsed.primaryBreed).toBe('Rottweiler');
    expect(parsed.confidenceScore).toBe(0.95);
    expect(parsed.isMixed).toBe(false);
    expect(parsed.detectedGender).toBe('Male');
  });

  it('applies default fallbacks for optional fields', () => {
    const minimalPayload: GeminiAnalysisPayload = {
      isDog: true,
      primaryBreed: 'Pug',
      isMixed: false
    };

    const parsed = parseGeminiAnalysisResponse(minimalPayload);
    expect(parsed.primaryBreed).toBe('Pug');
    expect(parsed.confidenceScore).toBe(0.92);
    expect(parsed.detectedGender).toBe('Unspecified');
  });

  it('throws descriptive error when isDog is false or error message is returned', () => {
    const nonDogPayload: GeminiAnalysisPayload = {
      isDog: false,
      error: 'The uploaded image appears to be a cat, not a dog.'
    };

    expect(() => parseGeminiAnalysisResponse(nonDogPayload)).toThrow(
      'The uploaded image appears to be a cat, not a dog.'
    );
  });
});
