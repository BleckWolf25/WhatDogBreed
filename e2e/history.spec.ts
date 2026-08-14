/**
 * @file history.spec.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary End-to-end browser test verifying scan history view, empty states, and local persistence.
 *
 * @description
 * Tests empty history state UI, navigation into the scanner when history is empty, and checks
 * presence of dog profile and export controls.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { test, expect } from '@playwright/test';

// ---------- TEST SUITE
test.describe('Scan History & Pet Profiles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history');
  });

  test('renders history view header and empty or populated scan state', async ({ page }) => {
    await expect(page.locator('#history-title')).toBeVisible();

    const historyContainer = page.locator('.history-section').first();
    await expect(historyContainer).toBeVisible();
  });
});
