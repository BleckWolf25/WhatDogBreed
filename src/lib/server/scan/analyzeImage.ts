/**
 * @file analyzeImage.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Main image analysis coordinator dispatching requests between Gemini Vision AI and local heuristics.
 *
 * @description
 * Inspects incoming base64 image data, checks API key availability and sample demo markers,
 * dispatches visual recognition calls to the Google Gemini Vision analyzer, catches recoverable errors,
 * and falls back to deterministic signature-based local analysis when appropriate.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { createGeminiVisionAnalyzer, GeminiVisionError } from '$lib/server/ai/geminiVisionAnalyzer';
import { findBreedFromPayload } from '$lib/server/breeds/resolveFromPayload';
import type { ScanResult } from '$lib/types/scan';

// ---------- TYPES

export type ImageAnalysisOutcome = {
  analysis: Omit<
    ScanResult,
    'id' | 'timestamp' | 'imageUrl' | 'thumbnailUrl' | 'analysisSource' | 'isDemoSample'
  >;
  source: 'gemini' | 'fallback';
  isDemoSample: boolean;
};

// ---------- HELPER FUNCTIONS

function stripBase64Prefix(imageBase64Data: string): string {
  return imageBase64Data.replace(/^data:image\/\w+;(name=[^;]+;)?base64,/, '');
}

function shouldUseFallback(
  apiKey: string | undefined,
  detectedPresetBreed: string | null
): boolean {
  return (
    !apiKey ||
    apiKey.trim() === '' ||
    apiKey === 'YOUR_GEMINI_API_KEY' ||
    Boolean(detectedPresetBreed)
  );
}

// ---------- PRIMARY COORDINATOR

export async function analyzeImage(
  imageBase64Data: string,
  mimeType: string = 'image/jpeg',
  apiKey?: string,
  userGender?: 'Male' | 'Female',
  sampleSource?: string
): Promise<ImageAnalysisOutcome> {
  if (!imageBase64Data || imageBase64Data.trim() === '') {
    throw new Error('Image data string is required for analysis.');
  }

  const detectedPresetBreed = sampleSource ? findBreedFromPayload(sampleSource) : null;
  const cleanBase64 = stripBase64Prefix(imageBase64Data);

  // ---------- FALLBACK BYPASS CHECK
  if (shouldUseFallback(apiKey, detectedPresetBreed)) {
    console.log(
      `[analyzeImage] Using fallback analysis: apiKey=${apiKey ? 'PRESENT (' + apiKey.slice(0, 6) + '...)' : 'MISSING'}, presetBreed=${detectedPresetBreed || 'NONE'}`
    );
    const { generateFeatureHashAnalysisResult } =
      await import('$lib/server/breeds/fallbackAnalysis');
    return {
      analysis: generateFeatureHashAnalysisResult(cleanBase64, userGender, detectedPresetBreed),
      source: 'fallback',
      isDemoSample: Boolean(detectedPresetBreed)
    };
  }

  // ---------- GEMINI VISION INVOCATION
  console.log(
    `[analyzeImage] Invoking Google Gemini AI Vision API (key: ${apiKey ? apiKey.slice(0, 6) + '...' : 'NONE'})...`
  );
  try {
    const analyzer = createGeminiVisionAnalyzer(apiKey!);
    const analysis = await analyzer.analyze({
      base64: cleanBase64,
      mimeType: mimeType || 'image/jpeg',
      gender: userGender
    });
    return { analysis, source: 'gemini', isDemoSample: false };
  } catch (error: unknown) {
    // ---------- NOT A DOG REJECTION
    if (error instanceof Error && error.message.includes('No dog detected in photo')) {
      throw error;
    }

    // ---------- RESILIENT FALLBACK ON FAILURE
    if (error instanceof GeminiVisionError) {
      console.warn(
        `[analyzeImage] Gemini Vision API failed after ${error.attempts} attempt(s): ${error.message}. Triggering fallback analysis.`
      );
    } else {
      console.warn('[analyzeImage] Gemini Vision API call failed, using fallback analysis:', error);
    }

    const { generateFeatureHashAnalysisResult } =
      await import('$lib/server/breeds/fallbackAnalysis');
    return {
      analysis: generateFeatureHashAnalysisResult(cleanBase64, userGender, detectedPresetBreed),
      source: 'fallback',
      isDemoSample: Boolean(detectedPresetBreed)
    };
  }
}
