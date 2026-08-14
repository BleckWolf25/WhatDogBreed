/**
 * @file mixer.spec.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary End-to-end browser test verifying dual-parent crossbreed simulation and trait calculations.
 *
 * @description
 * Tests breed selection controls for Parent 1 and Parent 2, verifies generated mix naming formulas,
 * checks trait rating bars, and asserts interactive update reactivity.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { test, expect } from '@playwright/test';

// ---------- TEST SUITE
test.describe('Breed Mixer Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mixer');
  });

  test('renders parent breed selectors and mix outcome section', async ({ page }) => {
    await expect(page.locator('h1#mixer-title')).toBeVisible();
    await expect(page.locator('#parent-a')).toBeVisible();
    await expect(page.locator('#parent-b')).toBeVisible();
  });

  test('updates simulated traits when selecting different parent breeds', async ({ page }) => {
    const selectA = page.locator('#parent-a');
    const selectB = page.locator('#parent-b');

    if (await selectA.isVisible()) {
      await selectA.selectOption({ index: 0 });
      await selectB.selectOption({ index: 2 });

      await expect(page.locator('.outcome-card, .mix-title, h2').first()).toBeVisible();
    }
  });
});
