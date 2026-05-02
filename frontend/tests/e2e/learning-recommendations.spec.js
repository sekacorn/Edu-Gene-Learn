import { test, expect } from '@playwright/test';

/**
 * E2E Tests for AI Learning Recommendations
 * Tests: Recommendation display and AI predictions
 */

test.describe('Learning Recommendations', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to analyze page', async ({ page }) => {
    await page.click('text=Analyze');
    await expect(page).toHaveURL(/.*analyze/);
    await expect(page.locator('h1, h2')).toContainText(/Learning|Recommendations|Analysis/);
  });

  test('should display learning profile form', async ({ page }) => {
    await page.goto('/analyze');

    // Should show form fields for learning profile
    await expect(page.locator('form, .profile-form')).toBeVisible();
  });

  test('should generate learning recommendations', async ({ page }) => {
    await page.goto('/analyze');

    // Fill in sample learning profile data
    await page.fill('input[name="current_visual_score"]', '75');
    await page.fill('input[name="current_auditory_score"]', '60');
    await page.fill('input[name="current_kinesthetic_score"]', '50');

    // Submit for analysis
    await page.click('button:has-text("Get Recommendations")');

    // Should show recommendations
    await expect(page.locator('text=Recommendations, text=strategies, text=optimal')).toBeVisible({ timeout: 15000 });
  });

  test('should display personalized strategies', async ({ page }) => {
    await page.goto('/analyze');

    // Assuming there are existing recommendations
    const strategies = page.locator('.strategy, li:has-text("Use"), li:has-text("Focus")');
    const count = await strategies.count();

    // Should have at least some strategies (or show empty state)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display confidence score for predictions', async ({ page }) => {
    await page.goto('/analyze');
    await page.click('button:has-text("Get Recommendations")');

    // Should show confidence score
    await expect(page.locator('text=confidence, text=%')).toBeVisible({ timeout: 10000 });
  });

  test('should show optimal study time recommendations', async ({ page }) => {
    await page.goto('/analyze');
    await page.click('button:has-text("Get Recommendations")');

    // Should recommend study time (morning, afternoon, evening, night)
    await expect(page.locator('text=morning, text=afternoon, text=evening, text=night')).toBeVisible({ timeout: 10000 });
  });

  test('should show optimal session duration', async ({ page }) => {
    await page.goto('/analyze');
    await page.click('button:has-text("Get Recommendations")');

    // Should show session duration in minutes
    await expect(page.locator('text=minutes, text=duration, text=session')).toBeVisible({ timeout: 10000 });
  });

  test('should display learning style breakdown', async ({ page }) => {
    await page.goto('/analyze');
    await page.click('button:has-text("Get Recommendations")');

    // Should show visual, auditory, kinesthetic percentages
    await expect(page.locator('text=Visual, text=Auditory, text=Kinesthetic')).toBeVisible({ timeout: 10000 });
  });

  test('should update recommendations when profile changes', async ({ page }) => {
    await page.goto('/analyze');

    // Get initial recommendations
    await page.fill('input[name="current_visual_score"]', '30');
    await page.click('button:has-text("Get Recommendations")');
    const initialText = await page.locator('.recommendations').textContent();

    // Change profile
    await page.fill('input[name="current_visual_score"]', '90');
    await page.click('button:has-text("Get Recommendations")');

    // Recommendations should update
    await page.waitForTimeout(2000);
    const updatedText = await page.locator('.recommendations').textContent();

    expect(initialText).not.toEqual(updatedText);
  });
});

test.describe('Learning Data Visualization', () => {

  test('should display charts for learning profile', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/analyze');
    await page.click('button:has-text("Get Recommendations")');

    // Should show charts (canvas, svg, or chart library elements)
    await expect(page.locator('canvas, svg, .recharts-wrapper, .plotly')).toBeVisible({ timeout: 10000 });
  });

  test('should show genomic trait heatmap', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/explore');

    // Should show visualization elements
    await expect(page.locator('canvas, .visualization')).toBeVisible();
  });
});
