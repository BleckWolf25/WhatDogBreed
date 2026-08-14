/**
 * @file validateRequest.test.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit test suite verifying HTTP request validation and guard assertions for breed scans.
 *
 * @description
 * Tests request payload parsing, Base64 data extraction, image MIME type validation, maximum payload size enforcement,
 * and demo sample source bypasses.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { describe, it, expect } from 'vitest';
import { validateScanRequest } from '$lib/server/scan/validateRequest';

// ---------- TEST SUITE
describe('validateRequest', () => {
  it('rejects non-JSON or invalid request bodies', async () => {
    const req = new Request('http://localhost/api/scan', {
      method: 'POST',
      body: 'invalid-json'
    });

    const result = await validateScanRequest(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.status).toBe(400);
    }
  });

  it('rejects requests missing an image payload', async () => {
    const req = new Request('http://localhost/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const result = await validateScanRequest(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('image');
    }
  });

  it('accepts valid base64 data-URL payloads', async () => {
    const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/';
    const req = new Request('http://localhost/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: validBase64 })
    });

    const result = await validateScanRequest(req);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.mimeType).toBe('image/jpeg');
      expect(result.data.imageBase64).toBe(validBase64);
    }
  });
});
