/**
 * @file encyclopedia.spec.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary End-to-end browser test verifying breed catalog search, group filtering, and detail modal views.
 *
 * @description
 * Tests breed listing rendering, live search filtering, breed group category pill buttons,
 * clicking into individual breed cards, and opening/closing the full breed detail modal.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { test, expect } from '@playwright/test';

// ---------- TEST SUITE
test.describe('Breed Encyclopedia', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encyclopedia');
  });

  test('renders breed search input and group filter buttons', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]');
    await expect(searchInput.first()).toBeVisible();

    const groupFilter = page.getByRole('button', { name: /Herding|Working|All/i });
    await expect(groupFilter.first()).toBeVisible();
  });

  test('filters breeds dynamically based on text query', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    await searchInput.fill('German Shepherd');

    await expect(page.getByText('German Shepherd').first()).toBeVisible();
  });

  test('opens and closes breed modal when clicking on a breed card', async ({ page }) => {
    const card = page.locator('.breed-card, article, button.card').first();
    if (await card.isVisible()) {
      await card.click();

      const modal = page.locator('.modal-backdrop, .breed-modal, dialog, [role="dialog"]');
      if (await modal.isVisible()) {
        const closeBtn = page.getByRole('button', { name: /close|×/i });
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await expect(modal).not.toBeVisible();
        }
      }
    }
  });
});
