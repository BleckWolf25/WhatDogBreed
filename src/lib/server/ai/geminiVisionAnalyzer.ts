/**
 * @file geminiVisionAnalyzer.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Multimodal canine AI vision analyzer implementing Google's official @google/genai SDK.
 *
 * @description
 * Manages authenticated communication with Google Gemini Flash vision models, handles model fallback cascading,
 * configures inline base64 image data and structured JSON system instructions, and normalizes returned analyses.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { GoogleGenAI } from '@google/genai';
import { getSystemAnalysisPrompt } from '$lib/server/ai/prompts';
import {
  parseGeminiAnalysisResponse,
  type GeminiAnalysisPayload
} from '$lib/server/ai/parseResponse';
import type { VisionAnalyzer, VisionAnalyzerInput } from '$lib/server/ai/types';

// ---------- CONSTANTS

export const GEMINI_VISION_MODEL = 'gemini-3.6-flash';
export const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash'
];

// ---------- CLASS: GeminiVisionError

export class GeminiVisionError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly status?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'GeminiVisionError';
  }
}

// ---------- CLASS: GeminiVisionAnalyzer

export class GeminiVisionAnalyzer implements VisionAnalyzer {
  private readonly ai: GoogleGenAI;

  constructor(private readonly apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async analyze(input: VisionAnalyzerInput) {
    let lastError: unknown = null;
    let attempt = 0;

    // ---------- MODEL CASCADE LOOP
    for (const modelName of CANDIDATE_MODELS) {
      attempt++;
      try {
        console.log(`[GeminiVisionAnalyzer] Requesting vision analysis with model ${modelName}...`);
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                mimeType: input.mimeType || 'image/jpeg',
                data: input.base64
              }
            },
            'Analyze this dog image according to system instructions.'
          ],
          config: {
            systemInstruction: getSystemAnalysisPrompt(),
            responseMimeType: 'application/json'
          }
        });

        const rawText = response.text;
        if (!rawText) {
          throw new Error(`Empty response text returned from model ${modelName}`);
        }

        const parsedData = JSON.parse(rawText) as GeminiAnalysisPayload;
        return parseGeminiAnalysisResponse(parsedData, input.gender);
      } catch (error: unknown) {
        lastError = error;

        // ---------- IMMEDIATE REJECTION FOR NON-DOG
        if (error instanceof Error && error.message.includes('No dog detected in photo')) {
          throw error;
        }

        // ---------- AUTHENTICATION ERROR CHECK
        const msg = String((error as Error).message || error).toLowerCase();
        if (
          msg.includes('api key not valid') ||
          msg.includes('api_key_invalid') ||
          msg.includes('401')
        ) {
          throw new GeminiVisionError(
            'Your Google Gemini API key is invalid or restricted. Check your key at https://aistudio.google.com/app/apikey',
            attempt,
            401,
            error
          );
        }

        console.warn(
          `[GeminiVisionAnalyzer] Model ${modelName} attempt failed: ${(error as Error).message || error}`
        );
      }
    }

    const errorMessage =
      lastError instanceof Error ? lastError.message : String(lastError || 'Unknown error');
    throw new GeminiVisionError(
      `Gemini vision API request failed across all models after ${attempt} attempt(s): ${errorMessage}`,
      attempt,
      undefined,
      lastError
    );
  }
}

// ---------- FACTORY

export function createGeminiVisionAnalyzer(apiKey: string): VisionAnalyzer {
  return new GeminiVisionAnalyzer(apiKey);
}
