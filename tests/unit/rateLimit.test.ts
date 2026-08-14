/**
 * @file rateLimit.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying in-memory IP rate limiting and sliding window calculations.
 *
 * @description
 * Tests request allowance under maximum quotas, denial and 429 response signaling when exceeding thresholds,
 * retry-after calculation accuracy, and client IP extraction headers (x-forwarded-for, x-real-ip).
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import { checkRateLimit, getClientIp } from '$lib/server/rateLimit';

// ---------- TEST SUITE
describe('rateLimit', () => {
  describe('checkRateLimit', () => {
    it('allows requests within the specified quota', () => {
      const key = `test-ip-${Date.now()}-allow`;
      const config = { maxRequests: 3, windowMs: 60000 };

      const res1 = checkRateLimit(key, config);
      expect(res1.allowed).toBe(true);

      const res2 = checkRateLimit(key, config);
      expect(res2.allowed).toBe(true);

      const res3 = checkRateLimit(key, config);
      expect(res3.allowed).toBe(true);
    });

    it('blocks requests once the quota is exceeded', () => {
      const key = `test-ip-${Date.now()}-block`;
      const config = { maxRequests: 2, windowMs: 60000 };

      checkRateLimit(key, config);
      checkRateLimit(key, config);

      const blocked = checkRateLimit(key, config);
      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfterSec).toBeDefined();
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    });
  });

  describe('getClientIp', () => {
    it('extracts IP from x-forwarded-for header', () => {
      const req = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' }
      });
      expect(getClientIp(req)).toBe('203.0.113.195');
    });

    it('falls back to x-real-ip or unknown', () => {
      const reqWithRealIp = new Request('http://localhost', {
        headers: { 'x-real-ip': '198.51.100.4' }
      });
      expect(getClientIp(reqWithRealIp)).toBe('198.51.100.4');

      const reqEmpty = new Request('http://localhost');
      expect(getClientIp(reqEmpty)).toBe('unknown');
    });
  });
});
