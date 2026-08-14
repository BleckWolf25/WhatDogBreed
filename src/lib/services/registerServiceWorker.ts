/**
 * @file registerServiceWorker.ts
 *
 * @version 1.0.1
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Client-side service worker registration, lifecycle updater, and offline cache warming manager.
 *
 * @description
 * Registers the progressive web app service worker script in production environments on page load,
 * unregisters any dev service workers to prevent Vite HMR module interception, detects and triggers
 * instant background updates, and warms local caches with breed catalog chunks during idle network connectivity.
 *
 * @since 05/08/2026
 * @updated 14/08/2026
 */

import { dev } from '$app/environment';

// ---------- SERVICE WORKER REGISTRATION

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  // In development mode, unregister any service worker to avoid breaking Vite HMR / bundling
  if (dev) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
      }
    });
    if (typeof caches !== 'undefined') {
      void caches.keys().then((keys) => {
        for (const key of keys) {
          void caches.delete(key);
        }
      });
    }
    return;
  }

  const register = () => {
    void navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              worker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // ---------- SINGLE RELOAD HANDSHAKE
    if (sessionStorage.getItem('sw-reloaded')) return;
    sessionStorage.setItem('sw-reloaded', '1');
    window.location.reload();
  });
}

// ---------- CACHE PREFETCHING

export async function prefetchOfflineAssets(): Promise<void> {
  if (dev || typeof window === 'undefined' || !navigator.onLine) return;

  try {
    const [{ loadDogBreeds }, routes] = await Promise.all([
      import('$lib/data/dogBreeds'),
      Promise.all([
        fetch('/encyclopedia', { cache: 'reload' }),
        fetch('/manifest.json'),
        fetch('/WhatDogBreed.png')
      ])
    ]);
    await loadDogBreeds();
    void routes;
  } catch {
    // ---------- NON-FATAL SILENT FALLBACK
  }
}
