# EduGeneLearn End-to-End Tests

This directory contains Playwright tests for the EduGeneLearn frontend. The suite is intended for local and CI validation of the primary user flows, with mock-friendly behavior where backend services are not required.

## Test Files

- `smoke.spec.js`: basic app availability and navigation checks.
- `auth.spec.js`: login, registration form behavior, invalid credential handling, logout, and protected route behavior.
- `genomic-upload.spec.js`: upload UI, supported file formats, validation, progress, and privacy/compliance content.
- `learning-recommendations.spec.js`: Analyze page profile inputs, recommendation output, confidence display, and learning strategy UI.
- `llm-chat.spec.js`: Troubleshoot and LLM-style assistance flows with mocked responses where applicable.
- `collaboration.spec.js`: Collaborate page session creation, participant UI, messaging UI, and local/demo collaboration behavior.

## Running Tests

```bash
cd frontend
npm install
npx playwright install
npm run test:e2e
```

Run a single file:

```bash
npx playwright test tests/e2e/auth.spec.js
```

Interactive mode:

```bash
npx playwright test --ui
```

Headed mode:

```bash
npx playwright test --headed
```

## Test Data

Default local credentials:

```text
Username: admin
Password: Admin123!
```

Tests create temporary data as needed. Do not use real genomic, student, medical, or financial data in E2E fixtures.

## Reports and Debugging

```bash
npx playwright show-report
npx playwright test --debug
```

Playwright writes screenshots, videos, and traces for configured failures under the test output directories.

## Current Boundaries

- The frontend supports local mock login for development.
- Collaboration and LLM workflows are validated as UI/demo flows unless real backing services are running.
- SSO and MFA are configuration/roadmap areas; they are not documented here as completed E2E coverage.
- Accessibility testing should be expanded with automated checks such as axe and manual Section 508/WCAG review.

## Related Docs

- `../../README.md`
- `../../TESTING_WITHOUT_INFRASTRUCTURE.md`
- `STANDALONE_TESTING.md`
