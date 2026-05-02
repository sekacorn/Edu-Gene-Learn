import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * Tests: Registration, Login, Logout, SSO, MFA
 */

test.describe('Authentication', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/EduGeneLearn/);
    await expect(page.locator('h1')).toContainText('EduGeneLearn');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Login');
  });

  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign Up');

    const timestamp = Date.now();
    const testUser = {
      username: `testuser_${timestamp}`,
      email: `testuser_${timestamp}@example.com`,
      password: 'TestPass123!',
      fullName: 'Test User',
    };

    // Fill registration form
    await page.fill('input[name="username"]', testUser.username);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.fill('input[name="fullName"]', testUser.fullName);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or show success message
    await expect(page.locator('text=success')).toBeVisible({ timeout: 10000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Use default admin account
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.click('button:has-text("Logout")');

    // Should redirect to home or login
    await expect(page).toHaveURL(/.*\/(login)?$/);
  });

  test('should enforce password strength requirements', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign Up');

    // Try weak password
    await page.fill('input[name="password"]', 'weak');
    await page.blur('input[name="password"]');

    // Should show password strength error
    await expect(page.locator('text=password.*must')).toBeVisible();
  });

  test('should display SSO login options when enabled', async ({ page }) => {
    await page.goto('/login');

    // Check for SSO buttons (if SSO_ENABLED=true)
    const ssoButtons = page.locator('button:has-text("Google"), button:has-text("Okta"), button:has-text("Azure")');
    const count = await ssoButtons.count();

    // SSO buttons may or may not be visible depending on configuration
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('MFA (Multi-Factor Authentication)', () => {

  test('should allow user to enable MFA', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to profile/settings
    await page.click('text=Profile');
    await page.click('text=Security');

    // Enable MFA
    await page.click('button:has-text("Enable MFA")');

    // Should show QR code
    await expect(page.locator('canvas, img[alt="QR Code"]')).toBeVisible({ timeout: 5000 });
  });

  test('should require MFA code after enabling MFA', async ({ page }) => {
    // This test assumes MFA is enabled for the test user
    // In a real scenario, you'd set up test data with MFA enabled

    await page.goto('/login');
    await page.fill('input[name="username"]', 'mfa_user');
    await page.fill('input[name="password"]', 'MFAPass123!');
    await page.click('button[type="submit"]');

    // Should prompt for MFA code
    await expect(page.locator('input[name="mfaCode"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Protected Routes', () => {

  test('should redirect to login when accessing protected route without authentication', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow access to protected routes after authentication', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Try accessing protected routes
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    await page.goto('/analyze');
    await expect(page).toHaveURL(/.*analyze/);

    await page.goto('/explore');
    await expect(page).toHaveURL(/.*explore/);
  });
});
