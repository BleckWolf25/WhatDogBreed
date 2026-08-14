/**
 * @file unitConverter.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Unit conversion utilities translating between Imperial (lbs/inches) and Metric (kg/cm) measurement formats.
 *
 * @description
 * Parses weight and height range strings and free-form descriptive texts using regex patterns, applies standard
 * mathematical conversion coefficients, and formats clean localized strings for international users.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- HELPER FUNCTIONS

function convertLbsToKgInText(text: string): string {
  return text
    .replace(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*lbs?\b/gi, (_, minLbs, maxLbs) => {
      const minKg = Math.round(parseFloat(minLbs) * 0.453592);
      const maxKg = Math.round(parseFloat(maxLbs) * 0.453592);
      return `${minKg}-${maxKg} kg`;
    })
    .replace(/(\d+(?:\.\d+)?)\s*lbs?\b/gi, (_, lbs) => {
      const kg = Math.round(parseFloat(lbs) * 0.453592);
      return `${kg} kg`;
    });
}

function convertInchesToCmInText(text: string): string {
  return text
    .replace(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*inches?\b/gi, (_, minIn, maxIn) => {
      const minCm = Math.round(parseFloat(minIn) * 2.54);
      const maxCm = Math.round(parseFloat(maxIn) * 2.54);
      return `${minCm}-${maxCm} cm`;
    })
    .replace(/(\d+(?:\.\d+)?)\s*inches?\b/gi, (_, inches) => {
      const cm = Math.round(parseFloat(inches) * 2.54);
      return `${cm} cm`;
    });
}

// ---------- FORMATTERS

export function formatWeightRange(weightStr: string, isMetric: boolean): string {
  if (!weightStr) return '';
  if (!isMetric) return weightStr;
  return convertLbsToKgInText(weightStr);
}

export function formatHeightRange(heightStr: string, isMetric: boolean): string {
  if (!heightStr) return '';
  if (!isMetric) return heightStr;
  return convertInchesToCmInText(heightStr);
}

export function formatMeasurementText(text: string, isMetric: boolean): string {
  if (!text || !isMetric) return text;
  return convertInchesToCmInText(convertLbsToKgInText(text));
}

export function formatMixExpectedSize(
  parentA: { maleWeightRange: string; maleHeightRange: string },
  parentB: { maleWeightRange: string; maleHeightRange: string },
  isMetric: boolean
): string {
  if (parentA.maleWeightRange === parentB.maleWeightRange) {
    const weight = formatWeightRange(parentA.maleWeightRange, isMetric);
    const height = formatHeightRange(parentA.maleHeightRange, isMetric);
    return `${weight}, ${height}`;
  }

  const weightA = formatWeightRange(parentA.maleWeightRange, isMetric);
  const weightB = formatWeightRange(parentB.maleWeightRange, isMetric);
  const heightA = formatHeightRange(parentA.maleHeightRange, isMetric);
  const heightB = formatHeightRange(parentB.maleHeightRange, isMetric);

  return `${weightA} / ${weightB} · ${heightA} / ${heightB}`;
}
