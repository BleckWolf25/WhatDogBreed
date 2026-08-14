/**
 * @file feedbackLogger.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Structured JSON logging utility for user scan accuracy feedback and model evaluations.
 *
 * @description
 * Formats user-reported breed corrections, optional diagnostic notes, analysis model sources,
 * and confidence scores into structured NDJSON strings for log aggregation and downstream accuracy auditing.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- TYPES

export type FeedbackLogEvent = {
  event: 'scan_feedback';
  scanId: string;
  reportedBreed: string;
  expectedBreed: string;
  note?: string;
  analysisSource?: string;
  confidenceScore?: number;
};

// ---------- LOGGING METHODS

export function logFeedbackEvent(payload: FeedbackLogEvent): void {
  console.log(JSON.stringify({ ...payload, ts: new Date().toISOString() }));
}
