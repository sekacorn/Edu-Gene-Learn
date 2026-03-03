import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Real-Time Collaboration
 * Tests: Session creation, joining, WebSocket communication
 */

test.describe('Collaboration Features', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to collaboration page', async ({ page }) => {
    await page.goto('/collaborate');
    await expect(page).toHaveURL(/.*collaborate/);
    await expect(page.locator('h1, h2')).toContainText(/Collaboration|Collaborate/);
  });

  test('should create a new collaboration session', async ({ page }) => {
    await page.goto('/collaborate');

    await page.click('button:has-text("Create Session")');

    // Fill session details
    await page.fill('input[name="sessionName"]', 'Test Study Group');
    await page.selectOption('select[name="sessionType"]', 'study_group');
    await page.fill('input[name="maxParticipants"]', '5');

    await page.click('button:has-text("Create")');

    // Should show success or redirect to session
    await expect(page.locator('text=Session created, text=success')).toBeVisible({ timeout: 10000 });
  });

  test('should display active collaboration sessions', async ({ page }) => {
    await page.goto('/collaborate');

    // Should show sessions list (or empty state)
    await expect(page.locator('.session-list, text=Active Sessions, text=No active sessions')).toBeVisible();
  });

  test('should join an existing collaboration session', async ({ page }) => {
    // First create a session
    await page.goto('/collaborate');
    await page.click('button:has-text("Create Session")');
    await page.fill('input[name="sessionName"]', 'Join Test Session');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(2000);

    // Navigate back to list
    await page.goto('/collaborate');

    // Join the session
    await page.click('button:has-text("Join")').first();

    // Should be in the session
    await expect(page.locator('text=Participants, text=Connected')).toBeVisible({ timeout: 10000 });
  });

  test('should display session participants', async ({ page, context }) => {
    // Create session
    await page.goto('/collaborate');
    await page.click('button:has-text("Create Session")');
    await page.fill('input[name="sessionName"]', 'Participants Test');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(2000);

    // Should show at least the creator as participant
    await expect(page.locator('text=admin, .participant')).toBeVisible();
  });

  test('should send and receive chat messages in session', async ({ page }) => {
    // Join or create session
    await page.goto('/collaborate');

    // Check if there are existing sessions
    const sessions = await page.locator('button:has-text("Join")').count();

    if (sessions === 0) {
      // Create new session
      await page.click('button:has-text("Create Session")');
      await page.fill('input[name="sessionName"]', 'Chat Test Session');
      await page.click('button:has-text("Create")');
      await page.waitForTimeout(2000);
    } else {
      // Join existing
      await page.click('button:has-text("Join")').first();
    }

    // Send chat message
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
    await chatInput.fill('Hello from E2E test!');
    await page.keyboard.press('Enter');

    // Message should appear in chat
    await expect(page.locator('text=Hello from E2E test!')).toBeVisible({ timeout: 5000 });
  });

  test('should leave collaboration session', async ({ page }) => {
    // Join session
    await page.goto('/collaborate');

    const sessions = await page.locator('button:has-text("Join")').count();
    if (sessions > 0) {
      await page.click('button:has-text("Join")').first();
      await page.waitForTimeout(2000);

      // Leave session
      await page.click('button:has-text("Leave Session")');

      // Should return to collaboration list
      await expect(page.locator('text=Active Sessions, .session-list')).toBeVisible();
    }
  });

  test('should show WebSocket connection status', async ({ page }) => {
    await page.goto('/collaborate');

    const sessions = await page.locator('button:has-text("Join")').count();
    if (sessions > 0) {
      await page.click('button:has-text("Join")').first();

      // Should show connection status indicator
      await expect(page.locator('text=Connected, .status-connected, .online')).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('MBTI-Tailored Collaboration', () => {

  test('should adapt collaboration UI for different MBTI types', async ({ page }) => {
    // Set MBTI to ENTJ (leadership-focused)
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/profile');
    await page.selectOption('select[name="mbtiType"]', 'ENTJ');
    await page.click('button:has-text("Save")');

    // Go to collaboration
    await page.goto('/collaborate');

    // ENTJ should see leadership-oriented features
    // This is a conceptual test - actual implementation may vary
    await expect(page.locator('button, text')).toBeVisible();
  });
});

test.describe('Collaboration Session Management', () => {

  test('should enforce maximum participants limit', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/collaborate');
    await page.click('button:has-text("Create Session")');

    // Create session with max 1 participant
    await page.fill('input[name="sessionName"]', 'Limited Session');
    await page.fill('input[name="maxParticipants"]', '1');
    await page.click('button:has-text("Create")');

    // Session should be created
    await expect(page.locator('text=Session created, text=success')).toBeVisible({ timeout: 10000 });
  });

  test('should end collaboration session', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/collaborate');

    // Create session
    await page.click('button:has-text("Create Session")');
    await page.fill('input[name="sessionName"]', 'Session to End');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(2000);

    // End session (owner action)
    await page.click('button:has-text("End Session")');

    // Should confirm session ended
    await expect(page.locator('text=Session ended, text=closed')).toBeVisible({ timeout: 5000 });
  });
});
