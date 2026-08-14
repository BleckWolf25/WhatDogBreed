/**
 * @file rateLimit.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary In-memory rate limiting and client IP extraction utilities for server endpoints.
 *
 * @description
 * Enforces per-client sliding rate limits for expensive operations such as AI scan analyses and feedback submissions,
 * extracts client IP addresses from standard proxy headers, and auto-prunes expired tracking buckets.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- CONSTANTS

const DEFAULT_WINDOW_MS = 60 * 60 * 1000;

export const RATE_LIMITS = {
  scan: { windowMs: DEFAULT_WINDOW_MS, maxRequests: 15 },
  feedback: { windowMs: DEFAULT_WINDOW_MS, maxRequests: 10 }
} as const;

// ---------- TYPES

type Bucket = { count: number; resetAt: number };

// ---------- STATE

const buckets = new Map<string, Bucket>();

// ---------- HELPER FUNCTIONS

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

// ---------- PUBLIC METHODS

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function checkRateLimit(
  key: string,
  options: { windowMs?: number; maxRequests?: number } = {}
): { allowed: boolean; retryAfterSec?: number } {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests ?? RATE_LIMITS.scan.maxRequests;
  const now = Date.now();

  // ---------- BUCKET CLEANUP
  pruneExpired(now);

  const bucket = buckets.get(key) ?? { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  buckets.set(key, bucket);

  // ---------- LIMIT ENFORCEMENT
  if (bucket.count > maxRequests) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  return { allowed: true };
}
