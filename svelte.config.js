/**
 * @file svelte.config.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Defines the SvelteKit configuration and preprocessor pipeline for the application.
 *
 * @description
 * Configures the Vite preprocessor for Svelte 5 component syntax and sets up the Vercel adapter
 * target for serverless Node.js 22 runtime deployment.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// ---------- CONFIGURATION

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs22.x' })
  }
};

// ---------- EXPORT
export default config;
