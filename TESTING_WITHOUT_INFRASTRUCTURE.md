# Testing EduGeneLearn Without Infrastructure

You can validate most frontend behavior without running PostgreSQL, Redis, Java services, or Python services.

## Frontend Mock Development

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` and log in with:

```text
Username: admin
Password: Admin123!
```

The login page falls back to a local development session when those credentials are used and the backend auth API is unavailable.

## Frontend Quality Checks

```bash
cd frontend
npm run lint
npm run build
npm test
```

## E2E Tests

```bash
cd frontend
npm install
npx playwright install
npm run test:e2e
```

The Playwright tests are intended to exercise major UI flows with mocked or local behavior. See `frontend/tests/e2e/README.md` and `frontend/tests/e2e/STANDALONE_TESTING.md` for details.

## Python Checks

Use your local Python interpreter:

```bash
cd ai-model
pip install -r requirements.txt
pytest

cd ../backend/llm-service
pip install -r requirements.txt
pytest
```

The AI model can start without a pretrained `model.pt`; it logs that it is using an untrained model.

## Java Checks

```bash
cd backend/learning-integrator
mvn test

cd ../user-session
mvn test

cd ../api-gateway
mvn test
```

## Static Structure Checks

From the repo root:

```bash
Get-ChildItem backend -Directory
Get-ChildItem frontend/src -Recurse -File
docker compose config --quiet
```

On macOS/Linux shells, use equivalent `ls` or `find` commands.

## What Does Not Need Full Infrastructure

- Frontend navigation
- Mock login
- Compliance content review
- Analyze, Explore, Troubleshoot, and Collaborate UI flows
- Frontend lint/build checks
- Mock E2E tests

## When Full Infrastructure Is Needed

- Real database persistence
- Real genomic upload processing through the API gateway
- Redis-backed rate limiting or caching
- Real LLM provider integration
- Full container integration testing
- Production-like security, privacy, and compliance validation

## Security Reminder

Do not use real genomic, student, medical, or financial data in unsecured local demos. Real deployments need privacy, legal, accessibility, and security review beyond the mock-mode checks described here.
