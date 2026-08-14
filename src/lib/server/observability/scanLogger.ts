/**
 * @file scanLogger.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Telemetry and performance metric logging for server-side dog breed scan requests.
 *
 * @description
 * Emits structured JSON events tracking scan execution durations, model identifiers, fallback activations,
 * error reasons, and success states for observability monitoring and performance analysis.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- TYPES

export type ScanLogEvent =
  | {
      event: 'scan_complete';
      durationMs: number;
      model: string;
      fallback: boolean;
      success: true;
    }
  | {
      event: 'scan_failed';
      durationMs: number;
      success: false;
      error: string;
    };

// ---------- LOGGING METHODS

export function logScanEvent(payload: ScanLogEvent): void {
  console.log(JSON.stringify({ ...payload, ts: new Date().toISOString() }));
}
