/**
 * @file types.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Defines internal interfaces and input contracts for AI vision model analyzers.
 *
 * @description
 * Supplies TypeScript type definitions for vision analyzer inputs, image payload encodings,
 * and the standardized VisionAnalyzer adapter interface used across model providers.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { ScanResult } from '$lib/types/scan';

// ---------- TYPES

export type ScanAnalysis = Omit<ScanResult, 'id' | 'timestamp' | 'imageUrl' | 'thumbnailUrl'>;

export interface VisionAnalyzerInput {
  base64: string;
  mimeType: string;
  gender?: 'Male' | 'Female';
}

export interface VisionAnalyzer {
  analyze(input: VisionAnalyzerInput): Promise<ScanAnalysis>;
}
