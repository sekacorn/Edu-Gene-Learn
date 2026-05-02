import { test, expect } from '@playwright/test';

/**
 * E2E Tests for LLM Natural Language Queries
 * Tests: Chat interface and troubleshooting
 */

test.describe('LLM Chat Interface', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display chat interface', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for chat widget or button
    const chatButton = page.locator('button:has-text("Chat"), .chat-widget, text=Ask a question');
    await expect(chatButton.first()).toBeVisible();
  });

  test('should send and receive LLM response', async ({ page }) => {
    await page.goto('/dashboard');

    // Open chat
    await page.click('button:has-text("Chat"), .chat-widget');

    // Type a question
    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');
    await chatInput.fill('How do I upload my VCF file?');
    await page.keyboard.press('Enter');

    // Should show response
    await expect(page.locator('.message, .response, text=VCF')).toBeVisible({ timeout: 15000 });
  });

  test('should handle genomic data questions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');
    await chatInput.fill('What genomic data can I upload?');
    await page.keyboard.press('Enter');

    // Should mention VCF, CSV, JSON
    await expect(page.locator('text=VCF, text=CSV, text=JSON')).toBeVisible({ timeout: 15000 });
  });

  test('should handle learning recommendation questions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');
    await chatInput.fill('How can I get learning recommendations?');
    await page.keyboard.press('Enter');

    // Should mention analysis or recommendations
    await expect(page.locator('text=recommendations, text=analysis, text=profile')).toBeVisible({ timeout: 15000 });
  });

  test('should handle visualization questions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');
    await chatInput.fill('How do I view 3D visualizations?');
    await page.keyboard.press('Enter');

    // Should mention 3D, visualization, explore
    await expect(page.locator('text=3D, text=visualization, text=Explore')).toBeVisible({ timeout: 15000 });
  });

  test('should display chat history', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    // Send multiple messages
    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');

    await chatInput.fill('First question');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    await chatInput.fill('Second question');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Both messages should be visible
    await expect(page.locator('text=First question')).toBeVisible();
    await expect(page.locator('text=Second question')).toBeVisible();
  });
});

test.describe('Troubleshooting Assistance', () => {

  test('should navigate to troubleshooting page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/troubleshoot');
    await expect(page).toHaveURL(/.*troubleshoot/);
  });

  test('should submit troubleshooting request', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/troubleshoot');

    // Fill troubleshooting form
    await page.selectOption('select[name="errorType"]', 'upload_error');
    await page.fill('textarea[name="errorMessage"]', 'File upload failed with error 500');
    await page.click('button:has-text("Get Help")');

    // Should show LLM analysis
    await expect(page.locator('.analysis, .solution, text=check, text=try')).toBeVisible({ timeout: 15000 });
  });

  test('should provide context-aware troubleshooting', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/troubleshoot');

    await page.selectOption('select[name="errorType"]', 'vcf_parsing_error');
    await page.fill('textarea[name="errorMessage"]', 'VCF file format invalid');
    await page.click('button:has-text("Get Help")');

    // Should mention VCF format requirements
    await expect(page.locator('text=VCF, text=format, text=##fileformat')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('LLM Performance', () => {

  test('should respond within reasonable time', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');

    const startTime = Date.now();
    await chatInput.fill('Quick test question');
    await page.keyboard.press('Enter');

    await expect(page.locator('.message, .response').last()).toBeVisible({ timeout: 15000 });
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    // Response should be within 15 seconds
    expect(responseTime).toBeLessThan(15000);
  });

  test('should cache similar queries', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');
    await page.click('button:has-text("Chat"), .chat-widget');

    const chatInput = page.locator('input[placeholder*="Ask"], textarea[placeholder*="question"]');

    // First query
    await chatInput.fill('How do I upload VCF files?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    // Same query again (should be faster due to caching)
    const startTime = Date.now();
    await chatInput.fill('How do I upload VCF files?');
    await page.keyboard.press('Enter');
    await expect(page.locator('.message, .response').last()).toBeVisible({ timeout: 5000 });
    const endTime = Date.now();

    const cachedResponseTime = endTime - startTime;

    // Cached response should be faster
    expect(cachedResponseTime).toBeLessThan(5000);
  });
});
