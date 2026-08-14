/**
 * @file lightbox.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Centralized helper utility for triggering the full-screen dog photo lightbox viewer modal.
 *
 * @description
 * Halts event propagation on parent card elements, extracts image source URLs and title captions,
 * and activates the global lightbox reactive store to display enlarged high-resolution images.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { activeLightboxImageStore } from '$lib/stores/appState';

// ---------- MODAL TRIGGER

export function openPhotoLightbox(url: string, title: string, e?: MouseEvent): void {
  if (e) {
    e.stopPropagation();
  }
  if (!url) return;

  activeLightboxImageStore.set({ url, title });
}
