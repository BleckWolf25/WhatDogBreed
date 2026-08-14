/**
 * @file +server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary REST API endpoint receiving user feedback and accuracy corrections for breed scan results.
 *
 * @description
 * Enforces per-client IP rate limiting (10 requests/hour), parses and validates structured feedback payloads,
 * logs accuracy telemetry to observability streams, and returns sanitized status responses.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logFeedbackEvent } from '$lib/server/observability/feedbackLogger';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '$lib/server/rateLimit';

// ---------- HTTP POST ENDPOINT

export const POST: RequestHandler = async ({ request }) => {
  // ---------- RATE LIMIT CHECK
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`feedback:${clientIp}`, RATE_LIMITS.feedback);

  if (!rateLimit.allowed) {
    return json(
      { error: 'Too many feedback submissions. Please try again later.' },
      {
        status: 429,
        headers: rateLimit.retryAfterSec
          ? { 'Retry-After': String(rateLimit.retryAfterSec) }
          : undefined
      }
    );
  }

  // ---------- BODY PARSING
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { scanId, reportedBreed, expectedBreed, note, analysisSource, confidenceScore } =
    body as Record<string, unknown>;

  // ---------- INPUT VALIDATION GUARDS
  if (typeof scanId !== 'string' || scanId.trim() === '') {
    return json({ error: 'Scan ID is required.' }, { status: 400 });
  }

  if (typeof reportedBreed !== 'string' || reportedBreed.trim() === '') {
    return json({ error: 'Reported breed is required.' }, { status: 400 });
  }

  if (typeof expectedBreed !== 'string' || expectedBreed.trim() === '') {
    return json({ error: 'Expected breed is required.' }, { status: 400 });
  }

  if (expectedBreed.length > 120 || (typeof note === 'string' && note.length > 500)) {
    return json({ error: 'Input is too long.' }, { status: 400 });
  }

  // ---------- LOG TELEMETRY
  logFeedbackEvent({
    event: 'scan_feedback',
    scanId: scanId.trim(),
    reportedBreed: reportedBreed.trim(),
    expectedBreed: expectedBreed.trim(),
    note: typeof note === 'string' && note.trim() ? note.trim() : undefined,
    analysisSource: typeof analysisSource === 'string' ? analysisSource : undefined,
    confidenceScore: typeof confidenceScore === 'number' ? confidenceScore : undefined
  });

  return json({ ok: true }, { status: 200 });
};
