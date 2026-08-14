/**
 * @file photoQualityCheck.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Client-side image quality diagnostics evaluating blur, exposure, resolution, and edge contrast.
 *
 * @description
 * Analyzes photo sharpness using discrete Laplacian kernel convolution, computes average luminance to detect
 * over/under-exposure, calculates color variance across pixels to verify subject detail, and returns actionable user warnings.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- TYPES

export type PhotoQualityWarning =
  'too_blurry' | 'too_dark' | 'too_bright' | 'too_small' | 'low_detail';

export interface PhotoQualityResult {
  ok: boolean;
  warnings: PhotoQualityWarning[];
  sharpness: number;
  brightness: number;
  width: number;
  height: number;
}

// ---------- CONSTANTS

const WARNING_MESSAGES: Record<PhotoQualityWarning, string> = {
  too_blurry: 'This photo looks blurry. Hold steady and tap to focus before scanning.',
  too_dark: 'The photo is quite dark. Move to better light or turn on a lamp.',
  too_bright: 'The photo looks overexposed. Avoid direct sun or harsh flash on the face.',
  too_small: 'The image resolution is low. Try a closer, sharper photo.',
  low_detail: 'We could not detect much detail. Make sure a dog fills the frame and is in focus.'
};

// ---------- HELPER FUNCTIONS

export function getPhotoQualityMessage(warning: PhotoQualityWarning): string {
  return WARNING_MESSAGES[warning];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function computeSharpness(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  const sampleSize = Math.min(320, width, height);
  const startX = Math.floor((width - sampleSize) / 2);
  const startY = Math.floor((height - sampleSize) / 2);
  const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
  const gray: number[] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] ?? 0;
    const g = imageData.data[i + 1] ?? 0;
    const b = imageData.data[i + 2] ?? 0;
    gray.push(0.299 * r + 0.587 * g + 0.114 * b);
  }

  const side = sampleSize;
  let sum = 0;
  let count = 0;

  for (let y = 1; y < side - 1; y++) {
    for (let x = 1; x < side - 1; x++) {
      const idx = y * side + x;
      const p1 = gray[idx - side] ?? 0;
      const p2 = gray[idx - 1] ?? 0;
      const p3 = gray[idx] ?? 0;
      const p4 = gray[idx + 1] ?? 0;
      const p5 = gray[idx + side] ?? 0;
      const laplacian = -p1 - p2 + 4 * p3 - p4 - p5;
      sum += laplacian * laplacian;
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

function computeBrightness(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  const sampleSize = Math.min(160, width, height);
  const startX = Math.floor((width - sampleSize) / 2);
  const startY = Math.floor((height - sampleSize) / 2);
  const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
  let total = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] ?? 0;
    const g = imageData.data[i + 1] ?? 0;
    const b = imageData.data[i + 2] ?? 0;
    total += 0.299 * r + 0.587 * g + 0.114 * b;
  }

  return total / (imageData.data.length / 4);
}

function computeColorVariance(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const sampleSize = Math.min(120, width, height);
  const startX = Math.floor((width - sampleSize) / 2);
  const startY = Math.floor((height - sampleSize) / 2);
  const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
  let sum = 0;
  let sumSq = 0;
  const pixels = imageData.data.length / 4;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] ?? 0;
    const g = imageData.data[i + 1] ?? 0;
    const b = imageData.data[i + 2] ?? 0;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += lum;
    sumSq += lum * lum;
  }

  const mean = sum / pixels;
  return sumSq / pixels - mean * mean;
}

// ---------- QUALITY HEURISTICS ANALYSIS

export async function analyzePhotoQuality(imageUrl: string): Promise<PhotoQualityResult> {
  const img = await loadImage(imageUrl);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return {
      ok: true,
      warnings: [],
      sharpness: 999,
      brightness: 128,
      width,
      height
    };
  }

  ctx.drawImage(img, 0, 0, width, height);

  // ---------- DIAGNOSTIC METRICS
  const sharpness = computeSharpness(ctx, width, height);
  const brightness = computeBrightness(ctx, width, height);
  const variance = computeColorVariance(ctx, width, height);
  const warnings: PhotoQualityWarning[] = [];

  if (width < 240 || height < 240) warnings.push('too_small');
  if (sharpness < 90) warnings.push('too_blurry');
  if (brightness < 45) warnings.push('too_dark');
  if (brightness > 215) warnings.push('too_bright');
  if (variance < 180) warnings.push('low_detail');

  return {
    ok: warnings.length === 0,
    warnings,
    sharpness: Math.round(sharpness),
    brightness: Math.round(brightness),
    width,
    height
  };
}
