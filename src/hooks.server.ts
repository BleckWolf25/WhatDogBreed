/**
 * @file hooks.server.ts
 *
 * @version 1.1.0
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
 * @updated 17/11/2026
 */

// ---------- IMPORTS

import { isHttpError } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit/hooks';
import { logScanEvent } from '#lib/server/observability/scanLogger';

// ---------- ERROR HANDLER

export const handleError: HandleServerError = ({ error, event }) => {
  const isExpected = isHttpError(error);
  const status = isExpected ? error.status : 500;
  const rawMessage = isExpected
    ? error.body.message
    : error instanceof Error
      ? error.message
      : String(error);

  // ---------- IGNORE BENIGN 404S
  if (status === 404) {
    return { message: rawMessage };
  }

  // ---------- TELEMETRY LOGGING
  logScanEvent({
    event: 'scan_failed',
    durationMs: 0,
    success: false,
    error: `[${status}] ${event.url.pathname}: ${rawMessage}`
  });

  // ---------- DIAGNOSTIC CONSOLE
  console.error('[whatdogbreed:error]', {
    status,
    path: event.url.pathname,
    message: rawMessage,
    stack: error instanceof Error ? error.stack : undefined
  });

  // ---------- SANITIZED RESPONSE
  return {
    message: status >= 500 ? 'Something went wrong. Please try again.' : rawMessage
  };
};
