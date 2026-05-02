# EduGeneLearn Quick Start Guide

This guide covers the practical ways to run EduGeneLearn locally.

## Prerequisites

- Git
- Node.js 18+
- Java 17+
- Python 3.10+; Python 3.13 is also usable for local Python checks
- Docker Compose or Podman Compose for full-stack runs

## Option 1: Frontend Mock Mode

Use this path when you want the app running quickly without containers or backend services.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Mock credentials:

```text
Username: admin
Password: Admin123!
```

The frontend will store a local development token after login. Protected pages such as Dashboard, Analyze, Explore, Troubleshoot, and Collaborate will then be available.

## Option 2: Full Stack with Docker Compose

From the repo root:

```bash
cp .env.example .env
docker-compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Learning Integrator: `http://localhost:8081`
- User Session: `http://localhost:8083`
- AI Model: `http://localhost:8000`
- LLM Service: `http://localhost:8085`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

Update `.env` before using real data. At minimum, set strong values for `POSTGRES_PASSWORD`, `JWT_SECRET`, and monitoring credentials. Add `HUGGINGFACE_API_KEY` or `XAI_API_KEY` if you are wiring in a real LLM provider.

## Option 3: Individual Services

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Learning Integrator:

```bash
cd backend/learning-integrator
mvn spring-boot:run
```

User Session:

```bash
cd backend/user-session
mvn spring-boot:run
```

API Gateway:

```bash
cd backend/api-gateway
mvn spring-boot:run
```

AI Model:

```bash
cd ai-model
pip install -r requirements.txt
uvicorn learning_predictor:app --reload --port 8000
```

LLM Service:

```bash
cd backend/llm-service
pip install -r requirements.txt
uvicorn llm_service:app --reload --port 8085
```

## Common Checks

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm test
npm run test:e2e
```

Java:

```bash
cd backend/learning-integrator
mvn test

cd ../user-session
mvn test

cd ../api-gateway
mvn test
```

Python:

```bash
cd ai-model
pytest

cd ../backend/llm-service
pytest
```

Compose config:

```bash
docker compose config --quiet
```

## Uploading Data

The learning-integrator service supports VCF, CSV, and JSON upload flows. In frontend mock mode, upload and analysis pages are useful for UI validation. For real processing, run the backend stack and verify the API gateway can reach the learning-integrator service.

Treat genomic files as sensitive personal data. Do not use real personal genomic data in public demos or unsecured environments.

## Compliance Page

Visit `http://localhost:3000/compliance` for the current readiness tracker covering NIST CSF, Section 508, GDPR, European Accessibility Act / EN 301 549, EU AI Act, NIS2, and Cyber Resilience Act themes.

This page is guidance-oriented and does not certify the app as compliant.

## Troubleshooting

- If port `3000` is busy, stop the existing frontend server or run Vite on another port.
- If Compose services fail health checks, inspect logs with `docker-compose logs [service-name]`.
- If uploads fail, confirm the file type is VCF, CSV, or JSON and that the backend stack is running.
- If LLM responses stay generic, remember the current service uses mock provider behavior unless a real provider is implemented and configured.
- If auth endpoints are unavailable, use frontend mock mode with `admin` / `Admin123!`.

## More Documentation

- `README.md`: project overview and architecture.
- `PROJECT_STRUCTURE.md`: current file and service layout.
- `TESTING_WITHOUT_INFRASTRUCTURE.md`: mock-mode testing workflow.
- `PODMAN_SETUP.md`: Podman-specific setup.
