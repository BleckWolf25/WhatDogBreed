/**
 * @file appState.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Reactive state stores and LocalStorage synchronizers for scan sessions, theme, units, and UI overlays.
 *
 * @description
 * Supplies global writable Svelte stores for active scan results, parent mix selections, breed comparison pairs,
 * full-screen lightbox payloads, mouse cursor customizations, and measurement units (Imperial vs Metric) with persistent browser storage.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS

import { writable } from 'svelte/store';
import type { BreedStats, ScanResult } from '$lib/types/scan';

// ---------- TYPES
export type CursorVariant = 'paw' | 'bone' | 'dog' | 'default';
export type ThemePreference = 'dark' | 'light';

export interface LightboxPayload {
  url: string;
  title: string;
}

// ---------- CONSTANTS
const LOCAL_STORAGE_UNIT_KEY = 'whatdogbreed_unit_system';
const LOCAL_STORAGE_CURSOR_KEY = 'whatdogbreed_cursor_variant';
const LOCAL_STORAGE_THEME_KEY = 'whatdogbreed_theme';

// ---------- INITIALIZATION HELPERS
function getInitialUnitSystem(): 'Imperial' | 'Metric' {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(LOCAL_STORAGE_UNIT_KEY);
    if (saved === 'Imperial' || saved === 'Metric') {
      return saved;
    }
  }
  return 'Imperial';
}

function getInitialCursorVariant(): CursorVariant {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(LOCAL_STORAGE_CURSOR_KEY) as CursorVariant;
    if (saved === 'paw' || saved === 'bone' || saved === 'dog' || saved === 'default') {
      return saved;
    }
  }
  return 'paw';
}

function getInitialTheme(): ThemePreference {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }
  return 'dark';
}

export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('light-theme', theme === 'light');
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f3f7f3' : '#0d1511');
}

// ---------- STORES

export const activeScanResultStore = writable<ScanResult | null>(null);

export const selectedMixBreedStore = writable<BreedStats | null>(null);

export const selectedMixBreedBStore = writable<BreedStats | null>(null);

export const selectedCompareBreedStore = writable<{
  a: BreedStats | null;
  b: BreedStats | null;
}>({
  a: null,
  b: null
});

export const selectedEncyclopediaBreedStore = writable<BreedStats | null>(null);

export const activeLightboxImageStore = writable<LightboxPayload | null>(null);

export const unitSystemStore = writable<'Imperial' | 'Metric'>(getInitialUnitSystem());

export const cursorVariantStore = writable<CursorVariant>(getInitialCursorVariant());

export const themeStore = writable<ThemePreference>(getInitialTheme());

// ---------- STORAGE SYNCHRONIZATION

if (typeof window !== 'undefined' && window.localStorage) {
  unitSystemStore.subscribe((value) => {
    localStorage.setItem(LOCAL_STORAGE_UNIT_KEY, value);
  });

  cursorVariantStore.subscribe((value) => {
    localStorage.setItem(LOCAL_STORAGE_CURSOR_KEY, value);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-cursor', value);
    }
  });

  themeStore.subscribe((value) => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, value);
    applyThemePreference(value);
  });

  applyThemePreference(getInitialTheme());
}
