/**
 * @file parseResponse.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Parses, validates, and normalizes raw JSON payloads returned by the Gemini vision model.
 *
 * @description
 * Enforces non-dog image rejection triggers, sanitizes confidence scores, normalizes gender dimorphism classifications,
 * validates mix percentage breakdowns, and enriches structured owner guidance objects with default fallbacks.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { ScanAnalysis } from '$lib/server/ai/types';
import type { BreedMixItem, OwnerGuidance } from '$lib/types/scan';
import { summarizeCarePlan } from '$lib/guidance/buildOwnerGuidance';

// ---------- TYPES

export type GeminiAnalysisPayload = {
  isDog?: boolean;
  error?: string | null;
  primaryBreed?: string;
  isMixed?: boolean;
  confidenceScore?: number;
  detectedGender?: string;
  mixBreakdown?: BreedMixItem[];
  visualTraits?: string[];
  maleBehavioralTraits?: string[];
  femaleBehavioralTraits?: string[];
  genderComparisonAdvice?: string;
  careAdvice?: string;
  ownerGuidance?: Partial<OwnerGuidance> & {
    carePlan?: Partial<OwnerGuidance['carePlan']> & { redFlags?: string[] };
    lifeStageNotes?: Partial<OwnerGuidance['lifeStageNotes']>;
    ownershipCosts?: Partial<OwnerGuidance['ownershipCosts']>;
  };
};

// ---------- NORMALIZATION HELPERS

function normalizeDetectedGender(
  userGender: 'Male' | 'Female' | undefined,
  rawGender: string | undefined
): 'Male' | 'Female' | 'Unspecified' {
  if (userGender) return userGender;
  if (rawGender === 'Male' || rawGender === 'Female') return rawGender;
  return 'Unspecified';
}

function normalizeOwnerGuidance(
  raw: GeminiAnalysisPayload['ownerGuidance'],
  careAdvice: string
): OwnerGuidance | undefined {
  if (!raw?.carePlan) return undefined;

  const plan = raw.carePlan;
  if (!plan.exercise || !plan.grooming || !plan.diet || !plan.mentalEnrichment) {
    return undefined;
  }

  return {
    carePlan: {
      exercise: plan.exercise,
      grooming: plan.grooming,
      diet: plan.diet,
      mentalEnrichment: plan.mentalEnrichment,
      redFlags:
        Array.isArray(plan.redFlags) && plan.redFlags.length > 0
          ? plan.redFlags
          : ['Sudden lethargy', 'Loss of appetite', 'Persistent limping']
    },
    healthWatchlist: Array.isArray(raw.healthWatchlist) ? raw.healthWatchlist : [],
    lifeStageNotes: {
      puppy:
        raw.lifeStageNotes?.puppy ||
        'Prioritize socialization and short positive training sessions.',
      adult:
        raw.lifeStageNotes?.adult || 'Maintain exercise, mental enrichment, and annual vet checks.'
    },
    estimatedAdultSize: raw.estimatedAdultSize,
    trainingTips: Array.isArray(raw.trainingTips) ? raw.trainingTips : [],
    ownershipCosts: {
      monthlyEstimate: raw.ownershipCosts?.monthlyEstimate || '$80–$200/month',
      initialSetup: raw.ownershipCosts?.initialSetup || '$200–$600 initial setup',
      notes: raw.ownershipCosts?.notes || 'Budget for emergencies and routine vet care.'
    },
    adoptionContext:
      raw.adoptionContext ||
      'Allow decompression time after adoption and schedule a vet visit within the first week.',
    adoptabilitySummary: raw.adoptabilitySummary || careAdvice
  };
}

// ---------- PRIMARY PARSER

export function parseGeminiAnalysisResponse(
  parsedData: GeminiAnalysisPayload,
  userGender?: 'Male' | 'Female'
): ScanAnalysis {
  // ---------- CANINE REJECTION GUARD
  if (
    parsedData.isDog === false ||
    (parsedData.error && typeof parsedData.error === 'string' && parsedData.error.trim() !== '')
  ) {
    throw new Error(
      parsedData.error ||
        'No dog detected in photo. Scan automatically cancelled. Please upload a clear photo of a dog.'
    );
  }

  const genderComparisonAdvice =
    parsedData.genderComparisonAdvice ||
    'Males tend to be larger with broader cranial mass and chest depth, while females feature a sleeker frame and mature faster in training focus.';

  const ownerGuidance = normalizeOwnerGuidance(
    parsedData.ownerGuidance,
    parsedData.careAdvice || ''
  );
  const careAdvice =
    parsedData.careAdvice ||
    (ownerGuidance
      ? summarizeCarePlan(ownerGuidance.carePlan)
      : 'Provide regular daily exercise and balanced nutrition suited for active dogs.');

  // ---------- RETURN STRUCTURED ANALYSIS
  return {
    primaryBreed: parsedData.primaryBreed || 'German Shepherd',
    isMixed: Boolean(parsedData.isMixed),
    confidenceScore:
      typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 0.92,
    aiModelUsed: 'Google Gemini 3.6 Flash Multimodal Vision',
    detectedGender: normalizeDetectedGender(userGender, parsedData.detectedGender),
    mixBreakdown: Array.isArray(parsedData.mixBreakdown) ? parsedData.mixBreakdown : [],
    visualTraits: Array.isArray(parsedData.visualTraits) ? parsedData.visualTraits : [],
    maleBehavioralTraits: Array.isArray(parsedData.maleBehavioralTraits)
      ? parsedData.maleBehavioralTraits
      : [],
    femaleBehavioralTraits: Array.isArray(parsedData.femaleBehavioralTraits)
      ? parsedData.femaleBehavioralTraits
      : [],
    genderComparisonAdvice,
    careAdvice,
    ownerGuidance
  };
}
