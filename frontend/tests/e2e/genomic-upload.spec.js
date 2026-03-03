import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * E2E Tests for Genomic Data Upload
 * Tests: File upload, validation, processing
 */

test.describe('Genomic Data Upload', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to upload page
    await page.goto('/dashboard');
    await page.click('text=Upload Genomic Data');
  });

  test('should display upload form correctly', async ({ page }) => {
    await expect(page.locator('h2:has-text("Upload Genomic Data")')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
    await expect(page.locator('text=VCF, CSV, JSON')).toBeVisible();
  });

  test('should accept valid VCF file', async ({ page }) => {
    // Create a mock VCF file
    const vcfContent = `##fileformat=VCFv4.2
##reference=GRCh38
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t10000\trs123456\tA\tG\t100\tPASS\tGENE=BRCA1
2\t20000\trs234567\tC\tT\t95\tPASS\tGENE=APOE`;

    // Create temp file
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const vcfPath = path.join(tempDir, 'test_data.vcf');
    fs.writeFileSync(vcfPath, vcfContent);

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(vcfPath);

    // Check file is selected
    await expect(page.locator('text=test_data.vcf')).toBeVisible();

    // Click upload button
    await page.click('button:has-text("Upload Data")');

    // Should show success message
    await expect(page.locator('text=success')).toBeVisible({ timeout: 15000 });

    // Cleanup
    fs.unlinkSync(vcfPath);
  });

  test('should accept valid CSV file', async ({ page }) => {
    const csvContent = `rsid,chromosome,position,genotype
rs123456,1,10000,AG
rs234567,2,20000,CT`;

    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const csvPath = path.join(tempDir, 'test_data.csv');
    fs.writeFileSync(csvPath, csvContent);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    await expect(page.locator('text=test_data.csv')).toBeVisible();
    await page.click('button:has-text("Upload Data")');
    await expect(page.locator('text=success')).toBeVisible({ timeout: 15000 });

    fs.unlinkSync(csvPath);
  });

  test('should reject invalid file types', async ({ page }) => {
    const txtContent = 'This is not a valid genomic file';
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const txtPath = path.join(tempDir, 'invalid.txt');
    fs.writeFileSync(txtPath, txtContent);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(txtPath);

    // Should show error about invalid file type
    await expect(page.locator('text=Invalid file type')).toBeVisible({ timeout: 5000 });

    fs.unlinkSync(txtPath);
  });

  test('should reject files over size limit', async ({ page }) => {
    // Create a large mock file (>100MB)
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const largePath = path.join(tempDir, 'large_file.vcf');

    // Create a ~101MB file
    const largeContent = 'A'.repeat(101 * 1024 * 1024);
    fs.writeFileSync(largePath, largeContent);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(largePath);

    // Should show error about file size
    await expect(page.locator('text=size exceeds')).toBeVisible({ timeout: 5000 });

    fs.unlinkSync(largePath);
  });

  test('should show upload progress', async ({ page }) => {
    const vcfContent = `##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t10000\trs123456\tA\tG\t100\tPASS\tGENE=BRCA1`;

    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const vcfPath = path.join(tempDir, 'progress_test.vcf');
    fs.writeFileSync(vcfPath, vcfContent);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(vcfPath);
    await page.click('button:has-text("Upload Data")');

    // Should show progress bar
    await expect(page.locator('[role="progressbar"], .progress, text=Uploading')).toBeVisible({ timeout: 2000 });

    fs.unlinkSync(vcfPath);
  });

  test('should display uploaded files list', async ({ page }) => {
    // Navigate to uploaded files view
    await page.goto('/dashboard');
    await page.click('text=My Genomic Data');

    // Should show list of uploaded files (or empty state)
    await expect(page.locator('text=Genomic Data, text=No data uploaded')).toBeVisible();
  });

  test('should allow processing of uploaded data', async ({ page }) => {
    // This assumes there's already uploaded data
    await page.goto('/dashboard');
    await page.click('text=My Genomic Data');

    // Check if there are any files to process
    const processButtons = page.locator('button:has-text("Process")');
    const count = await processButtons.count();

    if (count > 0) {
      await processButtons.first().click();
      await expect(page.locator('text=Processing started')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Data Privacy and Security', () => {

  test('should display privacy notice on upload page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');
    await page.click('text=Upload Genomic Data');

    // Should show privacy/security notice
    await expect(page.locator('text=Privacy, text=Security, text=encrypted')).toBeVisible();
  });

  test('should display GDPR compliance information', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');
    await page.click('text=Upload Genomic Data');

    await expect(page.locator('text=GDPR, text=COPPA')).toBeVisible();
  });
});
