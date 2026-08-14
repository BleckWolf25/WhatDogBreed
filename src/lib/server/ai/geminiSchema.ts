/**
 * @file geminiSchema.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Defines the strict Google Generative AI ResponseSchema for structured Gemini Vision outputs.
 *
 * @description
 * Enforces JSON type safety and property validation at the LLM model level, ensuring consistent formatting
 * of canine validity flags, breed proportions, visual markers, gender traits, and structured owner guidance.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { SchemaType, type ResponseSchema } from '@google/generative-ai';

// ---------- CONSTANTS

export const GEMINI_ANALYSIS_RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    isDog: {
      type: SchemaType.BOOLEAN,
      description: 'True if a real dog/puppy/canine is present in photo, false otherwise.'
    },
    error: {
      type: SchemaType.STRING,
      description: 'Error message if photo does not contain a dog, otherwise null or empty string.',
      nullable: true
    },
    primaryBreed: {
      type: SchemaType.STRING,
      description: 'Primary breed name or mix title.'
    },
    isMixed: {
      type: SchemaType.BOOLEAN,
      description: 'True if dog shows traits of multiple breeds, false if purebred.'
    },
    confidenceScore: {
      type: SchemaType.NUMBER,
      description: 'Confidence score between 0.50 and 0.99.'
    },
    detectedGender: {
      type: SchemaType.STRING,
      description: 'Male, Female, or Unspecified based on visual dimorphism.'
    },
    mixBreakdown: {
      type: SchemaType.ARRAY,
      description: 'Breakdown of breed percentages summing to 100.',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          breed: { type: SchemaType.STRING },
          percentage: { type: SchemaType.NUMBER }
        },
        required: ['breed', 'percentage']
      }
    },
    visualTraits: {
      type: SchemaType.ARRAY,
      description: 'Morphological observations noticed in photo.',
      items: { type: SchemaType.STRING }
    },
    maleBehavioralTraits: {
      type: SchemaType.ARRAY,
      description: 'Behavioral highlights typical for male dogs of this breed.',
      items: { type: SchemaType.STRING }
    },
    femaleBehavioralTraits: {
      type: SchemaType.ARRAY,
      description: 'Behavioral highlights typical for female dogs of this breed.',
      items: { type: SchemaType.STRING }
    },
    genderComparisonAdvice: {
      type: SchemaType.STRING,
      description: 'Summary contrasting male vs female behavior and traits.'
    },
    careAdvice: {
      type: SchemaType.STRING,
      description: 'One-sentence summary of exercise and care recommendations.'
    },
    ownerGuidance: {
      type: SchemaType.OBJECT,
      description: 'Comprehensive owner care and decision support guidance.',
      properties: {
        carePlan: {
          type: SchemaType.OBJECT,
          properties: {
            exercise: { type: SchemaType.STRING },
            grooming: { type: SchemaType.STRING },
            diet: { type: SchemaType.STRING },
            mentalEnrichment: { type: SchemaType.STRING },
            redFlags: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            }
          },
          required: ['exercise', 'grooming', 'diet', 'mentalEnrichment']
        },
        healthWatchlist: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
        lifeStageNotes: {
          type: SchemaType.OBJECT,
          properties: {
            puppy: { type: SchemaType.STRING },
            adult: { type: SchemaType.STRING }
          }
        },
        estimatedAdultSize: { type: SchemaType.STRING },
        trainingTips: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
        ownershipCosts: {
          type: SchemaType.OBJECT,
          properties: {
            monthlyEstimate: { type: SchemaType.STRING },
            initialSetup: { type: SchemaType.STRING },
            notes: { type: SchemaType.STRING }
          }
        },
        adoptionContext: { type: SchemaType.STRING },
        adoptabilitySummary: { type: SchemaType.STRING }
      }
    }
  },
  required: [
    'isDog',
    'primaryBreed',
    'isMixed',
    'confidenceScore',
    'detectedGender',
    'mixBreakdown',
    'visualTraits',
    'maleBehavioralTraits',
    'femaleBehavioralTraits',
    'genderComparisonAdvice',
    'careAdvice'
  ]
};
