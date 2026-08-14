/**
 * @file +server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary REST API endpoint handling image upload verification, Gemini vision analysis, and scan telemetry logging.
 *
 * @description
 * Enforces per-client IP rate limits (15 requests/hour), validates payload sizes and MIME types, dispatches multimodal analysis
 * to Gemini vision models (or local feature-hash fallbacks), constructs canonical ScanResult responses, and records latency metrics.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analyzeImage } from '$lib/server/scan/analyzeImage';
import { validateScanRequest } from '$lib/server/scan/validateRequest';
import { getGeminiKey } from '$lib/server/env';
import { logScanEvent } from '$lib/server/observability/scanLogger';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '$lib/server/rateLimit';
import { GEMINI_VISION_MODEL } from '$lib/server/ai/geminiVisionAnalyzer';
import type { ScanResult } from '$lib/types/scan';

// ---------- CONFIGURATION

export const config = {
  maxDuration: 10
};

// ---------- HTTP POST ENDPOINT

export const POST: RequestHandler = async ({ request, platform }) => {
  const startedAt = Date.now();
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`scan:${clientIp}`, RATE_LIMITS.scan);

  // ---------- RATE LIMIT CHECK
  if (!rateLimit.allowed) {
    logScanEvent({
      event: 'scan_failed',
      durationMs: Date.now() - startedAt,
      success: false,
      error: 'Rate limit exceeded'
    });
    return json(
      { error: 'Too many scans from this connection. Please wait before trying again.' },
      {
        status: 429,
        headers: rateLimit.retryAfterSec
          ? { 'Retry-After': String(rateLimit.retryAfterSec) }
          : undefined
      }
    );
  }

  // ---------- REQUEST VALIDATION
  const validation = await validateScanRequest(request);

  if (!validation.ok) {
    logScanEvent({
      event: 'scan_failed',
      durationMs: Date.now() - startedAt,
      success: false,
      error: validation.error.message
    });
    return json({ error: validation.error.message }, { status: validation.error.status });
  }

  const { imageBase64, mimeType, selectedGender, sampleSource } = validation.data;

  // ---------- EXECUTE ANALYSIS
  try {
    const apiKey = getGeminiKey(platform);
    const {
      analysis: analysisOutput,
      source,
      isDemoSample
    } = await analyzeImage(imageBase64, mimeType, apiKey, selectedGender, sampleSource);

    const fullResult: ScanResult = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      primaryBreed: analysisOutput.primaryBreed,
      isMixed: analysisOutput.isMixed,
      confidenceScore: analysisOutput.confidenceScore,
      aiModelUsed: analysisOutput.aiModelUsed,
      analysisSource: source,
      isDemoSample,
      detectedGender: analysisOutput.detectedGender || selectedGender || 'Unspecified',
      mixBreakdown: analysisOutput.mixBreakdown,
      visualTraits: analysisOutput.visualTraits,
      maleBehavioralTraits: analysisOutput.maleBehavioralTraits || [],
      femaleBehavioralTraits: analysisOutput.femaleBehavioralTraits || [],
      genderComparisonAdvice: analysisOutput.genderComparisonAdvice || '',
      careAdvice: analysisOutput.careAdvice,
      ownerGuidance: analysisOutput.ownerGuidance
    };

    // ---------- LOG SUCCESS TELEMETRY
    logScanEvent({
      event: 'scan_complete',
      durationMs: Date.now() - startedAt,
      model: source === 'gemini' ? GEMINI_VISION_MODEL : 'fallback',
      fallback: source === 'fallback',
      success: true
    });

    return json(fullResult, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'An error occurred while analyzing the dog photo. Please try again.';

    // ---------- LOG FAILURE TELEMETRY
    logScanEvent({
      event: 'scan_failed',
      durationMs: Date.now() - startedAt,
      success: false,
      error: message
    });

    return json({ error: message }, { status: 400 });
  }
};
