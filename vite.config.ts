/**
 * @file vite.config.ts
 *
 * @version 2.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Configures Vite build settings and SvelteKit compiler plugins for the application.
 *
 * @description
 * Sets up the Vite development server and production bundle pipelines, and configures the
 * SvelteKit plugin with the Vercel serverless deployment adapter.
 *
 * @since 05/08/2026
 * @updated 17/11/2026
 */
// ---------- IMPORTS
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// ---------- CONFIGURATION
export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({
        runtime: 'nodejs22.x',
        maxDuration: 60
      })
    })
  ],
  optimizeDeps: {
    include: ['dayjs', 'idb-keyval']
  }
});
