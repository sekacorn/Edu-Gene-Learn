# EduGeneLearn

EduGeneLearn is a production-ready, modular, full-stack web application designed to revolutionize education by integrating genomic data (e.g., VCF files from 23andMe), educational data (e.g., learning style assessments), and environmental data (e.g., socio-economic factors) to provide personalized learning recommendations, 3D genomic visualizations, and collaborative tools.

## Purpose and Impact

- **Personalizes Education**: Genomic data can reveal cognitive traits (e.g., memory, attention) that influence learning styles. EduGeneLearn uses these insights to tailor educational strategies, improving outcomes for students globally.
- **Addresses Educational Disparities**: UNESCO reports 60% of children in low-income countries fail to achieve basic reading and math proficiency. EduGeneLearn provides accessible, data-driven tools to bridge this gap.
- **Inclusive Design**: Tailors interfaces for all 16 MBTI types, ensuring usability for diverse users.
- **Global Accessibility**: Open-source architecture ensures deployment in low-resource settings, with multilingual support for diverse users.

## Key Features

1. **Data Integration**: Aggregates genomic (VCF), educational (CSV), and environmental data (JSON/CSV)
2. **3D Visualization**: Interactive genomic structures and learning trait mappings using Three.js
3. **AI-Driven Recommendations**: PyTorch-based learning strategy predictions
4. **Natural Language Queries**: LLM integration for intuitive interaction
5. **Real-Time Collaboration**: WebSocket-based collaborative sessions
6. **Resource Monitoring**: CPU/memory/GPU usage tracking with dynamic multithreading
7. **User Management**: Support for Users, Moderators, and Admins with SSO and MFA for enterprise

## Tech Stack

- **Frontend**: React 18, Three.js, Tailwind CSS, Vite, Socket.IO
- **Backend**: Java 17, Spring Boot 3, Spring Cloud Gateway, Spring Security, Spring WebSocket
- **AI Service**: Python 3.10, FastAPI, PyTorch, BioPython
- **LLM Service**: Python 3.10, FastAPI, Hugging Face Transformers
- **Database**: PostgreSQL, Redis
- **Authentication**: JWT, OAuth2, SSO with MFA
- **Infrastructure**: Docker, Docker Compose, Kubernetes, NGINX
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, SLF4J, Loki

## Prerequisites

### For Running with Containers
- **Docker** and Docker Compose **OR Podman** and Podman Compose
- Git

### For Local Development
- Node.js 18+
- Java 17+
- Python 3.10+
- PostgreSQL 15+ (or use container)
- Redis 7+ (or use container)

### Optional
- Kubernetes CLI (for K8s deployment)
- xAI or Hugging Face API key (for LLM service)

## Quick Start

### Option 1: Using Podman (Recommended for this setup)

```bash
# Clone the repository
git clone https://github.com/sekacorn/Edu-Gene-Learn.git
cd Edu-Gene-Learn

# Copy environment template
cp .env.example .env
# Edit .env with your settings (optional for basic testing)

# Start with Podman Compose
podman-compose up --build

# Or see PODMAN_SETUP.md for detailed Podman instructions
```

### Option 2: Using Docker

```bash
# Clone the repository
git clone https://github.com/sekacorn/Edu-Gene-Learn.git
cd Edu-Gene-Learn

# Copy environment template
cp .env.example .env

# Start with Docker Compose
docker-compose up --build
```

### Option 3: Local Development (No Containers)

See PODMAN_SETUP.md for running services locally without containers.

### Access the Application

Once running:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Troubleshooting: http://localhost:3000/troubleshoot
- Collaboration: http://localhost:3000/collaborate

## Kubernetes Deployment (Optional)

For production deployment to Kubernetes:

```bash
kubectl apply -f infra/kubernetes/

# Check deployment status
kubectl get pods -n edugenelearn
kubectl get services -n edugenelearn
```

**Note**: Kubernetes deployment is optional. The application can run with Podman/Docker or locally.

## User Roles

- **Users**: Standard access to learning recommendations and visualizations
- **Moderators**: Can manage user content and moderate collaborative sessions
- **Admins**: Full system access with user management capabilities
- **Enterprise**: SSO integration with optional MFA for enhanced security

## Testing

The application includes comprehensive testing:
- Unit tests for all components
- Integration tests for API endpoints
- End-to-end tests for user workflows

### Run Tests

```bash
# Backend tests
cd backend/[service-name]
./mvnw test

# Frontend tests
cd frontend
npm test

# AI/LLM service tests
cd ai-model
pytest

# E2E tests (no backend required - uses mock mode)
cd frontend
npm run test:e2e
```

**Note**: E2E tests run in mock mode by default (no backend services required). See `frontend/tests/e2e/STANDALONE_TESTING.md` for details.

## License

This project is dual-licensed:
- **Non-profit use**: Free and open-source (see LICENSE file)
- **Commercial use**: Requires 6% of gross income license fee

For commercial licensing inquiries, contact: Sekacorn@gmail.com

## Copyright Disclaimer

EduGeneLearn is an original work, using open-source libraries for compatibility with VCF, CSV, and JSON formats, without proprietary code from PyMOL, Blender, Moodle, or other tools. All dependencies use Apache 2.0 or MIT licenses.

## MBTI Usability

The application is designed to support all 16 MBTI personality types with tailored interfaces:
- ENTJ, INFP, INFJ, ESTP, INTJ, INTP, ISTJ, ESFJ
- ISFP, ENTP, ISFJ, ESFP, ENFJ, ESTJ, ISTP

Each type receives customized UI elements, LLM responses, and collaboration features suited to their cognitive preferences.

## Security

- Input validation and sanitization
- TLS encryption for data in transit
- AES-256 encryption for data at rest
- Rate limiting and CORS/CSRF protection
- OWASP compliance
- GDPR and COPPA compliance considerations

## Support

For issues, questions, or contributions, please contact: Sekacorn@gmail.com

## Author

Created by sekacorn - Advancing humanity through personalized, genomic-driven education.

## Advancing Humanity

By leveraging genomic insights to personalize education, EduGeneLearn addresses global educational disparities, empowers educators and students with data-driven tools, and provides scalable, inclusive solutions for diverse learning needs worldwide.
