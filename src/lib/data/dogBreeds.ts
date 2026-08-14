/**
 * @file dogBreeds.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Client-side loader, fuzzy search engine, and hybrid trait simulation logic for the dog breed encyclopedia.
 *
 * @description
 * Manages asynchronous loading and in-memory caching of the canonical dog breed dataset, provides text-based
 * multi-attribute filtering across breed names and traits, and computes synthetic offspring profiles for parent breed pairings.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { BreedStats } from '$lib/types/scan';
import breedsJson from './dogBreeds.json';

// ---------- CONSTANTS

export const BREED_CATALOG_COUNT = (breedsJson as BreedStats[]).length;

// ---------- STATE

let breedsCache: BreedStats[] | null = null;
let breedsPromise: Promise<BreedStats[]> | null = null;

// ---------- HELPER FUNCTIONS

function sortBreeds(breeds: BreedStats[]): BreedStats[] {
  return [...breeds].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

// ---------- DATA ACCESS

export async function loadDogBreeds(): Promise<BreedStats[]> {
  if (breedsCache) return breedsCache;

  if (!breedsPromise) {
    breedsPromise = import('./dogBreeds.json').then((module) =>
      sortBreeds(module.default as BreedStats[])
    );
  }

  breedsCache = await breedsPromise;
  return breedsCache;
}

export async function searchDogBreeds(query: string): Promise<BreedStats[]> {
  const breeds = await loadDogBreeds();
  if (!query || query.trim() === '') return breeds;

  const normalized = query.toLowerCase().trim();

  return breeds.filter(
    (breed) =>
      breed.name.toLowerCase().includes(normalized) ||
      breed.group.toLowerCase().includes(normalized) ||
      breed.originCountry.toLowerCase().includes(normalized) ||
      breed.temperament.some((trait) => trait.toLowerCase().includes(normalized))
  );
}

// ---------- BREED MIX SIMULATOR

export function simulateBreedMix(breedA: BreedStats, breedB: BreedStats): BreedStats {
  if (breedA.id === breedB.id) return breedA;

  // ---------- AVERAGE NUMERIC METRICS
  const avgEnergy = Math.round((breedA.energyLevel + breedB.energyLevel) / 2);
  const avgStrength = Math.round(((breedA.strength ?? 3) + (breedB.strength ?? 3)) / 2);
  const avgGrooming = Math.round((breedA.groomingNeeds + breedB.groomingNeeds) / 2);
  const avgTrainability = Math.round((breedA.trainability + breedB.trainability) / 2);
  const avgBarking = Math.round((breedA.barkingLevel + breedB.barkingLevel) / 2);
  const avgKids = Math.round((breedA.goodWithKids + breedB.goodWithKids) / 2);

  // ---------- MERGED TRAITS
  const combinedTemperament = Array.from(
    new Set([...breedA.temperament, ...breedB.temperament])
  ).slice(0, 6);
  const combinedMaleTraits = Array.from(
    new Set([...breedA.maleBehavioralTraits, ...breedB.maleBehavioralTraits])
  ).slice(0, 3);
  const combinedFemaleTraits = Array.from(
    new Set([...breedA.femaleBehavioralTraits, ...breedB.femaleBehavioralTraits])
  ).slice(0, 3);

  // ---------- LIFESTYLE SYNTHESIS
  const apartmentFriendly =
    breedA.apartmentFriendly === 'No' || breedB.apartmentFriendly === 'No'
      ? 'No'
      : breedA.apartmentFriendly === 'Yes' && breedB.apartmentFriendly === 'Yes'
        ? 'Yes'
        : 'Moderate';

  const goodWithKidsCategory =
    breedA.goodWithKidsCategory === 'Great with all ages' ||
    breedB.goodWithKidsCategory === 'Great with all ages'
      ? 'Great with all ages'
      : breedA.goodWithKidsCategory;

  const goodWithOtherDogs =
    breedA.goodWithOtherDogs === 'Very friendly' || breedB.goodWithOtherDogs === 'Very friendly'
      ? 'Very friendly'
      : breedA.goodWithOtherDogs === 'Selective' || breedB.goodWithOtherDogs === 'Selective'
        ? 'Selective'
        : 'Prefer solo dog home';

  const catSafe =
    breedA.catSafe === 'High prey drive (Needs caution)' ||
    breedB.catSafe === 'High prey drive (Needs caution)'
      ? 'High prey drive (Needs caution)'
      : 'Low prey drive';

  const preyDrive =
    breedA.preyDrive === 'High' || breedB.preyDrive === 'High'
      ? 'High'
      : breedA.preyDrive === 'Moderate' || breedB.preyDrive === 'Moderate'
        ? 'Moderate'
        : 'Low';

  const weatherSensitivity =
    breedA.weatherSensitivity === 'Heat & Cold Sensitive' ||
    breedB.weatherSensitivity === 'Heat & Cold Sensitive'
      ? 'Heat & Cold Sensitive'
      : breedA.weatherSensitivity;

  const separationAnxietyRisk =
    breedA.separationAnxietyRisk === 'High' || breedB.separationAnxietyRisk === 'High'
      ? 'High'
      : breedA.separationAnxietyRisk === 'Moderate' || breedB.separationAnxietyRisk === 'Moderate'
        ? 'Moderate'
        : 'Low';

  const protectiveness =
    breedA.protectiveness === 'Alert & Protective' || breedB.protectiveness === 'Alert & Protective'
      ? 'Alert & Protective'
      : 'Friendly to strangers';

  const affectionLevel =
    breedA.affectionLevel === 'Cuddler' || breedB.affectionLevel === 'Cuddler'
      ? 'Cuddler'
      : breedA.affectionLevel;

  // ---------- COMPOSITE OUTPUT
  return {
    id: `${breedA.id}-${breedB.id}-mix`,
    name: `${breedA.name} / ${breedB.name} Mix`,
    originCountry: `${breedA.originCountry} x ${breedB.originCountry}`,
    group: `Hybrid (${breedA.group} x ${breedB.group})`,
    lifespan: '10-14 years',
    maleWeightRange: `${breedA.maleWeightRange} / ${breedB.maleWeightRange} hybrid spectrum`,
    femaleWeightRange: `${breedA.femaleWeightRange} / ${breedB.femaleWeightRange} hybrid spectrum`,
    maleHeightRange: `${breedA.maleHeightRange} / ${breedB.maleHeightRange}`,
    femaleHeightRange: `${breedA.femaleHeightRange} / ${breedB.femaleHeightRange}`,
    weightRange: 'Mixed Weight Spectrum',
    heightRange: 'Variable Height',
    energyLevel: avgEnergy,
    strength: avgStrength,
    groomingNeeds: avgGrooming,
    trainability: avgTrainability,
    barkingLevel: avgBarking,
    goodWithKids: avgKids,
    apartmentFriendly,
    goodWithKidsCategory,
    goodWithOtherDogs,
    catSafe,
    preyDrive,
    weatherSensitivity,
    separationAnxietyRisk,
    protectiveness,
    affectionLevel,
    temperament: combinedTemperament,
    maleBehavioralTraits: combinedMaleTraits,
    femaleBehavioralTraits: combinedFemaleTraits,
    genderBehaviorSummary: `Hybrid offspring inheriting male protective drive from ${breedA.name} and female intuitive focus from ${breedB.name}.`,
    description: `A unique hybrid combining the intelligence and working drive of the ${breedA.name} with the traits of the ${breedB.name}.`,
    imageUrl: breedA.imageUrl
  };
}
