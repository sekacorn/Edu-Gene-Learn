import { test, expect } from '@playwright/test';

/**
 * Smoke Test - Verifies E2E test infrastructure is working
 * This test doesn't require any backend or web server
 */

test.describe('E2E Infrastructure Smoke Test', () => {

  test('Playwright is configured correctly', async ({ page }) => {
    // Navigate to a data URL (no server required)
    await page.goto('data:text/html,<html><body><h1>EduGeneLearn Test</h1><p>E2E infrastructure is working!</p></body></html>');

    // Verify page loaded
    await expect(page.locator('h1')).toHaveText('EduGeneLearn Test');
    await expect(page.locator('p')).toContainText('infrastructure is working');
  });

  test('Can interact with page elements', async ({ page }) => {
    await page.goto('data:text/html,<html><body><button id="testBtn">Click Me</button><div id="result"></div><script>document.getElementById("testBtn").onclick=()=>document.getElementById("result").textContent="Clicked!";</script></body></html>');

    // Click button
    await page.click('#testBtn');

    // Verify result
    await expect(page.locator('#result')).toHaveText('Clicked!');
  });

  test('Can fill forms', async ({ page }) => {
    await page.goto('data:text/html,<html><body><form><input id="name" type="text" placeholder="Enter name"><input id="email" type="email" placeholder="Enter email"></form></body></html>');

    // Fill form fields
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');

    // Verify values
    await expect(page.locator('#name')).toHaveValue('Test User');
    await expect(page.locator('#email')).toHaveValue('test@example.com');
  });

  test('Multiple browsers are available', async ({ browserName }) => {
    // This test verifies that different browser engines work
    expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
  });

  test('Can take screenshots', async ({ page }) => {
    await page.goto('data:text/html,<html><body><h1 style="color:blue;">Screenshot Test</h1></body></html>');

    // Take screenshot (saved to test-results)
    await page.screenshot({ path: `test-results/smoke-test-${Date.now()}.png` });

    // Test passes if screenshot was taken without error
    expect(true).toBe(true);
  });
});

test.describe('EduGeneLearn Application Structure Validation', () => {

  test('Application files exist', async () => {
    const fs = require('fs');
    const path = require('path');

    const projectRoot = path.resolve(__dirname, '../../..');

    // Check key files exist
    const files = [
      'README.md',
      'LICENSE',
      'docker-compose.yml',
      '.env.example',
      'PODMAN_SETUP.md',
      'TESTING_WITHOUT_INFRASTRUCTURE.md',
      'frontend/package.json',
      'frontend/src/App.jsx',
      'frontend/tests/e2e/auth.spec.js',
      'backend/api-gateway/pom.xml',
      'ai-model/requirements.txt',
      'database/postgres/schema.sql',
    ];

    for (const file of files) {
      const filePath = path.join(projectRoot, file);
      expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
    }
  });

  test('Package.json has correct scripts', async () => {
    const fs = require('fs');
    const path = require('path');

    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Verify required scripts exist
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test:e2e');
  });

  test('Dependencies are installed', async () => {
    const fs = require('fs');
    const path = require('path');

    const nodeModulesPath = path.resolve(__dirname, '../../node_modules');

    // Verify node_modules exists
    expect(fs.existsSync(nodeModulesPath)).toBe(true);

    // Verify key dependencies
    const dependencies = ['react', 'axios', '@playwright/test'];
    for (const dep of dependencies) {
      const depPath = path.join(nodeModulesPath, dep);
      expect(fs.existsSync(depPath), `${dep} should be installed`).toBe(true);
    }
  });
});

test.describe('Test Configuration', () => {

  test('Test config file exists', async () => {
    const fs = require('fs');
    const path = require('path');

    const configPath = path.resolve(__dirname, './test-config.js');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('Mock mode is enabled by default', async () => {
    const config = await import('./test-config.js');

    // Verify mock mode is default
    expect(config.TEST_MODE).toBe('mock');
    expect(config.config.mock.enabled).toBe(true);
  });

  test('Mock responses are defined', async () => {
    const config = await import('./test-config.js');

    // Verify mock responses exist
    expect(config.mockResponses).toHaveProperty('login');
    expect(config.mockResponses).toHaveProperty('uploadGenomicData');
    expect(config.mockResponses).toHaveProperty('learningRecommendations');
    expect(config.mockResponses).toHaveProperty('llmQuery');
    expect(config.mockResponses).toHaveProperty('collaborationSession');
  });
});
