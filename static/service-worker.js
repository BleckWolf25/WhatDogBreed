/**
 * @file service-worker.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Provides progressive web app offline caching, runtime asset management, and offline navigation fallbacks.
 *
 * @description
 * Implements service worker lifecycle handling, precaches critical application shell routes and icons,
 * provides cache-first serving for static breed imagery, applies stale-while-revalidate for JavaScript/CSS chunks,
 * and falls back to offline navigation screens when the network is unavailable.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- CONSTANTS

const CACHE_VERSION = 'what-dog-breed-cache-v7';
const RUNTIME_CACHE = 'what-dog-breed-runtime-v7';

const PRECACHE_URLS = [
  '/',
  '/scanner',
  '/encyclopedia',
  '/mixer',
  '/compare',
  '/history',
  '/help',
  '/privacy',
  '/terms',
  '/manifest.json',
  '/WhatDogBreed.png',
  '/offline.html'
];

const OFFLINE_FALLBACK = '/offline.html';

// ---------- HELPER FUNCTIONS

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
  );
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_app/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.includes('dogBreeds')
  );
}

// ---------- CACHE STRATEGIES

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) {
        void cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || networkFetch || caches.match(OFFLINE_FALLBACK);
}

async function cacheFirstWithNetworkFallback(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      void cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(OFFLINE_FALLBACK);
  }
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      void caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch {
    const cached =
      (await caches.match(request)) ||
      (await caches.match('/encyclopedia')) ||
      (await caches.match('/scanner')) ||
      (await caches.match(OFFLINE_FALLBACK));
    if (cached) return cached;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// ---------- LIFECYCLE LISTENERS

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SKIP_WAITING') return;
  self.skipWaiting();
});

// ---------- NETWORK FETCH INTERCEPTOR

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // ---------- DEV & API BYPASS
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/')
  ) {
    return;
  }

  // ---------- NAVIGATION REQUESTS
  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // ---------- STATIC BREED IMAGERY
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }

  // ---------- STATIC ASSETS
  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ---------- RUNTIME GENERIC FALLBACK
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(OFFLINE_FALLBACK));
    })
  );
});
