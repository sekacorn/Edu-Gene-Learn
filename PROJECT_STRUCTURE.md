# EduGeneLearn Project Structure

This document reflects the current repo layout after the frontend build restoration, MBTI removal, and compliance page additions.

```text
Edu-Gene-Learn/
|-- README.md
|-- QUICKSTART.md
|-- TESTING_WITHOUT_INFRASTRUCTURE.md
|-- PODMAN_SETUP.md
|-- CONTRIBUTING.md
|-- LICENSE
|-- .env.example
|-- docker-compose.yml
|
|-- ai-model/
|   |-- learning_predictor.py
|   |-- requirements.txt
|   |-- Dockerfile
|
|-- backend/
|   |-- api-gateway/
|   |   |-- src/main/java/com/edugene/gateway/ApiGatewayApp.java
|   |   |-- src/main/resources/application.yml
|   |   |-- pom.xml
|   |   |-- Dockerfile
|   |
|   |-- learning-integrator/
|   |   |-- src/main/java/com/edugene/integrator/
|   |   |   |-- LearningIntegratorApp.java
|   |   |   |-- controller/GenomicDataController.java
|   |   |   |-- model/GenomicData.java
|   |   |   |-- repository/GenomicDataRepository.java
|   |   |   |-- service/GenomicDataService.java
|   |   |   |-- utils/VcfParser.java
|   |   |-- src/main/resources/application.yml
|   |   |-- pom.xml
|   |   |-- Dockerfile
|   |
|   |-- user-session/
|   |   |-- src/main/java/com/edugene/session/
|   |   |   |-- UserSessionApp.java
|   |   |   |-- model/User.java
|   |   |   |-- model/UserRole.java
|   |   |   |-- security/JwtService.java
|   |   |-- src/main/resources/application.yml
|   |   |-- pom.xml
|   |   |-- Dockerfile
|   |
|   |-- llm-service/
|       |-- llm_service.py
|       |-- requirements.txt
|       |-- Dockerfile
|
|-- database/
|   |-- postgres/schema.sql
|   |-- redis/config.yaml
|
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- Dockerfile
|   |-- src/
|   |   |-- main.jsx
|   |   |-- App.jsx
|   |   |-- styles.css
|   |   |-- components/
|   |   |   |-- DataUpload.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |-- pages/
|   |   |   |-- Home.jsx
|   |   |   |-- Login.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Analyze.jsx
|   |   |   |-- Explore.jsx
|   |   |   |-- Troubleshoot.jsx
|   |   |   |-- Collaborate.jsx
|   |   |   |-- Compliance.jsx
|   |   |-- services/api.js
|   |-- tests/e2e/
|
|-- infra/
|   |-- nginx/default.conf
|   |-- prometheus/prometheus.yml
|   |-- kubernetes/
|       |-- namespace.yml
|       |-- postgres-deployment.yml
|       |-- api-gateway-deployment.yml
|       |-- frontend-deployment.yml
|
|-- .github/workflows/ci-cd.yml
```

## Running Services

`docker-compose.yml` currently starts:

- PostgreSQL on `5432`
- Redis on `6379`
- API Gateway on `8080`
- Learning Integrator on `8081`
- User Session on `8083`
- AI Model on `8000`
- LLM Service on `8085`
- Frontend on `3000`
- NGINX on `80` and `443`
- Prometheus on `9090`
- Grafana on `3001`

The API gateway has reserved route entries for visualization and collaboration services, but those services are not currently included as standalone backend containers. The current React frontend includes Explore and Collaborate pages that support local/demo workflows.

## Frontend Pages

- `/`: home
- `/login`: login and local mock credentials
- `/dashboard`: protected dashboard
- `/analyze`: protected learning profile analysis
- `/explore`: protected exploration UI
- `/troubleshoot`: protected troubleshooting UI
- `/collaborate`: protected collaboration UI
- `/compliance`: public compliance readiness page

## Data Model Notes

- MBTI has been removed from the frontend, AI input model, LLM personalization context, Java user entity, and PostgreSQL schema.
- User roles are `USER`, `MODERATOR`, and `ADMIN`.
- Genomic uploads support VCF, CSV, and JSON paths in the learning-integrator service.

## Documentation Notes

- `README.md` is the authoritative overview.
- `QUICKSTART.md` focuses on setup and run commands.
- `TESTING_WITHOUT_INFRASTRUCTURE.md` focuses on mock-mode validation.
- `PODMAN_SETUP.md` is retained for Podman-specific setup.
