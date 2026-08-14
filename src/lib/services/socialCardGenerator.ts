/**
 * @file socialCardGenerator.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Client-side HTML5 Canvas graphic generator creating downloadable and shareable official breed report cards.
 *
 * @description
 * Synthesizes a high-resolution 1080x1080 square report card graphic on an off-screen HTML5 Canvas matching
 * the WhatDogBreed design system, manages badge layout calculations, renders ancestry progress meters and rating dots,
 * and provides native share sheet and file download export capabilities.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { BreedStats, ScanResult } from '$lib/types/scan';
import breedsJson from '$lib/data/dogBreeds.json';

// ---------- CONSTANTS

const catalogBreeds = breedsJson as BreedStats[];

const FONT_DISPLAY =
  "Outfit, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ---------- HELPER FUNCTIONS

function findCatalogBreed(breedName: string): BreedStats | null {
  if (!breedName) return null;
  const normalized = breedName.toLowerCase().trim();
  return (
    catalogBreeds.find(
      (b) =>
        b.name.toLowerCase() === normalized ||
        normalized.includes(b.name.toLowerCase()) ||
        b.id.toLowerCase() === normalized
    ) ?? null
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const rectRatio = w / h;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = img.width;
  let sourceHeight = img.height;

  if (imgRatio > rectRatio) {
    sourceWidth = img.height * rectRatio;
    sourceX = (img.width - sourceWidth) / 2;
  } else {
    sourceHeight = img.width / rectRatio;
    sourceY = (img.height - sourceHeight) / 2;
  }

  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, w, h);
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (!text) return '';
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

function drawBadgePill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  bg: string,
  border: string,
  color: string
): number {
  ctx.font = `bold 13px ${FONT_DISPLAY}`;
  const padX = 12;
  const textW = ctx.measureText(label).width;
  const pillW = textW + padX * 2;
  const pillH = 26;

  drawRoundedRect(ctx, x, y, pillW, pillH, 8);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(label, x + padX, y + 17);

  return x + pillW;
}

function drawLabeledTextRow(
  ctx: CanvasRenderingContext2D,
  label: string,
  labelColor: string,
  text: string,
  textColor: string,
  x: number,
  y: number,
  maxRowWidth: number
): void {
  ctx.font = `bold 15px ${FONT_DISPLAY}`;
  ctx.fillStyle = labelColor;
  ctx.fillText(label, x, y);

  // ---------- GUARANTEE LABEL SPACING
  const labelWidth = ctx.measureText(label).width + 12;
  const textX = x + labelWidth;
  const textWidth = maxRowWidth - labelWidth;

  ctx.font = `500 15px ${FONT_SANS}`;
  ctx.fillStyle = textColor;
  ctx.fillText(truncateText(ctx, text, textWidth), textX, y);
}

// ---------- CANVAS GRAPHIC SYNTHESIS

export async function generateSocialCardDataUrl(
  result: ScanResult,
  breedStats?: BreedStats | null
): Promise<string> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready.catch(() => undefined);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to acquire canvas 2D rendering context.');
  }

  const stats = breedStats || findCatalogBreed(result.primaryBreed);

  // ---------- 1. BRAND BACKGROUND & ATMOSPHERE
  const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  bgGradient.addColorStop(0, '#0a120d');
  bgGradient.addColorStop(0.5, '#111a14');
  bgGradient.addColorStop(1, '#0c140e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1080, 1080);

  const radial1 = ctx.createRadialGradient(900, 100, 10, 900, 100, 500);
  radial1.addColorStop(0, 'rgba(165, 239, 178, 0.16)');
  radial1.addColorStop(1, 'rgba(165, 239, 178, 0)');
  ctx.fillStyle = radial1;
  ctx.fillRect(0, 0, 1080, 1080);

  const radial2 = ctx.createRadialGradient(100, 950, 10, 100, 950, 450);
  radial2.addColorStop(0, 'rgba(112, 200, 135, 0.12)');
  radial2.addColorStop(1, 'rgba(112, 200, 135, 0)');
  ctx.fillStyle = radial2;
  ctx.fillRect(0, 0, 1080, 1080);

  drawRoundedRect(ctx, 24, 24, 1032, 1032, 24);
  ctx.fillStyle = '#121d17';
  ctx.fill();
  ctx.strokeStyle = 'rgba(195, 224, 201, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ---------- 2. HEADER BAR
  drawRoundedRect(ctx, 48, 44, 260, 42, 12);
  ctx.fillStyle = 'rgba(165, 239, 178, 0.08)';
  ctx.fill();
  ctx.strokeStyle = '#70c887';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a5efb2';
  ctx.font = `bold 19px ${FONT_DISPLAY}`;
  ctx.fillText('🐶 WHAT DOG BREED', 66, 71);

  ctx.fillStyle = '#718278';
  ctx.font = `bold 15px ${FONT_DISPLAY}`;
  ctx.textAlign = 'right';
  ctx.fillText('OFFICIAL CANINE PASSPORT', 1032, 70);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(195, 224, 201, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 98);
  ctx.lineTo(1032, 98);
  ctx.stroke();

  // ---------- 3. HERO SECTION
  const heroY = 114;
  const heroH = 500;
  const photoX = 48;
  const photoW = 400;

  if (result.imageUrl) {
    try {
      const dogImg = await loadImage(result.imageUrl);
      ctx.save();
      drawRoundedRect(ctx, photoX, heroY, photoW, heroH, 24);
      ctx.fillStyle = '#162019';
      ctx.fill();
      ctx.clip();

      drawCoverImage(ctx, dogImg, photoX, heroY, photoW, heroH);

      const photoVignette = ctx.createLinearGradient(
        photoX,
        heroY + heroH - 140,
        photoX,
        heroY + heroH
      );
      photoVignette.addColorStop(0, 'rgba(13, 21, 17, 0)');
      photoVignette.addColorStop(1, 'rgba(13, 21, 17, 0.85)');
      ctx.fillStyle = photoVignette;
      ctx.fillRect(photoX, heroY + heroH - 140, photoW, 140);

      ctx.restore();

      drawRoundedRect(ctx, photoX, heroY, photoW, heroH, 24);
      ctx.strokeStyle = 'rgba(165, 239, 178, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } catch (err) {
      console.warn('Social card image load fallback:', err);
    }
  }

  ctx.save();
  const matchPct = Math.round(result.confidenceScore * 100);
  const confText = `⚡ ${matchPct}% VISUAL MATCH`;
  ctx.font = `bold 17px ${FONT_DISPLAY}`;
  const confW = ctx.measureText(confText).width + 30;

  drawRoundedRect(ctx, photoX + 16, heroY + heroH - 58, confW, 42, 12);
  ctx.fillStyle = 'rgba(13, 21, 17, 0.88)';
  ctx.fill();
  ctx.strokeStyle = '#a5efb2';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a5efb2';
  ctx.fillText(confText, photoX + 31, heroY + heroH - 31);
  ctx.restore();

  const rightX = 472;
  const rightW = 560;

  ctx.fillStyle = '#f1f7f1';
  ctx.font = `bold 34px ${FONT_DISPLAY}`;
  ctx.fillText(truncateText(ctx, result.primaryBreed, rightW), rightX, heroY + 36);

  const badgeY = heroY + 54;
  let bX = rightX;

  const mixLabel = result.isMixed ? 'MIXED BREED' : 'PUREBRED';
  bX =
    drawBadgePill(ctx, bX, badgeY, mixLabel, 'rgba(165, 239, 178, 0.12)', '#79c98a', '#a5efb2') +
    10;

  const genderLabel =
    result.detectedGender === 'Male'
      ? '♂ MALE'
      : result.detectedGender === 'Female'
        ? '♀ FEMALE'
        : '🐾 NEUTRAL';
  bX =
    drawBadgePill(ctx, bX, badgeY, genderLabel, 'rgba(209, 231, 196, 0.12)', '#d1e7c4', '#d1e7c4') +
    10;

  if (stats?.group) {
    drawBadgePill(
      ctx,
      bX,
      badgeY,
      stats.group.toUpperCase(),
      'rgba(162, 177, 166, 0.12)',
      '#a2b1a6',
      '#a2b1a6'
    );
  }

  // ---------- ANCESTRY BREAKDOWN BOX
  const ancY = heroY + 106;
  const ancH = 180;

  drawRoundedRect(ctx, rightX, ancY, rightW, ancH, 16);
  ctx.fillStyle = '#162019';
  ctx.fill();
  ctx.strokeStyle = '#2a3b31';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a5efb2';
  ctx.font = `bold 14px ${FONT_DISPLAY}`;
  ctx.fillText('🧬 ANCESTRY BREAKDOWN', rightX + 20, ancY + 32);

  ctx.fillStyle = '#718278';
  ctx.font = `bold 12px ${FONT_DISPLAY}`;
  ctx.textAlign = 'right';
  ctx.fillText('APPEARANCE ESTIMATE', rightX + rightW - 20, ancY + 32);
  ctx.textAlign = 'left';

  let barY = ancY + 54;
  const barFills = ['#a5efb2', '#70c887', '#d1e7c4'];

  const mixItems = result.mixBreakdown.slice(0, 3);
  mixItems.forEach((item, index) => {
    ctx.fillStyle = '#f1f7f1';
    ctx.font = `600 15px ${FONT_SANS}`;
    ctx.fillText(truncateText(ctx, item.breed, rightW - 100), rightX + 20, barY + 14);

    ctx.fillStyle = '#a5efb2';
    ctx.font = `bold 15px ${FONT_DISPLAY}`;
    ctx.textAlign = 'right';
    ctx.fillText(`${item.percentage}%`, rightX + rightW - 20, barY + 14);
    ctx.textAlign = 'left';

    const trackW = rightW - 40;
    drawRoundedRect(ctx, rightX + 20, barY + 22, trackW, 8, 4);
    ctx.fillStyle = 'rgba(195, 224, 201, 0.1)';
    ctx.fill();

    const fillW = Math.max(8, (trackW * item.percentage) / 100);
    drawRoundedRect(ctx, rightX + 20, barY + 22, fillW, 8, 4);
    ctx.fillStyle = barFills[index % barFills.length] ?? '#a5efb2';
    ctx.fill();

    barY += 40;
  });

  // ---------- BREED TRAIT PROFILE BOX
  const traitY = heroY + 300;
  const traitH = 200;

  drawRoundedRect(ctx, rightX, traitY, rightW, traitH, 16);
  ctx.fillStyle = '#162019';
  ctx.fill();
  ctx.strokeStyle = '#2a3b31';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a5efb2';
  ctx.font = `bold 14px ${FONT_DISPLAY}`;
  ctx.fillText('⚡ BREED TRAIT PROFILE', rightX + 20, traitY + 30);

  const energy = stats?.energyLevel ?? 4;
  const strength = stats?.strength ?? 4;
  const grooming = stats?.groomingNeeds ?? 3;
  const trainability = stats?.trainability ?? 4;

  const traits = [
    { label: 'Energy Level', score: energy, icon: '⚡', color: '#e7b967' },
    { label: 'Physical Strength', score: strength, icon: '💪', color: '#c97a5a' },
    { label: 'Grooming Needs', score: grooming, icon: '✂️', color: '#9fc8d3' },
    { label: 'Trainability', score: trainability, icon: '🎓', color: '#a5efb2' }
  ];

  let rY = traitY + 46;
  traits.forEach((t) => {
    ctx.fillStyle = '#f1f7f1';
    ctx.font = `600 15px ${FONT_SANS}`;
    ctx.fillText(`${t.icon} ${t.label}`, rightX + 20, rY + 16);

    const dotStartX = rightX + rightW - 130;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(dotStartX + (i - 1) * 22 + 8, rY + 11, 6, 0, Math.PI * 2);
      if (i <= t.score) {
        ctx.fillStyle = t.color;
      } else {
        ctx.fillStyle = 'rgba(195, 224, 201, 0.15)';
      }
      ctx.fill();
    }

    rY += 36;
  });

  // ---------- 4. TEMPERAMENT & CARE HIGHLIGHTS
  const botY = 632;
  const botH = 370;

  drawRoundedRect(ctx, 48, botY, 984, botH, 20);
  ctx.fillStyle = '#162019';
  ctx.fill();
  ctx.strokeStyle = 'rgba(165, 239, 178, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a5efb2';
  ctx.font = `bold 16px ${FONT_DISPLAY}`;
  ctx.fillText('🐾 TEMPERAMENT & CARE HIGHLIGHTS', 72, botY + 36);

  ctx.strokeStyle = 'rgba(195, 224, 201, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(72, botY + 48);
  ctx.lineTo(1008, botY + 48);
  ctx.stroke();

  const visualTraitsList = (
    result.visualTraits.length > 0
      ? result.visualTraits
      : [
          `Cranial structure and stop angle characteristic of ${result.primaryBreed}`,
          `Coat texture and density showing active lineage traits`
        ]
  ).slice(0, 2);

  let vY = botY + 76;
  visualTraitsList.forEach((vt) => {
    ctx.fillStyle = '#a5efb2';
    ctx.font = `bold 16px ${FONT_SANS}`;
    ctx.fillText('✓', 72, vY);

    ctx.fillStyle = '#f1f7f1';
    ctx.font = `500 15px ${FONT_SANS}`;
    ctx.fillText(truncateText(ctx, vt, 900), 96, vY);

    vY += 34;
  });

  let bY = vY + 12;

  const maleText =
    result.maleBehavioralTraits[0] || 'Stays puppy-like and playful longer into adult years.';
  drawLabeledTextRow(ctx, '♂ MALE:', '#9fc8d3', maleText, '#f1f7f1', 72, bY, 936);

  bY += 46;
  const femaleText =
    result.femaleBehavioralTraits[0] || 'More emotionally intuitive and responsive to mood shifts.';
  drawLabeledTextRow(ctx, '♀ FEMALE:', '#d1e7c4', femaleText, '#f1f7f1', 72, bY, 936);

  bY += 46;
  const careText =
    result.careAdvice ||
    'Plan 60–90 minutes of daily activity - walks, play, and mentally engaging tasks.';
  drawLabeledTextRow(ctx, '💡 CARE:', '#e7b967', careText, '#a2b1a6', 72, bY, 936);

  ctx.fillStyle = '#718278';
  ctx.font = `13px ${FONT_SANS}`;
  ctx.fillText(
    '* Visual breed estimates are appearance-based analyses, not DNA test results. Consult a licensed veterinarian for health advice.',
    72,
    botY + botH - 20
  );

  // ---------- 5. FOOTER WATERMARK
  ctx.fillStyle = '#718278';
  ctx.font = `500 14px ${FONT_SANS}`;
  ctx.fillText('Verified AI Visual Scan • What Dog Breed PWA', 48, 1046);

  ctx.fillStyle = '#a5efb2';
  ctx.font = `bold 15px ${FONT_DISPLAY}`;
  ctx.textAlign = 'right';
  ctx.fillText('whatdogbreed.app', 1032, 1046);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/jpeg', 0.94);
}

// ---------- EXPORT METHODS

export async function generateSocialCardBlob(
  result: ScanResult,
  breedStats?: BreedStats | null
): Promise<Blob> {
  const dataUrl = await generateSocialCardDataUrl(result, breedStats);
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function downloadSocialCardImage(
  result: ScanResult,
  breedStats?: BreedStats | null
): Promise<void> {
  const dataUrl = await generateSocialCardDataUrl(result, breedStats);
  const link = document.createElement('a');
  link.download = `${result.primaryBreed.toLowerCase().replace(/[^a-z0-9]/g, '-')}-report-card.jpg`;
  link.href = dataUrl;
  link.click();
}

export async function copySocialCardToClipboard(
  result: ScanResult,
  breedStats?: BreedStats | null
): Promise<void> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.write) {
    throw new Error('Clipboard API is not available.');
  }

  const blob = await generateSocialCardBlob(result, breedStats);
  await navigator.clipboard.write([new ClipboardItem({ 'image/jpeg': blob })]);
}

export async function shareSocialCard(
  result: ScanResult,
  shareUrl?: string,
  breedStats?: BreedStats | null
): Promise<'shared' | 'downloaded'> {
  const blob = await generateSocialCardBlob(result, breedStats);
  const filename = `${result.primaryBreed.toLowerCase().replace(/[^a-z0-9]/g, '-')}-report-card.jpg`;
  const file = new File([blob], filename, { type: 'image/jpeg' });

  const shareText = shareUrl
    ? `Check out my dog's visual breed report! ${result.primaryBreed} (${Math.round(result.confidenceScore * 100)}% match)\n${shareUrl}`
    : `Check out my dog's visual breed report! ${result.primaryBreed} (${Math.round(result.confidenceScore * 100)}% match)`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `What Dog Breed? - ${result.primaryBreed}`,
        text: shareText,
        files: [file]
      });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
    }
  }

  await downloadSocialCardImage(result, breedStats);
  return 'downloaded';
}
