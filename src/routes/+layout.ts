/**
 * @file +layout.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Root layout client configuration initializing Vercel Web Analytics v2.
 *
 * @description
 * Configures the client environment mode for @vercel/analytics/sveltekit, detects local development
 * and preview hostnames to prevent missing edge script 404s, and initializes telemetry.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { browser, dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// ---------- ENVIRONMENT RESOLUTION

const isLocalhost =
  browser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local'));

// ---------- INITIALIZATION

injectAnalytics({
  mode: dev || isLocalhost ? 'development' : 'production'
});
