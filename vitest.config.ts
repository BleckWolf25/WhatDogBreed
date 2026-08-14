/**
 * @file vitest.config.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Vitest test runner configuration for unit and integration test suites.
 *
 * @description
 * Sets up the Vitest test environment, loads SvelteKit module and path aliases, defines test pattern
 * matches within tests/unit, and enforces isolated test execution contexts across all utility and server tests.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

// ---------- CONFIGURATION

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/unit/**/*.{test,spec}.ts'],
    environment: 'node',
    globals: true
  }
});
