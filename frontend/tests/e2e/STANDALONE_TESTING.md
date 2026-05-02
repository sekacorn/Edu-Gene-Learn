# Standalone E2E Testing Guide

This guide explains how to run E2E tests **without requiring backend services** using mock mode.

## Why Standalone Testing?

- Test frontend functionality without backend
- Fast test execution (no network calls)
- No infrastructure required
- Perfect for development and CI/CD
- Reliable tests (no flaky network issues)

## Running Tests in Mock Mode (Standalone)

### Setup

```bash
cd frontend
npm install
npx playwright install
```

### Run Tests Without Backend

By default, tests run in **mock mode** (no backend required):

```bash
# Run all tests in mock mode
npm run test:e2e

# Or explicitly set mock mode
E2E_TEST_MODE=mock npm run test:e2e
```

### Mock Mode Features

In mock mode:
- API calls are intercepted and mocked
- Responses are instant (with simulated delay)
- No database or services required
- Predictable test data
- 100% reliable (no network issues)

### What Gets Mocked

The following are automatically mocked:

1. **Authentication**
   - Login requests return mock JWT tokens
   - User data is simulated
   - No actual authentication backend needed

2. **Genomic Data Upload**
   - File uploads are intercepted
   - Success responses are simulated
   - No actual file processing occurs

3. **AI Recommendations**
   - Learning profile submissions return mock recommendations
   - Strategies and scores are pre-defined
   - No AI model service required

4. **LLM Queries**
   - Chat messages return mock responses
   - No LLM service required

5. **Collaboration**
   - Session creation/joining is mocked
   - WebSocket connections are simulated
   - No WebSocket server required

## Running Tests Against Real Backend

If you want to test against actual backend services:

### Prerequisites

1. Start all backend services:
   ```bash
   # With Podman
   podman-compose up --build

   # Or manually start services
   # (see PODMAN_SETUP.md)
   ```

2. Ensure services are healthy:
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - API Gateway: localhost:8080
   - Frontend: localhost:3000

### Run Tests in Real Mode

```bash
# Set test mode to real
E2E_TEST_MODE=real npm run test:e2e

# Or with custom URLs
E2E_TEST_MODE=real BASE_URL=http://localhost:3000 API_URL=http://localhost:8080 npm run test:e2e
```

## Test Configuration

Edit `tests/e2e/test-config.js` to customize:

```javascript
export const TEST_MODE = process.env.E2E_TEST_MODE || 'mock';

export const config = {
  mock: {
    enabled: TEST_MODE === 'mock',
    delay: 500, // Simulated network delay
  },
  real: {
    enabled: TEST_MODE === 'real',
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:8080',
  },
};
```

## Mock Response Customization

To customize mock responses, edit `tests/e2e/test-config.js`:

```javascript
export const mockResponses = {
  login: {
    success: {
      token: 'mock-jwt-token',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
      },
    },
  },
  // ... other mock responses
};
```

## Running Specific Test Categories

```bash
# Only authentication tests
npx playwright test tests/e2e/auth.spec.js

# Only upload tests
npx playwright test tests/e2e/genomic-upload.spec.js

# Only recommendation tests
npx playwright test tests/e2e/learning-recommendations.spec.js

# Only LLM tests
npx playwright test tests/e2e/llm-chat.spec.js

# Only collaboration tests
npx playwright test tests/e2e/collaboration.spec.js
```

## Interactive Testing

For debugging and development:

```bash
# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test --debug tests/e2e/auth.spec.js
```

## Test Reports

After running tests:

```bash
# View HTML report
npx playwright show-report

# Report includes:
# - Test results
# - Screenshots (on failure)
# - Videos (on failure)
# - Traces (for debugging)
```

## CI/CD Integration (Optional)

If you want to add CI/CD later, tests can run in GitHub Actions:

```yaml
- name: Run E2E Tests
  run: |
    cd frontend
    npm ci
    npx playwright install --with-deps
    E2E_TEST_MODE=mock npm run test:e2e
```

## Benefits of Mock Mode

### Speed
- Mock mode: ~2-5 seconds per test
- Real mode: ~5-15 seconds per test

### Reliability
- Mock mode: 100% success rate
- Real mode: Depends on service availability

### Setup Time
- Mock mode: Install and run (1 minute)
- Real mode: Start all services (5-10 minutes)

## When to Use Each Mode

### Use Mock Mode When:
- Developing frontend features
- Testing UI components
- Running in CI/CD
- Quick feedback loop needed
- Backend services unavailable

### Use Real Mode When:
- Integration testing
- End-to-end validation
- Performance testing
- Database interactions testing
- Pre-production validation

## Troubleshooting

### Tests Failing in Mock Mode

1. Check if test expects real API responses
2. Verify mock responses match expected format
3. Check console for errors: `npx playwright test --headed`

### Tests Failing in Real Mode

1. Verify all services are running: `podman ps`
2. Check service health: `curl http://localhost:8080/actuator/health`
3. Review service logs: `podman logs api-gateway`

## Example Test Run

```bash
# Terminal output
$ npm run test:e2e

> edugenelearn-frontend@1.0.0 test:e2e
> playwright test

Running 61 tests using 4 workers
  ✓ [chromium] › auth.spec.js:8:3 › Authentication › should display landing page correctly (523ms)
  ✓ [chromium] › auth.spec.js:13:3 › Authentication › should navigate to login page (412ms)
  ✓ [chromium] › auth.spec.js:19:3 › Authentication › should show validation errors (381ms)
  ...

  61 passed (2m)

To open last HTML report run:
  npx playwright show-report
```

## Summary

- **Mock Mode (Default)**: Fast, reliable, no backend needed
- **Real Mode**: Full integration, requires backend services
- **Flexible**: Switch modes with environment variable
- **Comprehensive**: 61 tests covering all features

Perfect for development without infrastructure overhead!

