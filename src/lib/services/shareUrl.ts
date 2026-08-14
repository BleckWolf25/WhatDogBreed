/**
 * @file shareUrl.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Compresses, encodes, and deserializes shareable scan result deep links with embedded thumbnails.
 *
 * @description
 * Converts rich scan analyses into compact Base64URL query strings fitting within messenger and browser length caps,
 * embeds downsampled JPEG photo thumbnails when possible, and parses incoming deep-link payloads back into active scan states.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { ScanResult } from '$lib/types/scan';
import { createShareThumbnail } from '$lib/services/imageProcessor';

// ---------- CONSTANTS

const MAX_SHARE_URL_LENGTH = 7800;
const MAX_TRAITS = 3;
const MAX_MIX_ITEMS = 4;

const THUMB_ATTEMPTS: Array<[number, number]> = [
  [400, 0.52],
  [320, 0.45],
  [240, 0.4]
];

// ---------- TYPES

interface CompactSharePayload {
  p: string;
  c: number;
  x: 0 | 1;
  b: Array<[string, number]>;
  g?: 'M' | 'F' | 'U';
  v?: string[];
  mt?: string[];
  ft?: string[];
  ga?: string;
  s?: 'g' | 'f' | 'd';
  t?: string;
}

type LegacySharePayload = Pick<
  ScanResult,
  | 'primaryBreed'
  | 'confidenceScore'
  | 'isMixed'
  | 'mixBreakdown'
  | 'detectedGender'
  | 'visualTraits'
  | 'maleBehavioralTraits'
  | 'femaleBehavioralTraits'
  | 'genderComparisonAdvice'
  | 'careAdvice'
  | 'ownerGuidance'
  | 'analysisSource'
  | 'isDemoSample'
>;

export type ShareLinkResult = {
  url: string;
  includesPhoto: boolean;
};

// ---------- ENCODING HELPERS

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = padded + '='.repeat(padLength);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeShareParam(payload: CompactSharePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

function isCompactPayload(value: unknown): value is CompactSharePayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'p' in value &&
    typeof (value as CompactSharePayload).p === 'string'
  );
}

function isLegacyPayload(value: unknown): value is LegacySharePayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'primaryBreed' in value &&
    typeof (value as LegacySharePayload).primaryBreed === 'string'
  );
}

function buildCompactPayload(result: ScanResult, thumbBase64?: string): CompactSharePayload {
  const payload: CompactSharePayload = {
    p: result.primaryBreed.slice(0, 80),
    c: Math.round(result.confidenceScore * 100) / 100,
    x: result.isMixed ? 1 : 0,
    b: result.mixBreakdown
      .slice(0, MAX_MIX_ITEMS)
      .map((item) => [item.breed.slice(0, 48), item.percentage])
  };

  if (result.detectedGender === 'Male') payload.g = 'M';
  else if (result.detectedGender === 'Female') payload.g = 'F';
  else if (result.detectedGender) payload.g = 'U';

  const visualTraits = result.visualTraits.slice(0, MAX_TRAITS).map((t) => t.slice(0, 120));
  if (visualTraits.length) payload.v = visualTraits;

  const maleTraits = result.maleBehavioralTraits.slice(0, 2).map((t) => t.slice(0, 100));
  if (maleTraits.length) payload.mt = maleTraits;

  const femaleTraits = result.femaleBehavioralTraits.slice(0, 2).map((t) => t.slice(0, 100));
  if (femaleTraits.length) payload.ft = femaleTraits;

  if (result.genderComparisonAdvice) {
    payload.ga = result.genderComparisonAdvice.slice(0, 180);
  }

  if (result.isDemoSample) payload.s = 'd';
  else if (result.analysisSource === 'gemini') payload.s = 'g';
  else if (result.analysisSource === 'fallback') payload.s = 'f';

  if (thumbBase64) payload.t = thumbBase64;

  return payload;
}

function expandCompactPayload(payload: CompactSharePayload): ScanResult {
  const detectedGender =
    payload.g === 'M'
      ? 'Male'
      : payload.g === 'F'
        ? 'Female'
        : payload.g === 'U'
          ? 'Unspecified'
          : undefined;

  const isDemoSample = payload.s === 'd';
  const analysisSource =
    payload.s === 'g' ? 'gemini' : payload.s === 'f' || payload.s === 'd' ? 'fallback' : undefined;

  const imageUrl = payload.t ? `data:image/jpeg;base64,${payload.t}` : undefined;

  return {
    id: `shared-${Date.now()}`,
    timestamp: new Date().toISOString(),
    primaryBreed: payload.p,
    confidenceScore: payload.c,
    isMixed: payload.x === 1,
    mixBreakdown: payload.b.map(([breed, percentage]) => ({ breed, percentage })),
    detectedGender,
    visualTraits: payload.v ?? [],
    maleBehavioralTraits: payload.mt ?? [],
    femaleBehavioralTraits: payload.ft ?? [],
    genderComparisonAdvice: payload.ga ?? '',
    careAdvice: '',
    analysisSource,
    isDemoSample,
    imageUrl,
    thumbnailUrl: imageUrl
  };
}

function expandLegacyPayload(payload: LegacySharePayload): ScanResult {
  return {
    id: `shared-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...payload
  };
}

// ---------- PUBLIC SHARE GENERATOR & PARSER

export async function buildShareableScanUrl(
  result: ScanResult,
  origin?: string
): Promise<ShareLinkResult> {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');

  // ---------- THUMBNAIL COMPRESSION CASCADE
  if (result.imageUrl) {
    for (const [maxDimension, quality] of THUMB_ATTEMPTS) {
      try {
        const dataUrl = await createShareThumbnail(result.imageUrl, maxDimension, quality);
        const thumbBase64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
        const url = `${base}/scanner?share=${encodeShareParam(buildCompactPayload(result, thumbBase64))}`;
        if (url.length <= MAX_SHARE_URL_LENGTH) {
          return { url, includesPhoto: true };
        }
      } catch {
        // ---------- TRY NEXT COMPRESSION FACTOR
      }
    }
  }

  const url = `${base}/scanner?share=${encodeShareParam(buildCompactPayload(result))}`;
  return { url, includesPhoto: false };
}

export function parseShareableScan(encoded: string): ScanResult | null {
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(encoded));
    if (isCompactPayload(parsed)) return expandCompactPayload(parsed);
    if (isLegacyPayload(parsed)) return expandLegacyPayload(parsed);
    return null;
  } catch {
    return null;
  }
}

export function parseShareParamFromUrl(searchParams: URLSearchParams): ScanResult | null {
  const encoded = searchParams.get('share');
  if (!encoded) return null;
  return parseShareableScan(encoded);
}
