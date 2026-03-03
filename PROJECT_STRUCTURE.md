# EduGeneLearn Project Structure

This document provides an overview of the complete project structure.

## Directory Layout

```
EduGeneLearn/
├── README.md                           # Main project documentation
├── LICENSE                             # Dual license agreement
├── CONTRIBUTING.md                     # Contribution guidelines
├── QUICKSTART.md                       # Quick start guide
├── docker-compose.yml                  # Docker orchestration
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
│
├── backend/                            # Backend microservices (Spring Boot)
│   ├── learning-integrator/            # Genomic/Educational data integration
│   │   ├── src/main/java/com/edugene/integrator/
│   │   │   ├── LearningIntegratorApp.java  # Main application
│   │   │   ├── controller/             # REST controllers
│   │   │   │   └── GenomicDataController.java
│   │   │   ├── service/                # Business logic
│   │   │   │   └── GenomicDataService.java
│   │   │   ├── repository/             # Data access layer
│   │   │   │   └── GenomicDataRepository.java
│   │   │   ├── model/                  # Entity models
│   │   │   │   └── GenomicData.java
│   │   │   └── utils/                  # Utilities
│   │   │       └── VcfParser.java      # VCF file parser
│   │   ├── src/main/resources/
│   │   │   └── application.yml         # Service configuration
│   │   ├── pom.xml                     # Maven dependencies
│   │   └── Dockerfile                  # Container definition
│   │
│   ├── user-session/                   # Auth, SSO, MFA, User management
│   │   ├── src/main/java/com/edugene/session/
│   │   │   ├── UserSessionApp.java     # Main application
│   │   │   ├── model/
│   │   │   │   ├── User.java           # User entity
│   │   │   │   ├── UserRole.java       # USER, MODERATOR, ADMIN
│   │   │   │   └── MBTIType.java       # 16 MBTI types
│   │   │   └── security/
│   │   │       └── JwtService.java     # JWT token management
│   │   ├── src/main/resources/
│   │   │   └── application.yml         # SSO, MFA config
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── api-gateway/                    # API Gateway (Spring Cloud Gateway)
│   │   ├── src/main/java/com/edugene/gateway/
│   │   │   └── ApiGatewayApp.java      # Main application
│   │   ├── src/main/resources/
│   │   │   └── application.yml         # Route configuration
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── llm-service/                    # LLM service (Python FastAPI)
│   │   ├── llm_service.py              # FastAPI application
│   │   ├── requirements.txt            # Python dependencies
│   │   └── Dockerfile
│   │
│   ├── learning-visualizer/            # 3D visualization service
│   ├── collaboration-service/          # WebSocket collaboration
│   └── ...
│
├── ai-model/                           # AI/ML service (Python + PyTorch)
│   ├── learning_predictor.py           # FastAPI + PyTorch model
│   ├── requirements.txt                # Python dependencies
│   ├── model.pt                        # Pretrained PyTorch model (gitignored)
│   └── Dockerfile
│
├── frontend/                           # React frontend
│   ├── public/                         # Static assets
│   ├── src/
│   │   ├── App.jsx                     # Main app component
│   │   ├── components/                 # Reusable components
│   │   │   ├── DataUpload.jsx          # File upload component
│   │   │   ├── LearningViewer.jsx      # 3D visualization
│   │   │   ├── LearningDetails.jsx     # Recommendations display
│   │   │   ├── AnnotationTool.jsx      # Annotations
│   │   │   ├── ExportTool.jsx          # Export functionality
│   │   │   ├── LLMChat.jsx             # Chat interface
│   │   │   ├── ResourceMonitor.jsx     # Resource monitoring
│   │   │   ├── CollabPanel.jsx         # Collaboration UI
│   │   │   ├── Navbar.jsx              # Navigation
│   │   │   └── ProtectedRoute.jsx      # Route protection
│   │   ├── pages/                      # Page components
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── Analyze.jsx             # Learning analysis
│   │   │   ├── Explore.jsx             # 3D exploration
│   │   │   ├── Troubleshoot.jsx        # Debugging
│   │   │   ├── Collaborate.jsx         # Collaboration
│   │   │   └── Login.jsx               # Authentication
│   │   └── services/
│   │       ├── api.js                  # API client (Axios)
│   │       └── websocket.js            # WebSocket client
│   ├── package.json                    # NPM dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── nginx.conf                      # NGINX config for container
│   └── Dockerfile                      # Multi-stage build
│
├── database/                           # Database configurations
│   ├── postgres/
│   │   └── schema.sql                  # PostgreSQL schema with all tables
│   └── redis/
│       └── config.yaml                 # Redis configuration
│
├── infra/                              # Infrastructure as Code
│   ├── nginx/
│   │   └── default.conf                # NGINX reverse proxy config
│   ├── kubernetes/                     # Kubernetes manifests
│   │   ├── namespace.yml               # Namespace definition
│   │   ├── postgres-deployment.yml     # PostgreSQL deployment
│   │   ├── api-gateway-deployment.yml  # API Gateway deployment
│   │   ├── frontend-deployment.yml     # Frontend deployment
│   │   └── ...                         # Other service deployments
│   └── prometheus/
│       └── prometheus.yml              # Monitoring configuration
│
└── .github/                            # GitHub Actions
    └── workflows/
        └── ci-cd.yml                   # CI/CD pipeline
```

## Key Components

### Backend Microservices (Java/Spring Boot)

1. **learning-integrator** (Port 8081)
   - Genomic data upload and processing (VCF, CSV, JSON)
   - Educational assessment integration
   - Environmental data management
   - Technologies: Spring Boot, BioPython, PostgreSQL

2. **user-session** (Port 8083)
   - User authentication (local + SSO)
   - JWT token management
   - MFA support (TOTP)
   - Role-based access (USER, MODERATOR, ADMIN)
   - SSO providers: Google, Okta, Azure AD, Auth0
   - Technologies: Spring Security, OAuth2, JJWT

3. **api-gateway** (Port 8080)
   - Centralized routing
   - Rate limiting
   - CORS handling
   - Circuit breaker
   - Technologies: Spring Cloud Gateway

4. **learning-visualizer** (Port 8082)
   - 3D model generation
   - Visualization rendering
   - Export functionality (PNG, SVG, STL)

5. **collaboration-service** (Port 8084)
   - WebSocket connections
   - Real-time collaboration
   - Session management

### Python Services

1. **ai-model** (Port 8000)
   - PyTorch neural network
   - Learning profile predictions
   - Personalized recommendations
   - Technologies: FastAPI, PyTorch, NumPy

2. **llm-service** (Port 8085)
   - Natural language queries
   - MBTI-tailored responses
   - Troubleshooting assistance
   - Technologies: FastAPI, Hugging Face Transformers, xAI

### Frontend (React)

- **Framework**: React 18 with Vite
- **3D Rendering**: Three.js via @react-three/fiber
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO
- **Charts**: Recharts, Plotly.js

### Databases

1. **PostgreSQL**
   - User data
   - Genomic variants
   - Educational assessments
   - Learning profiles
   - Collaboration sessions

2. **Redis**
   - Session caching
   - Rate limiting
   - LLM response caching

### Infrastructure

1. **Docker Compose**
   - Local development
   - Service orchestration
   - Networking

2. **Kubernetes**
   - Production deployment
   - Auto-scaling (HPA)
   - Load balancing
   - Health checks

3. **NGINX**
   - Reverse proxy
   - SSL termination
   - Static file serving
   - Rate limiting

4. **CI/CD**
   - GitHub Actions
   - Automated testing
   - Security scanning (OWASP ZAP, Trivy)
   - License compliance checking

## User Roles

- **USER**: Standard access to learning features
- **MODERATOR**: Content moderation, session management
- **ADMIN**: Full system access, user management

## MBTI Support

All 16 MBTI types with personalized:
- UI elements
- LLM response tone
- Collaboration features
- Visualization styles

Types: ENTJ, INFP, INFJ, ESTP, INTJ, INTP, ISTJ, ESFJ, ISFP, ENTP, ISFJ, ESFP, ENFJ, ESTJ, ISTP, ENFP

## Security Features

- TLS encryption (in transit)
- AES-256 encryption (at rest)
- JWT authentication
- SSO support (Google, Okta, Azure, Auth0)
- MFA (TOTP)
- Rate limiting
- CORS/CSRF protection
- Input validation and sanitization
- OWASP compliance

## Testing

- **Unit tests**: JUnit (Java), pytest (Python), Jest (React)
- **Integration tests**: Postman collections
- **E2E tests**: Playwright
- **Coverage target**: >90% (backend), >80% (frontend)

## License

Dual license:
- **Non-profit**: Free (MIT-style)
- **Commercial**: 6% gross income royalty

Contact: Sekacorn@gmail.com
Jurisdiction: United States

---

For detailed setup instructions, see QUICKSTART.md
For contribution guidelines, see CONTRIBUTING.md
