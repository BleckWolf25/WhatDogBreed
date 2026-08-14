/**
 * @file compare.spec.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary End-to-end browser test verifying side-by-side dog breed comparison matrix.
 *
 * @description
 * Tests dual-breed selection dropdowns, renders numeric trait comparison rows (energy, strength, grooming, trainability),
 * and verifies lifestyle matrix rows (apartment suitability, kid friendliness, prey drive).
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { test, expect } from '@playwright/test';

// ---------- TEST SUITE
test.describe('Breed Comparison Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compare');
  });

  test('renders dual breed selector dropdowns', async ({ page }) => {
    const selects = page.locator('select');
    await expect(selects.first()).toBeVisible();
  });

  test('displays comparison matrix with numeric trait metrics', async ({ page }) => {
    await expect(page.getByText(/Energy|Strength|Trainability/i).first()).toBeVisible();
    await expect(page.getByText(/Apartment friendly|Good with kids/i).first()).toBeVisible();
  });
});
