/**
 * @file scan.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Defines data contracts and interfaces for dog breed scanning, country of origin, male vs female behavior, and care recommendations.
 *
 * @description
 * Supplies TypeScript type declarations for dog scan requests, breed breakdown items, visual trait detections,
 * male vs female behavioral comparisons, personalized care advice structures, comprehensive breed catalog statistics with origin country,
 * AI vision model tracking metadata, breed comparison requests, and local history storage items.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- TYPES

/**
 * Structured daily care sections for owner decision support.
 */
export interface CarePlan {
  exercise: string;
  grooming: string;
  diet: string;
  mentalEnrichment: string;
  redFlags: string[];
}

/**
 * Rich owner guidance beyond a single care paragraph - health, life stage, costs, adoption.
 */
export interface OwnerGuidance {
  carePlan: CarePlan;
  healthWatchlist: string[];
  lifeStageNotes: {
    puppy: string;
    adult: string;
  };
  estimatedAdultSize?: string;
  trainingTips: string[];
  ownershipCosts: {
    monthlyEstimate: string;
    initialSetup: string;
    notes: string;
  };
  adoptionContext: string;
  adoptabilitySummary: string;
}

/**
 * Represents a single candidate breed contribution in a mixed breed breakdown.
 */
export interface BreedMixItem {
  breed: string;
  percentage: number;
}

/**
 * Represents the complete result output from an AI dog breed scan analysis.
 */
export interface ScanResult {
  id: string;
  timestamp: string;
  primaryBreed: string;
  isMixed: boolean;
  confidenceScore: number;
  aiModelUsed?: string;
  analysisSource?: 'gemini' | 'fallback';
  isDemoSample?: boolean;
  detectedGender?: 'Male' | 'Female' | 'Unspecified';
  mixBreakdown: BreedMixItem[];
  visualTraits: string[];
  maleBehavioralTraits: string[];
  femaleBehavioralTraits: string[];
  genderComparisonAdvice: string;
  careAdvice: string;
  ownerGuidance?: OwnerGuidance;
  imageUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Payload sent from client to server endpoint for scan processing.
 */
export interface ScanApiRequest {
  imageBase64?: string;
  selectedGender?: 'Male' | 'Female';
}

// ---------- LIFESTYLE OPTIONS

export type ApartmentFriendlyOption = 'Yes' | 'Moderate' | 'No';
export type GoodWithKidsCategoryOption =
  'Great with all ages' | 'Better with older kids' | 'Best in adult-only home';
export type GoodWithOtherDogsOption = 'Very friendly' | 'Selective' | 'Prefer solo dog home';
export type CatSafeOption = 'Low prey drive' | 'High prey drive (Needs caution)';
export type PreyDriveOption = 'Low' | 'Moderate' | 'High';
export type WeatherSensitivityOption =
  'Resilient' | 'Heat Sensitive' | 'Cold Sensitive' | 'Heat & Cold Sensitive';
export type SeparationAnxietyOption = 'Low' | 'Moderate' | 'High';
export type ProtectivenessOption = 'Friendly to strangers' | 'Alert & Protective';
export type AffectionLevelOption = 'Cuddler' | 'Independent' | 'Playful';

// ---------- BREED CATALOG STRUCTURES

/**
 * Detailed statistical profile for a dog breed in the encyclopedia.
 */
export interface BreedStats {
  id: string;
  name: string;
  originCountry: string;
  group: string;
  lifespan: string;
  maleWeightRange: string;
  femaleWeightRange: string;
  maleHeightRange: string;
  femaleHeightRange: string;
  weightRange: string;
  heightRange: string;
  energyLevel: number;
  groomingNeeds: number;
  trainability: number;
  strength: number;
  barkingLevel: number;
  goodWithKids: number;
  apartmentFriendly: ApartmentFriendlyOption;
  goodWithKidsCategory: GoodWithKidsCategoryOption;
  goodWithOtherDogs: GoodWithOtherDogsOption;
  catSafe: CatSafeOption;
  preyDrive: PreyDriveOption;
  weatherSensitivity: WeatherSensitivityOption;
  separationAnxietyRisk: SeparationAnxietyOption;
  protectiveness: ProtectivenessOption;
  affectionLevel: AffectionLevelOption;
  temperament: string[];
  maleBehavioralTraits: string[];
  femaleBehavioralTraits: string[];
  genderBehaviorSummary: string;
  description: string;
  imageUrl: string;
}

/**
 * User-defined profile for tracking one dog across multiple scans (stored locally).
 */
export interface DogProfile {
  name: string;
  age?: string;
  weight?: string;
  notes?: string;
  primaryScanId: string;
  linkedScanIds: string[];
  updatedAt: string;
}

/**
 * Represents a simulated offspring result from combining two dog breeds.
 */
export interface BreedMixOutcome {
  title: string;
  parentBreeds: [string, string];
  energyLevel: number;
  groomingNeeds: number;
  trainability: number;
  expectedSize: string;
  inheritedTraits: string[];
}
