# EduGeneLearn

EduGeneLearn is free, open research software for nonprofits, universities, researchers, students, and public-interest teams studying DNA-informed education workflows. Its mission is to reduce the money these groups spend on over-priced proprietary platforms by giving them a practical application they can run, inspect, modify, and adapt for research or mission-driven work.

## The Problem

Nonprofits, universities, and research teams often need software for DNA data workflows, education studies, AI-assisted analysis, privacy review, accessibility planning, compliance tracking, and deployment infrastructure. Commercial platforms can be expensive before a team has even validated a research idea. That pricing can push small labs, student teams, and public-interest groups away from experimentation and into vendor dependency.

EduGeneLearn addresses that access problem for teams that need:

- A local application for exploring genomic, educational, and environmental learning signals.
- A starting point for DNA upload workflows without paying for a closed platform first.
- Research-friendly code they can inspect and change.
- Mock-friendly development flows that do not require every service to be running.
- Compliance readiness content for privacy, accessibility, cybersecurity, and AI governance planning.
- Documentation that is honest about what is implemented and what still needs professional review.

## What This Solves

EduGeneLearn gives research and mission-driven teams a no-cost software foundation for prototyping DNA-informed education research. It provides a React frontend, Java/Spring backend services, Python/FastAPI AI and LLM services, PostgreSQL/Redis infrastructure, Docker Compose orchestration, Kubernetes starter manifests, screenshots, tests, and practical documentation.

The project does not replace legal, medical, privacy, accessibility, cybersecurity, or institutional review. It gives teams a transparent starting point so they can spend less on basic software scaffolding and more on research, participants, students, accessibility, privacy, and responsible deployment.

## Who It Is For

- Nonprofits doing public-interest education or DNA research.
- Universities and research labs studying genomic, educational, or environmental signals.
- Researchers who need inspectable software instead of closed vendor tooling.
- Students building responsible genomics or education technology prototypes.
- Public-interest teams and civic technologists working on accessible research infrastructure.
- Community organizations evaluating whether DNA-informed tools can support their mission.
- Privacy, security, accessibility, and compliance reviewers who need a concrete app to assess.

## Free / Low-Cost Use

This repository currently uses the [Apache License 2.0](LICENSE). Under that license, users may use, copy, modify, and distribute the software at no charge, subject to the terms in the license file.

Nonprofits, universities, researchers, students, and public-interest teams can use EduGeneLearn for free by:

1. Reading the [LICENSE](LICENSE).
2. Cloning or forking this repository.
3. Keeping required license and attribution notices.
4. Running it locally, in a lab environment, or in an institution-managed environment.
5. Modifying it for their study, curriculum, accessibility needs, security requirements, or deployment constraints.

Contact information is present in the repo: `Sekacorn@gmail.com`. Use it for institutional free-use confirmation, nonprofit/research collaboration, support discussions, or separate licensing conversations.

## What Is Included

- **Frontend app**: React/Vite pages for home, login, dashboard, analysis, exploration, troubleshooting, collaboration, and compliance.
- **Mock login**: Local development login with `admin` / `Admin123!` when backend authentication is unavailable.
- **Genomic upload workflow**: A frontend upload component and Spring Boot learning-integrator service for VCF, CSV, and JSON data paths.
- **AI model service**: FastAPI + PyTorch service for learning-profile prediction from genomic, educational, and environmental inputs.
- **LLM service**: FastAPI service with mock Hugging Face/xAI provider paths for learning, upload, visualization, and troubleshooting prompts.
- **User/session foundation**: Java user model, roles, and JWT utility code.
- **API gateway**: Spring Cloud Gateway routing for implemented services plus reserved routes for future visualization and collaboration backends.
- **Database schema**: PostgreSQL schema and Redis configuration.
- **Infrastructure**: Docker Compose, NGINX reverse proxy config, Prometheus config, Grafana service, and Kubernetes starter manifests.
- **Tests and tooling**: ESLint, Jest, Playwright E2E test files, Maven test commands, Python pytest-ready service structure, and CI workflow files.
- **Documentation**: Quick start, project structure, Podman setup, no-infrastructure testing guide, and E2E testing docs.
- **Screenshots**: UI screenshots under `docs/screenshots/`.

Current vs planned distinction:

- Implemented now: frontend routes, mock login, compliance page, buildable frontend, Java/Python service skeletons, Docker Compose config, docs, screenshots, and test files.
- Partially implemented or mock/demo: LLM responses, AI model training state, collaboration behavior, visualization backend, enterprise SSO/MFA, and production compliance evidence.

## Compliance and Trust Posture

EduGeneLearn includes compliance readiness content, security notes, privacy warnings, and deployment guidance. It is not certified compliant with any framework. Teams using real DNA, student, health, or education data must complete their own legal, privacy, accessibility, security, and institutional review before production use.

### GDPR

Why it may matter: DNA data can be sensitive personal data, and EU research or participant workflows may trigger GDPR duties around lawful basis, consent, minimization, access, deletion, retention, and special category data protection.

What exists in the repo: The Compliance page and README call out GDPR readiness themes, sensitive DNA data handling, consent, minimization, retention, access, deletion, and review responsibilities.

What remains the deployer's responsibility: Determine lawful basis, draft consent notices, complete DPIAs where needed, implement production-grade data subject request workflows, configure retention/deletion, secure hosting, and confirm cross-border transfer rules.

### European Accessibility Act / EN 301 549

Why it may matter: Universities, public-sector partners, and European-market digital services may need accessible user interfaces and procurement-ready accessibility evidence.

What exists in the repo: The Compliance page tracks accessibility readiness, and the frontend uses semantic page structure, keyboard-friendly form controls, readable layouts, and responsive styling.

What remains the deployer's responsibility: Run formal WCAG/EN 301 549 audits, test with assistive technologies, document accessibility conformance, fix discovered defects, and maintain accessibility through future changes.

### EU AI Act

Why it may matter: AI used in education or learning recommendations may require transparency, risk management, human oversight, documentation, and governance depending on deployment context.

What exists in the repo: The README and Compliance page identify AI governance readiness. The AI service is separated from the frontend and exposes explicit input/output schemas for learning recommendations.

What remains the deployer's responsibility: Classify the system under applicable AI Act categories, validate model behavior, document datasets and risks, add human review workflows, monitor performance, and ensure AI-assisted outputs are not treated as final professional decisions.

### NIS2 Directive

Why it may matter: Organizations operating important digital services in the EU may need cybersecurity governance, incident handling, continuity planning, and supplier risk management.

What exists in the repo: Docker Compose, NGINX, Prometheus, service health checks, JWT utility code, `.gitignore` secret hygiene, and security notes provide a starting point for operational planning.

What remains the deployer's responsibility: Establish organizational security governance, incident reporting, backup/restore plans, vulnerability management, access reviews, supplier controls, and production monitoring.

### Cyber Resilience Act

Why it may matter: Digital products offered in the EU may need secure-by-design practices, vulnerability handling, lifecycle security, and documentation.

What exists in the repo: Open source code, dependency manifests, Dockerfiles, infrastructure files, CI workflow files, and security documentation give teams reviewable materials.

What remains the deployer's responsibility: Maintain SBOMs if required, scan dependencies and containers, manage vulnerabilities, document secure development practices, and define support/update lifecycles.

### Section 508 / WCAG 2.1 AA

Why it may matter: US public-sector, university, and grant-funded projects may need accessible interfaces for users with disabilities.

What exists in the repo: The Compliance page includes Section 508 readiness. The frontend includes visible labels, standard inputs/buttons, responsive layout, and readable content.

What remains the deployer's responsibility: Perform automated and manual accessibility testing, verify WCAG 2.1 AA success criteria, test keyboard-only and screen-reader workflows, document exceptions, and remediate issues.

### NIST SP 800-53

Why it may matter: Public-sector, university, and federally funded environments may map security controls to NIST SP 800-53 families such as access control, audit, configuration management, incident response, system integrity, and risk assessment.

What exists in the repo: JWT utility code, service boundaries, Docker Compose, health checks, Prometheus config, environment-variable based secrets, and security notes can support early control mapping.

What remains the deployer's responsibility: Select a baseline, map controls, implement audit logging, identity governance, encryption, configuration management, continuous monitoring, incident response, and evidence collection.

### NIST Cybersecurity Framework

Why it may matter: NIST CSF helps organizations organize cybersecurity practices around Identify, Protect, Detect, Respond, and Recover.

What exists in the repo: The Compliance page explicitly tracks NIST CSF readiness areas and the infrastructure includes monitoring and service health foundations.

What remains the deployer's responsibility: Create organization-specific policies, asset inventories, risk assessments, detection workflows, response playbooks, recovery plans, and governance evidence.

### FedRAMP Readiness

Why it may matter: Cloud services used by US federal agencies may need FedRAMP authorization or alignment planning.

What exists in the repo: Containerization, Kubernetes starter manifests, NGINX, Prometheus, and NIST-oriented documentation can help early planning.

What remains the deployer's responsibility: This repo has no FedRAMP authorization. A deploying organization would need a FedRAMP boundary, control implementation, SSP, continuous monitoring, vulnerability scans, evidence packages, third-party assessment, and agency authorization process.

## Current Status

EduGeneLearn is a runnable research prototype and development foundation. It is not production-ready for real participant DNA or student data without additional review and hardening.

Known limitations:

- The frontend can run in mock mode without backend services.
- The LLM service currently uses mock provider behavior.
- The AI model can run without a pretrained `model.pt`, which means outputs are not research-validated predictions by default.
- Enterprise SSO/MFA is a configuration and roadmap area, not a completed workflow.
- Collaboration and visualization backend routes are reserved, but standalone backend services for those routes are not included in `docker-compose.yml`.
- Compliance content is readiness guidance, not certification.
- Real deployments need security hardening, privacy review, accessibility testing, audit logging, backup/restore planning, and institutional approval.

## Quick Start

The simplest working path is frontend mock mode.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Demo credentials:

```text
Username: admin
Password: Admin123!
```

Useful routes:

- `http://localhost:3000/`
- `http://localhost:3000/login`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/analyze`
- `http://localhost:3000/explore`
- `http://localhost:3000/troubleshoot`
- `http://localhost:3000/collaborate`
- `http://localhost:3000/compliance`

Full stack with Docker Compose:

```bash
cp .env.example .env
docker-compose up --build
```

Main endpoints:

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Learning Integrator: `http://localhost:8081`
- User Session: `http://localhost:8083`
- AI Model: `http://localhost:8000`
- LLM Service: `http://localhost:8085`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

Before using real data or public deployments, update `.env` secrets such as `POSTGRES_PASSWORD`, `JWT_SECRET`, API keys, and Grafana credentials.

## Project Structure

```text
ai-model/                     FastAPI + PyTorch learning prediction service
backend/api-gateway/          Spring Cloud Gateway service
backend/learning-integrator/  Spring Boot genomic upload and processing service
backend/llm-service/          FastAPI LLM/troubleshooting service
backend/user-session/         Java user/session/JWT foundation
database/postgres/            PostgreSQL schema
database/redis/               Redis config
docs/screenshots/             README screenshots
frontend/                     React/Vite app, pages, components, E2E tests
infra/kubernetes/             Kubernetes starter manifests
infra/nginx/                  Reverse proxy config
infra/prometheus/             Prometheus config
```

More detail is available in [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Security, Privacy, and Production Readiness

- [SECURITY.md](SECURITY.md): vulnerability reporting, demo data warnings, and security hardening notes.
- [PRIVACY.md](PRIVACY.md): data the app can store, mock vs real deployment boundaries, and deployer responsibilities.
- [PRODUCTION_READINESS_CHECKLIST.md](PRODUCTION_READINESS_CHECKLIST.md): launch checklist for secrets, CORS, TLS, audit logs, backups, dependency scanning, accessibility, AI review, and legal/privacy review.

## Testing

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm test
npm run test:e2e
```

Backend Java services:

```bash
cd backend/learning-integrator
mvn test

cd ../user-session
mvn test

cd ../api-gateway
mvn test
```

Python services:

```bash
cd ai-model
pytest

cd ../backend/llm-service
pytest
```

The Playwright E2E suite is intended for mock-friendly local development. See [frontend/tests/e2e/STANDALONE_TESTING.md](frontend/tests/e2e/STANDALONE_TESTING.md).

## Screenshots

![EduGeneLearn screenshot 01](docs/screenshots/screenshot-01.png)

![EduGeneLearn screenshot 02](docs/screenshots/screenshot-02.png)

![EduGeneLearn screenshot 03](docs/screenshots/screenshot-03.png)

![EduGeneLearn screenshot 04](docs/screenshots/screenshot-04.png)

![EduGeneLearn screenshot 05](docs/screenshots/screenshot-05.png)

![EduGeneLearn screenshot 06](docs/screenshots/screenshot-06.png)

![EduGeneLearn screenshot 07](docs/screenshots/screenshot-07.png)

## License

EduGeneLearn is licensed under the [Apache License 2.0](LICENSE). The license permits no-charge use, copying, modification, and distribution under its terms.

Contact information present in the repo: `Sekacorn@gmail.com`.
