/**
 * @file playwright.config.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Playwright E2E testing framework configuration file.
 *
 * @description
 * Configures test directory, baseURL (http://localhost:4173), worker execution mode, HTML reporter, and preview webServer command.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

/// <reference types="node" />

// ---------- IMPORTS

import { defineConfig, devices } from '@playwright/test';

// ---------- CONFIGURATION

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry'
  },
  projects: [
    /* Test against desktop viewports. */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm preview --port 4173 --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: !process.env['CI'],
    timeout: 60000
  }
});
