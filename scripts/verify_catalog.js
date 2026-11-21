/**
 * @file verify_catalog.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Validates schema completeness and static asset existence for all catalog dog breed entries.
 *
 * @description
 * Inspects the canonical dogBreeds JSON dataset, verifies that all mandatory BreedStats properties are defined,
 * confirms that every associated static image file physically exists on disk, and prints a structured summary report.
 *
 * @since 05/08/2026
 * @updated 21/11/2026
 */

// ---------- IMPORTS

import fs from 'fs';
import path from 'path';

// ---------- CONSTANTS

const PROJECT_ROOT = process.cwd();
const BREEDS_JSON_PATH = path.join(PROJECT_ROOT, 'src/lib/data/dogBreeds.json');
const STATIC_DIR = path.join(PROJECT_ROOT, 'static');

const REQUIRED_FIELDS = [
  'id',
  'name',
  'originCountry',
  'group',
  'lifespan',
  'maleWeightRange',
  'femaleWeightRange',
  'maleHeightRange',
  'femaleHeightRange',
  'weightRange',
  'heightRange',
  'energyLevel',
  'groomingNeeds',
  'trainability',
  'strength',
  'barkingLevel',
  'goodWithKids',
  'apartmentFriendly',
  'goodWithKidsCategory',
  'goodWithOtherDogs',
  'catSafe',
  'preyDrive',
  'weatherSensitivity',
  'separationAnxietyRisk',
  'protectiveness',
  'affectionLevel',
  'temperament',
  'maleBehavioralTraits',
  'femaleBehavioralTraits',
  'genderBehaviorSummary',
  'description',
  'imageUrl'
];

const APARTMENT_VALUES = new Set(['Yes', 'Moderate', 'No']);
const KIDS_VALUES = new Set([
  'Great with all ages',
  'Better with older kids',
  'Best in adult-only home'
]);
const DOG_VALUES = new Set(['Very friendly', 'Selective', 'Prefer solo dog home']);
const CAT_VALUES = new Set(['Low prey drive', 'High prey drive (Needs caution)']);
const PREY_VALUES = new Set(['Low', 'Moderate', 'High']);
const WEATHER_VALUES = new Set([
  'Resilient',
  'Heat Sensitive',
  'Cold Sensitive',
  'Heat & Cold Sensitive'
]);
const SEPARATION_VALUES = new Set(['Low', 'Moderate', 'High']);
const PROTECTIVENESS_VALUES = new Set(['Friendly to strangers', 'Alert & Protective']);
const AFFECTION_VALUES = new Set(['Cuddler', 'Independent', 'Playful']);

// ---------- VALIDATION

function verifyCatalog() {
  if (!fs.existsSync(BREEDS_JSON_PATH)) {
    console.error('Error: dogBreeds.json not found at', BREEDS_JSON_PATH);
    process.exit(1);
  }

  const rawData = fs.readFileSync(BREEDS_JSON_PATH, 'utf-8');
  const breeds = JSON.parse(rawData);

  console.log(`Total breeds in catalog: ${breeds.length}`);

  let validationErrors = 0;
  const seenIds = new Set();
  const seenNames = new Set();

  // ---------- FIELD INTEGRITY CHECK
  for (const breed of breeds) {
    for (const field of REQUIRED_FIELDS) {
      if (breed[field] === undefined || breed[field] === null) {
        console.error(`Validation Error: Breed "${breed.name}" is missing field "${field}"`);
        validationErrors++;
      }
    }

    const normalizedId = breed.id?.toLowerCase().trim();
    const normalizedName = breed.name?.toLowerCase().replace(/[^a-z0-9]+/g, '');

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedId || '')) {
      console.error(`Validation Error: Breed "${breed.name}" has invalid id "${breed.id}"`);
      validationErrors++;
    }
    if (seenIds.has(normalizedId)) {
      console.error(`Validation Error: Duplicate breed id "${breed.id}"`);
      validationErrors++;
    }
    seenIds.add(normalizedId);

    if (seenNames.has(normalizedName)) {
      console.error(`Validation Error: Duplicate normalized breed name "${breed.name}"`);
      validationErrors++;
    }
    seenNames.add(normalizedName);

    const enumChecks = [
      ['apartmentFriendly', APARTMENT_VALUES],
      ['goodWithKidsCategory', KIDS_VALUES],
      ['goodWithOtherDogs', DOG_VALUES],
      ['catSafe', CAT_VALUES],
      ['preyDrive', PREY_VALUES],
      ['weatherSensitivity', WEATHER_VALUES],
      ['separationAnxietyRisk', SEPARATION_VALUES],
      ['protectiveness', PROTECTIVENESS_VALUES],
      ['affectionLevel', AFFECTION_VALUES]
    ];

    for (const [field, allowed] of enumChecks) {
      if (!allowed.has(breed[field])) {
        console.error(
          `Validation Error: Breed "${breed.name}" has invalid "${field}" value "${breed[field]}"`
        );
        validationErrors++;
      }
    }

    for (const field of [
      'energyLevel',
      'groomingNeeds',
      'trainability',
      'strength',
      'barkingLevel',
      'goodWithKids'
    ]) {
      if (
        typeof breed[field] !== 'number' ||
        !Number.isInteger(breed[field]) ||
        breed[field] < 1 ||
        breed[field] > 5
      ) {
        console.error(
          `Validation Error: Breed "${breed.name}" has invalid 1-5 "${field}" value "${breed[field]}"`
        );
        validationErrors++;
      }
    }

    for (const field of ['temperament', 'maleBehavioralTraits', 'femaleBehavioralTraits']) {
      if (
        !Array.isArray(breed[field]) ||
        breed[field].length === 0 ||
        breed[field].some((item) => typeof item !== 'string' || item.trim() === '')
      ) {
        console.error(`Validation Error: Breed "${breed.name}" has invalid "${field}" array`);
        validationErrors++;
      }
    }

    // ---------- STATIC IMAGE FILE CHECK
    const imgPath = path.join(STATIC_DIR, breed.imageUrl.replace(/^\//, ''));
    if (!fs.existsSync(imgPath)) {
      console.error(
        `Missing Image: Breed "${breed.name}" (${breed.id}) image not found at ${imgPath}`
      );
      validationErrors++;
    }
  }

  // ---------- SUMMARY REPORT
  if (validationErrors === 0) {
    console.log(`All ${breeds.length} breeds passed full schema & image validation!`);
  } else {
    console.error(`Found ${validationErrors} validation errors!`);
    process.exit(1);
  }

  console.log('\n--- Catalog Image Assignments ---');
  for (const breed of breeds) {
    console.log(`${breed.name.padEnd(32)} -> ${breed.imageUrl}`);
  }
}

// ---------- EXECUTION

verifyCatalog();
