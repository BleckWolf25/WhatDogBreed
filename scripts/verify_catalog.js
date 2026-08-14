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
 * @updated 13/08/2026
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

  // ---------- FIELD INTEGRITY CHECK
  for (const breed of breeds) {
    for (const field of REQUIRED_FIELDS) {
      if (breed[field] === undefined || breed[field] === null) {
        console.error(`Validation Error: Breed "${breed.name}" is missing field "${field}"`);
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
