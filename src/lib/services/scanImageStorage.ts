/**
 * @file scanImageStorage.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary High-capacity IndexedDB key-value storage adapter for full-resolution dog scan photographs.
 *
 * @description
 * Manages asynchronous persistence and retrieval of raw high-resolution scan images in browser IndexedDB,
 * preventing LocalStorage quota exhaustion while enabling persistent local photo previews across sessions.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { get, set, del, keys, createStore } from 'idb-keyval';

// ---------- STORAGE INSTANCE

const scanImageStore = createStore('what-dog-breed-scan-images', 'images');

// ---------- STORAGE OPERATIONS

export async function saveScanImage(scanId: string, imageDataUrl: string): Promise<void> {
  await set(scanId, imageDataUrl, scanImageStore);
}

export async function getScanImage(scanId: string): Promise<string | undefined> {
  return get(scanId, scanImageStore);
}

export async function deleteScanImage(scanId: string): Promise<void> {
  await del(scanId, scanImageStore);
}

export async function clearAllScanImages(): Promise<void> {
  const allKeys = await keys(scanImageStore);
  await Promise.all(allKeys.map((key) => del(key, scanImageStore)));
}
