/**
 * @file vite.config.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Configures Vite build settings and SvelteKit compiler plugins for the application.
 *
 * @description
 * Sets up the Vite development server and production bundle pipelines, and integrates the standard
 * SvelteKit plugin resolving compiler options directly from svelte.config.js.
 *
 * @since 05/08/2026
 * @updated 14/08/2026
 */
// ---------- IMPORTS
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// ---------- CONFIGURATION
export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['@vercel/analytics', '@lucide/svelte', 'dayjs', 'idb-keyval']
  }
});
