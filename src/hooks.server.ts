/**
 * @file hooks.server.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Global server hooks for request lifecycle, unhandled exception logging, and error sanitization.
 *
 * @description
 * Intercepts uncaught server errors, logs telemetry and diagnostic information to the observability logger,
 * filters benign 404 route misses from diagnostic noise, and provides user-safe error messages in server responses.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { HandleServerError } from '@sveltejs/kit';
import { logScanEvent } from '$lib/server/observability/scanLogger';

// ---------- ERROR HANDLER

export const handleError: HandleServerError = ({ error, event, status, message }) => {
  const err = error instanceof Error ? error : new Error(String(error));

  // ---------- IGNORE BENIGN 404S
  if (status === 404) {
    return { message };
  }

  // ---------- TELEMETRY LOGGING
  logScanEvent({
    event: 'scan_failed',
    durationMs: 0,
    success: false,
    error: `[${status}] ${event.url.pathname}: ${err.message}`
  });

  // ---------- DIAGNOSTIC CONSOLE
  console.error('[whatdogbreed:error]', {
    status,
    path: event.url.pathname,
    message: err.message,
    stack: err.stack
  });

  // ---------- SANITIZED RESPONSE
  return {
    message: status >= 500 ? 'Something went wrong. Please try again.' : message
  };
};
