/**
 * @file unitConverter.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying imperial to metric dog height and weight conversions.
 *
 * @description
 * Tests range conversion algorithms, regex text substitution handlers, single and dual parent mix
 * expected size formatters, and edge case handling for missing or malformed measurements.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import {
  formatWeightRange,
  formatHeightRange,
  formatMeasurementText,
  formatMixExpectedSize
} from '$lib/utils/unitConverter';

// ---------- TEST SUITE
describe('unitConverter', () => {
  describe('formatWeightRange', () => {
    it('returns original string when imperial is selected', () => {
      expect(formatWeightRange('50-70 lbs', false)).toBe('50-70 lbs');
    });

    it('converts pound ranges to kilogram ranges when metric is selected', () => {
      expect(formatWeightRange('50-70 lbs', true)).toBe('23-32 kg');
    });

    it('converts single pound values to kilograms', () => {
      expect(formatWeightRange('65 lbs', true)).toBe('29 kg');
    });

    it('handles empty input gracefully', () => {
      expect(formatWeightRange('', true)).toBe('');
    });
  });

  describe('formatHeightRange', () => {
    it('returns original string when imperial is selected', () => {
      expect(formatHeightRange('22-26 inches', false)).toBe('22-26 inches');
    });

    it('converts inch ranges to centimeter ranges when metric is selected', () => {
      expect(formatHeightRange('22-26 inches', true)).toBe('56-66 cm');
    });

    it('handles empty input gracefully', () => {
      expect(formatHeightRange('', true)).toBe('');
    });
  });

  describe('formatMeasurementText', () => {
    it('leaves prose intact when imperial is selected', () => {
      const text = 'Adult males typically weigh 60-80 lbs and stand 24-27 inches tall.';
      expect(formatMeasurementText(text, false)).toBe(text);
    });

    it('replaces all embedded units when metric is selected', () => {
      const text = 'Adult males typically weigh 60-80 lbs and stand 24-27 inches tall.';
      const expected = 'Adult males typically weigh 27-36 kg and stand 61-69 cm tall.';
      expect(formatMeasurementText(text, true)).toBe(expected);
    });
  });

  describe('formatMixExpectedSize', () => {
    it('formats combined ranges when parents have identical weights', () => {
      const parentA = { maleWeightRange: '50-70 lbs', maleHeightRange: '22-26 inches' };
      const parentB = { maleWeightRange: '50-70 lbs', maleHeightRange: '22-26 inches' };

      expect(formatMixExpectedSize(parentA, parentB, false)).toBe('50-70 lbs, 22-26 inches');
      expect(formatMixExpectedSize(parentA, parentB, true)).toBe('23-32 kg, 56-66 cm');
    });

    it('formats dual parent comparisons when weights differ', () => {
      const parentA = { maleWeightRange: '50-70 lbs', maleHeightRange: '22-26 inches' };
      const parentB = { maleWeightRange: '15-25 lbs', maleHeightRange: '12-15 inches' };

      const result = formatMixExpectedSize(parentA, parentB, false);
      expect(result).toBe('50-70 lbs / 15-25 lbs · 22-26 inches / 12-15 inches');
    });
  });
});
