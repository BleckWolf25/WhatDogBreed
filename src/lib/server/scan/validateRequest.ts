/**
 * @file validateRequest.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Validates, decodes, and normalizes incoming HTTP payloads for the image scan endpoint.
 *
 * @description
 * Enforces payload size limits (10MB max), processes multipart form data and raw JSON base64 payloads,
 * extracts and sanitizes image MIME types, parses optional gender classification parameters, and returns typed validation results.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- CONSTANTS

const MAX_ALLOWED_PAYLOAD_BYTES = 10 * 1024 * 1024;

// ---------- TYPES

export type ValidatedScanRequest = {
  imageBase64: string;
  mimeType: string;
  selectedGender?: 'Male' | 'Female';
  sampleSource?: string;
};

export type ScanValidationError = {
  status: 400 | 413;
  message: string;
};

export type ScanValidationResult =
  { ok: true; data: ValidatedScanRequest } | { ok: false; error: ScanValidationError };

// ---------- HELPER FUNCTIONS

function parseGender(value: unknown): 'Male' | 'Female' | undefined {
  return value === 'Male' || value === 'Female' ? value : undefined;
}

export function extractCleanMimeType(rawMime: string | undefined): string {
  if (!rawMime || !rawMime.trim()) return 'image/jpeg';
  const firstSegment = (rawMime.split(';')[0] ?? '').trim().toLowerCase();
  if (firstSegment === 'image/jpg' || firstSegment === 'image/pjpeg') return 'image/jpeg';
  if (firstSegment === 'image/x-png') return 'image/png';
  if (firstSegment.startsWith('image/')) return firstSegment;
  return 'image/jpeg';
}

export function isAllowedImageMime(mimeType: string | undefined): boolean {
  if (!mimeType) return true;
  const clean = extractCleanMimeType(mimeType);
  return (
    clean.startsWith('image/') ||
    clean === 'application/octet-stream' ||
    [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/avif',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ].includes(clean)
  );
}

// ---------- PARSERS

async function parseMultipartRequest(request: Request): Promise<ScanValidationResult> {
  const formData = await request.formData();
  const imageFile = formData.get('image') as File | null;
  const selectedGender = parseGender(formData.get('gender'));
  const sampleSource = formData.get('sampleSource');

  if (!imageFile) {
    return {
      ok: false,
      error: { status: 400, message: 'No image file uploaded in request payload.' }
    };
  }

  const cleanMime = extractCleanMimeType(imageFile.type);
  if (!isAllowedImageMime(cleanMime)) {
    return {
      ok: false,
      error: {
        status: 400,
        message: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.'
      }
    };
  }

  const buffer = await imageFile.arrayBuffer();
  const imageBase64 = `data:${cleanMime};base64,${Buffer.from(buffer).toString('base64')}`;

  return {
    ok: true,
    data: {
      imageBase64,
      mimeType: cleanMime,
      selectedGender,
      sampleSource:
        typeof sampleSource === 'string' && sampleSource.trim() ? sampleSource.trim() : undefined
    }
  };
}

async function parseJsonRequest(request: Request): Promise<ScanValidationResult> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return {
      ok: false,
      error: { status: 400, message: 'Invalid JSON request payload.' }
    };
  }

  const imageBase64 =
    (typeof body?.imageBase64 === 'string' ? body.imageBase64 : '') ||
    (typeof body?.image === 'string' ? body.image : '');
  const selectedGender = parseGender(body?.selectedGender);
  const sampleSource =
    typeof body?.sampleSource === 'string' && body.sampleSource.trim()
      ? body.sampleSource.trim()
      : undefined;

  if (!imageBase64) {
    return {
      ok: false,
      error: { status: 400, message: 'Missing imageBase64 property in JSON request body.' }
    };
  }

  let mimeType = 'image/jpeg';
  const matchMime = imageBase64.match(/^data:([a-zA-Z0-9+\-./]+)(;[^\s;]+)*;base64,/i);
  if (matchMime && matchMime[1]) {
    mimeType = extractCleanMimeType(matchMime[1]);
  }

  if (!isAllowedImageMime(mimeType)) {
    return {
      ok: false,
      error: {
        status: 400,
        message: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.'
      }
    };
  }

  return {
    ok: true,
    data: {
      imageBase64,
      mimeType,
      selectedGender,
      sampleSource
    }
  };
}

// ---------- VALIDATION ENTRYPOINT

export async function validateScanRequest(request: Request): Promise<ScanValidationResult> {
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_ALLOWED_PAYLOAD_BYTES) {
    return {
      ok: false,
      error: { status: 413, message: 'Payload size exceeds the 10MB maximum limit.' }
    };
  }

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    return parseMultipartRequest(request);
  }

  return parseJsonRequest(request);
}
