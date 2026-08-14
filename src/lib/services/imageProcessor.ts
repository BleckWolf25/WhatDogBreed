/**
 * @file imageProcessor.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Client-side image compression, thumbnail generation, and Blob scaling using HTML5 Canvas.
 *
 * @description
 * Downsamples high-resolution mobile camera captures and uploaded photo files, converts formats to optimized JPEG,
 * enforces maximum payload boundaries for network uploads, and generates lightweight thumbnails for history and shareable URLs.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- CONSTANTS

const MAX_IMAGE_DIMENSION = 1200;
const COMPRESSION_QUALITY = 0.85;
const THUMBNAIL_MAX_DIMENSION = 200;
const THUMBNAIL_QUALITY = 0.7;

export const SHARE_THUMB_MAX_DIMENSION = 400;
export const SHARE_THUMB_QUALITY = 0.52;

// ---------- HELPER FUNCTIONS

function resizeToJpegDataUrl(
  dataUrl: string,
  maxDimension: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to acquire 2D canvas context.'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => reject(new Error('Failed to decode image for thumbnail.'));
    img.src = dataUrl;
  });
}

// ---------- COMPRESSION METHODS

export async function compressAndEncodeImage(imageFile: File | Blob): Promise<string> {
  if (!imageFile) {
    throw new Error('No image file provided for compression.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = (event) => {
      const srcUrl = event.target?.result as string;
      if (!srcUrl) {
        reject(new Error('Failed to read image data URL.'));
        return;
      }

      const img = new Image();
      img.src = srcUrl;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
            height = MAX_IMAGE_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to acquire 2D canvas context.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to decode image payload.'));
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Could not load image (${response.status}).`);
  }
  return response.blob();
}

export async function resolvePersistableImageUrl(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  const blob = await dataUrlToBlob(imageUrl);
  return compressAndEncodeImage(blob);
}

export async function createThumbnail(
  dataUrl: string,
  maxDimension = THUMBNAIL_MAX_DIMENSION
): Promise<string> {
  return resizeToJpegDataUrl(dataUrl, maxDimension, THUMBNAIL_QUALITY);
}

export async function createShareThumbnail(
  dataUrl: string,
  maxDimension = SHARE_THUMB_MAX_DIMENSION,
  quality = SHARE_THUMB_QUALITY
): Promise<string> {
  return resizeToJpegDataUrl(dataUrl, maxDimension, quality);
}
