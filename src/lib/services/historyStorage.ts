/**
 * @file historyStorage.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Local storage management service for scan histories, thumbnail generation, and named dog profiles.
 *
 * @description
 * Persists structured scan metadata and lightweight thumbnails in browser LocalStorage, coordinates full-resolution image
 * storage in IndexedDB, handles legacy schema migrations, manages multi-scan pet profiles, and exports JSON archives.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import type { DogProfile, ScanResult } from '$lib/types/scan';
import { createThumbnail } from '$lib/services/imageProcessor';
import { saveScanImage, deleteScanImage, clearAllScanImages } from '$lib/services/scanImageStorage';

// ---------- CONSTANTS

const SCAN_HISTORY_STORAGE_KEY = 'what_dog_breed_scan_history_v2';
const LEGACY_SCAN_HISTORY_STORAGE_KEY = 'what_dog_breed_scan_history_v1';
const MY_DOG_PROFILE_KEY = 'what_dog_breed_my_dog_v1';

export const SCAN_HISTORY_LIMIT = 100;

// ---------- TYPES

type StoredScanEntry = Omit<ScanResult, 'imageUrl'>;

// ---------- HELPER FUNCTIONS

function stripFullImage(entry: ScanResult): StoredScanEntry {
  const { imageUrl: _imageUrl, ...metadata } = entry;
  return metadata;
}

function sanitizeLegacyEntry(item: ScanResult): StoredScanEntry {
  const { imageUrl, ...rest } = item;
  if (rest.thumbnailUrl) return rest;

  // ---------- INLINE MIGRATION GUARD
  if (imageUrl && imageUrl.length < 50_000) {
    return { ...rest, thumbnailUrl: imageUrl };
  }

  return rest;
}

function readStoredHistory(): StoredScanEntry[] {
  if (typeof window === 'undefined') return [];

  const rawData =
    localStorage.getItem(SCAN_HISTORY_STORAGE_KEY) ??
    localStorage.getItem(LEGACY_SCAN_HISTORY_STORAGE_KEY);

  if (!rawData) return [];

  try {
    const parsed = JSON.parse(rawData) as ScanResult[];
    if (!Array.isArray(parsed)) return [];

    const sanitized = parsed.map(sanitizeLegacyEntry);
    if (localStorage.getItem(LEGACY_SCAN_HISTORY_STORAGE_KEY)) {
      localStorage.setItem(SCAN_HISTORY_STORAGE_KEY, JSON.stringify(sanitized));
      localStorage.removeItem(LEGACY_SCAN_HISTORY_STORAGE_KEY);
    }

    return sanitized;
  } catch {
    return [];
  }
}

function readMyDogProfile(): DogProfile | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(MY_DOG_PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DogProfile;
  } catch {
    return null;
  }
}

// ---------- SCAN HISTORY CRUD

export function getSavedScanHistory(): StoredScanEntry[] {
  return readStoredHistory();
}

export async function saveScanToHistory(result: ScanResult): Promise<void> {
  if (typeof window === 'undefined' || !result) return;

  const currentHistory = readStoredHistory();
  let thumbnailUrl = result.thumbnailUrl;

  if (result.imageUrl) {
    await saveScanImage(result.id, result.imageUrl);
    if (!thumbnailUrl) {
      thumbnailUrl = await createThumbnail(result.imageUrl);
    }
  }

  const entry: StoredScanEntry = {
    ...stripFullImage(result),
    thumbnailUrl
  };

  const updatedHistory = [entry, ...currentHistory.filter((item) => item.id !== result.id)].slice(
    0,
    SCAN_HISTORY_LIMIT
  );

  localStorage.setItem(SCAN_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
}

export async function removeScanFromHistory(scanId: string): Promise<void> {
  if (typeof window === 'undefined' || !scanId) return;

  const updatedHistory = readStoredHistory().filter((item) => item.id !== scanId);
  localStorage.setItem(SCAN_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  await deleteScanImage(scanId);
}

export async function clearAllScanHistory(): Promise<void> {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(SCAN_HISTORY_STORAGE_KEY);
  localStorage.removeItem(LEGACY_SCAN_HISTORY_STORAGE_KEY);
  await clearAllScanImages();
}

export function exportHistoryAsJson(): void {
  if (typeof window === 'undefined') return;

  const history = readStoredHistory();
  const jsonString = JSON.stringify(history, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `what-dog-breed-history-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

// ---------- MY DOG PROFILE METHODS

export function getMyDogProfile(): DogProfile | null {
  return readMyDogProfile();
}

export function saveMyDogProfile(profile: DogProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MY_DOG_PROFILE_KEY, JSON.stringify(profile));
}

export function clearMyDogProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MY_DOG_PROFILE_KEY);
}

export function setMyDogFromScan(
  scanId: string,
  fields: Pick<DogProfile, 'name' | 'age' | 'weight' | 'notes'> & { setAsPrimary?: boolean }
): DogProfile {
  const existing = readMyDogProfile();
  const linkedScanIds = existing?.linkedScanIds.includes(scanId)
    ? existing.linkedScanIds
    : [scanId, ...(existing?.linkedScanIds ?? [])].slice(0, SCAN_HISTORY_LIMIT);

  const profile: DogProfile = {
    name: fields.name.trim() || existing?.name || 'My Dog',
    age: fields.age?.trim() || existing?.age,
    weight: fields.weight?.trim() || existing?.weight,
    notes: fields.notes?.trim() || existing?.notes,
    primaryScanId: fields.setAsPrimary !== false ? scanId : (existing?.primaryScanId ?? scanId),
    linkedScanIds,
    updatedAt: new Date().toISOString()
  };

  saveMyDogProfile(profile);
  return profile;
}

export function linkScanToMyDog(scanId: string): DogProfile | null {
  const existing = readMyDogProfile();
  if (!existing) return null;
  if (existing.linkedScanIds.includes(scanId)) return existing;

  const profile: DogProfile = {
    ...existing,
    linkedScanIds: [scanId, ...existing.linkedScanIds].slice(0, SCAN_HISTORY_LIMIT),
    updatedAt: new Date().toISOString()
  };

  saveMyDogProfile(profile);
  return profile;
}
