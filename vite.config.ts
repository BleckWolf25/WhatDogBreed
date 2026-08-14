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
 * Sets up the Vite development server and production bundle pipelines, integrates the SvelteKit
 * plugin, and enforces Svelte 5 runes mode across application source files while ignoring third-party packages.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// ---------- CONFIGURATION
export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      }
    })
  ]
});
