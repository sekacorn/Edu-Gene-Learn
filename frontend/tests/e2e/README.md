# EduGeneLearn End-to-End Tests

This directory contains comprehensive E2E tests for the EduGeneLearn application using Playwright.

## Test Coverage

### 1. Authentication Tests (`auth.spec.js`)
- Landing page display
- Login form validation
- User registration
- Login with valid credentials
- Login with invalid credentials
- Logout functionality
- Password strength enforcement
- SSO login options
- MFA enablement
- MFA code verification
- Protected route access control

### 2. Genomic Upload Tests (`genomic-upload.spec.js`)
- Upload form display
- VCF file upload
- CSV file upload
- Invalid file type rejection
- File size limit enforcement
- Upload progress display
- Uploaded files list
- Data processing trigger
- Privacy notice display
- GDPR compliance information

### 3. Learning Recommendations Tests (`learning-recommendations.spec.js`)
- Navigation to analyze page
- Learning profile form
- Recommendation generation
- Personalized strategies display
- MBTI-tailored recommendations (ENTJ)
- MBTI-tailored recommendations (INFP)
- Confidence score display
- Optimal study time recommendations
- Session duration recommendations
- Learning style breakdown
- Dynamic recommendation updates
- Learning profile charts
- Genomic trait heatmap

### 4. LLM Chat Tests (`llm-chat.spec.js`)
- Chat interface display
- Send and receive messages
- Genomic data questions
- Learning recommendation questions
- MBTI-tailored responses (ENTJ)
- MBTI-tailored responses (INFP)
- Visualization questions
- Chat history display
- Troubleshooting page navigation
- Troubleshooting request submission
- Context-aware troubleshooting
- Response time performance
- Query caching

### 5. Collaboration Tests (`collaboration.spec.js`)
- Collaboration page navigation
- Session creation
- Active sessions display
- Join existing session
- Participant list display
- Chat messaging in session
- Leave session
- WebSocket connection status
- MBTI-tailored collaboration UI
- Maximum participants enforcement
- End session

## Running Tests

### Prerequisites
```bash
cd frontend
npm install
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/auth.spec.js
```

### Run in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generate Test Report
```bash
npx playwright show-report
```

## Test Configuration

Tests are configured in `playwright.config.js` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile viewport testing (Pixel 5, iPhone 12)
- Automatic screenshot on failure
- Video recording on failure
- Trace collection for debugging
- Parallel test execution

## CI/CD Integration

E2E tests run automatically in GitHub Actions on:
- Pull requests to `main` and `develop`
- Pushes to `main` and `develop`

See `.github/workflows/ci-cd.yml` for configuration.

## Test Data

Tests use:
- **Default admin account**: admin / Admin123!
- **Temporary test files**: Created and cleaned up automatically
- **Mock data**: Generated within tests as needed

## Coverage Target

- **Goal**: >90% critical user flow coverage
- **Current**: All major user flows covered (auth, upload, recommendations, chat, collaboration)

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Cleanup**: Tests clean up their own data
3. **Wait Strategies**: Use Playwright's auto-waiting instead of hard timeouts
4. **Selectors**: Use semantic selectors (text, role) over CSS/XPath when possible
5. **Assertions**: Use specific, meaningful assertions

## Debugging Failed Tests

1. Run in debug mode:
   ```bash
   npx playwright test --debug
   ```

2. View trace viewer:
   ```bash
   npx playwright show-trace trace.zip
   ```

3. Check screenshots in `test-results/` directory

4. Review video recordings in `test-results/` directory

## Known Limitations

- Tests assume services are running locally or in CI
- Some tests may require specific environment configuration
- WebSocket tests depend on collaboration service availability
- LLM tests may have variable response times depending on provider

## Future Enhancements

- [ ] Performance testing with Lighthouse
- [ ] Accessibility testing (WCAG compliance)
- [ ] Visual regression testing
- [ ] Load testing for concurrent users
- [ ] API contract testing

## Contact

For questions or issues with E2E tests, contact: Sekacorn@gmail.com

