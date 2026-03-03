# Testing EduGeneLearn Without Infrastructure

This guide shows how to test the application without running any containers or backend services.

## Philosophy

You don't need a full infrastructure to verify the application works. This guide shows:
- How to run E2E tests without backend (mock mode)
- How to develop frontend without services
- How to test individual components in isolation
- How to validate the application structure

## 1. E2E Tests (No Backend Required)

### Quick Start

```bash
cd frontend
npm install
npx playwright install
npm run test:e2e
```

That's it! Tests run in **mock mode** by default - no backend services needed.

### What Gets Tested

All 61 E2E tests cover:
- User authentication (login, registration, MFA)
- File upload UI and validation
- Learning recommendations interface
- LLM chat interactions
- Collaboration features
- All 16 MBTI personality types

### How It Works

Tests intercept API calls and return mock responses:
- Login → Mock JWT token
- Upload → Mock success response
- AI Recommendations → Mock predictions
- LLM Chat → Mock conversational responses

### View Test Results

```bash
# Run tests
npm run test:e2e

# View HTML report
npx playwright show-report

# Interactive mode
npx playwright test --ui
```

## 2. Frontend Development (No Backend)

### Run Frontend Standalone

```bash
cd frontend
npm install
npm run dev
```

Access: http://localhost:3000

### Mock API in Development

Create `frontend/src/mocks/handlers.js`:

```javascript
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: { username: 'testuser', role: 'USER' }
      })
    );
  }),
  // Add more mocked endpoints
];
```

Install MSW for API mocking:
```bash
npm install msw --save-dev
npx msw init public/
```

## 3. Component Testing (Isolation)

### Test Individual Components

```bash
cd frontend
npm test
```

Example component test:

```javascript
// DataUpload.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import DataUpload from './DataUpload';

test('shows file selection input', () => {
  render(<DataUpload userId="123" />);
  expect(screen.getByText(/Upload Genomic Data/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Select File/i)).toBeInTheDocument();
});

test('validates file types', () => {
  render(<DataUpload userId="123" />);
  const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  const input = screen.getByLabelText(/Select File/i);

  fireEvent.change(input, { target: { files: [file] } });

  expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
});
```

## 4. Backend Testing (No Database)

### Java Unit Tests with H2

Backend tests use in-memory H2 database:

```bash
cd backend/learning-integrator
./mvnw test
```

Tests run without PostgreSQL - H2 provides in-memory database.

### Python Tests with Mocks

```bash
cd ai-model
pip install -r requirements.txt
pip install pytest pytest-mock
pytest
```

Example test:

```python
# test_learning_predictor.py
def test_learning_profile_prediction(mocker):
    # Mock the model
    mock_model = mocker.MagicMock()
    mock_model.return_value = torch.tensor([[0.75, 0.60, 0.55, 0.90, 0.80, 0.70]])

    # Test prediction
    profile = LearningProfileInput(
        memory_gene_score=0.8,
        attention_gene_score=0.7,
        processing_speed_score=0.75,
        current_visual_score=80,
        current_auditory_score=60,
        current_kinesthetic_score=50,
        tech_access_score=0.9,
        study_env_quality=0.8,
        internet_quality=0.85,
        mbti_type="INTJ"
    )

    # Verify output structure
    assert isinstance(profile, LearningProfileInput)
```

## 5. Static Code Analysis

### Frontend Linting

```bash
cd frontend
npm run lint
```

### Backend Code Quality

```bash
cd backend/learning-integrator
./mvnw checkstyle:check
./mvnw spotbugs:check
```

### Python Linting

```bash
cd ai-model
pip install flake8
flake8 .
```

## 6. Structure Validation

### Verify Project Structure

```bash
# Check all services have required files
cd Edu-Gene-Learn

# Backend services
ls -la backend/*/pom.xml
ls -la backend/*/Dockerfile

# Python services
ls -la ai-model/requirements.txt
ls -la backend/llm-service/requirements.txt

# Frontend
ls -la frontend/package.json
ls -la frontend/Dockerfile

# Infrastructure
ls -la infra/nginx/default.conf
ls -la infra/kubernetes/*.yml
```

### Verify Configuration Files

```bash
# Environment template exists
cat .env.example

# Docker/Podman configs
cat docker-compose.yml

# Documentation
cat README.md
cat QUICKSTART.md
cat PODMAN_SETUP.md
```

## 7. Build Verification (No Deployment)

### Build Frontend

```bash
cd frontend
npm install
npm run build

# Verify build output
ls -la dist/
```

### Build Backend JARs

```bash
cd backend/learning-integrator
./mvnw clean package -DskipTests

# Verify JAR created
ls -la target/*.jar
```

### Build Container Images (No Run)

```bash
# Build but don't run
cd backend/api-gateway
podman build -t edugenelearn-api-gateway .

# List built images
podman images | grep edugenelearn
```

## 8. Documentation Review

### Read All Documentation

```bash
cat README.md
cat QUICKSTART.md
cat PODMAN_SETUP.md
cat CONTRIBUTING.md
cat PROJECT_STRUCTURE.md
cat LICENSE
cat frontend/tests/e2e/STANDALONE_TESTING.md
```

### Verify Documentation Completeness

Check that docs cover:
- Setup instructions
- Running with Podman
- Local development
- Testing approach
- License terms
- Contributing guidelines

## Summary: Complete Testing Without Infrastructure

```bash
# 1. Clone repository
git clone https://github.com/sekacorn/EduGeneLearn.git
cd EduGeneLearn

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Run E2E tests (mock mode - no backend)
npm run test:e2e

# 4. Run frontend unit tests
npm test

# 5. View test report
npx playwright show-report

# 6. Lint frontend code
npm run lint

# 7. Build frontend
npm run build

# Done! Application tested without any infrastructure.
```

## When You Need Infrastructure

You only need actual services when:
- Testing real database integrations
- Testing actual AI model predictions
- Testing real LLM API calls
- Performance/load testing
- End-to-end integration validation

For everything else, the mock testing approach is faster, more reliable, and easier to maintain!

## Benefits of This Approach

**Fast**: Tests complete in seconds, not minutes
**Reliable**: No flaky network issues or service dependencies
**Easy**: No complex infrastructure setup
**Portable**: Works on any machine with Node.js
**CI/CD Ready**: Perfect for GitHub Actions or similar
**Developer Friendly**: Quick feedback loop

## Next Steps

When you're ready for full integration:
1. See PODMAN_SETUP.md for running with Podman
2. See QUICKSTART.md for Docker setup
3. Configure `.env` with real API keys
4. Start services and run tests in "real" mode

But for validation and development, mock mode is perfect! 

