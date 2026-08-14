/**
 * @file optimize-images.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Compresses, resizes, and optimizes static breed imagery using the Sharp image processing engine.
 *
 * @description
 * Scans the static images directory, filters image formats, checks file size thresholds,
 * resizes oversized dimensions down to web-friendly bounds, and applies format-specific compression
 * to minimize client payload sizes and improve First Contentful Paint times.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ---------- CONSTANTS

const IMAGES_DIR = path.resolve('static/images');
const MAX_DIMENSION = 1200;
const MIN_OPTIMIZE_SIZE_BYTES = 150 * 1024;
const TARGET_QUALITY = 82;

// ---------- PROCESSING

async function optimizeImages() {
  if (!fs.existsSync(IMAGES_DIR)) return;

  const files = fs.readdirSync(IMAGES_DIR);
  let totalSavedBytes = 0;
  let processedCount = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stat = fs.statSync(filePath);

    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
    if (stat.size < MIN_OPTIMIZE_SIZE_BYTES) continue;

    console.log(`Optimizing ${file} (${Math.round(stat.size / 1024)} KB)...`);

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = image;

      // ---------- DIMENSION RESIZE
      if (
        (metadata.width && metadata.width > MAX_DIMENSION) ||
        (metadata.height && metadata.height > MAX_DIMENSION)
      ) {
        pipeline = pipeline.resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // ---------- FORMAT ENCODING
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: TARGET_QUALITY, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: TARGET_QUALITY, compressionLevel: 8 });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: TARGET_QUALITY });
      }

      const buffer = await pipeline.toBuffer();

      // ---------- FILE WRITE
      if (buffer.length < stat.size) {
        fs.writeFileSync(filePath, buffer);
        const saved = stat.size - buffer.length;
        totalSavedBytes += saved;
        processedCount++;
        console.log(
          ` -> Optimized ${file}: ${Math.round(stat.size / 1024)} KB -> ${Math.round(buffer.length / 1024)} KB (Saved ${Math.round(saved / 1024)} KB)`
        );
      }
    } catch (err) {
      console.error(` Failed to optimize ${file}:`, err);
    }
  }

  console.log(
    `\nDone! Processed ${processedCount} images. Total space saved: ${Math.round(totalSavedBytes / (1024 * 1024))} MB.`
  );
}

// ---------- EXECUTION

void optimizeImages();
