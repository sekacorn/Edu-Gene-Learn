# EduGeneLearn Quick Start Guide

This guide will help you get EduGeneLearn up and running quickly on your local machine.

## Prerequisites

Ensure you have the following installed:
- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Node.js** (18+) - for frontend development
- **Java** (17+) - for backend development
- **Python** (3.10+) - for AI services
- **Git**

## Quick Start (Docker Compose)

The fastest way to run EduGeneLearn is using Docker Compose:

### 1. Clone the Repository

```bash
git clone https://github.com/sekacorn/Edu-Gene-Learn.git
cd Edu-Gene-Learn
```

### 2. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

**Important**: Edit `.env` and update the following:
- `POSTGRES_PASSWORD` - Set a secure database password
- `JWT_SECRET` - Set a secure JWT secret (minimum 256 bits)
- `HUGGINGFACE_API_KEY` or `XAI_API_KEY` - Add your LLM API key
- For SSO: Configure `GOOGLE_CLIENT_ID`, `OKTA_CLIENT_ID`, etc.

### 3. Start All Services

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- Redis cache
- All backend microservices
- AI model service
- LLM service
- React frontend
- NGINX reverse proxy
- Prometheus & Grafana (monitoring)

### 4. Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Grafana Dashboard**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

### 5. Create Your First Account

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details:
   - Username
   - Email
   - Password (min 8 chars, uppercase, lowercase, digit, special char)
   - MBTI Type (optional, for personalized experience)
4. Verify your email (check logs in development mode)
5. Log in with your credentials

### 6. Upload Genomic Data

1. Go to the Dashboard
2. Click "Upload Genomic Data"
3. Select your VCF file from 23andMe, AncestryDNA, or similar service
4. Upload and wait for processing
5. View your genomic insights and learning recommendations

## Development Mode

For active development, you can run services individually:

### Backend Services

Each backend service can be run independently:

```bash
# Learning Integrator
cd backend/learning-integrator
./mvnw spring-boot:run

# User Session
cd backend/user-session
./mvnw spring-boot:run

# API Gateway
cd backend/api-gateway
./mvnw spring-boot:run
```

### Python Services

```bash
# AI Model Service
cd ai-model
pip install -r requirements.txt
uvicorn learning_predictor:app --reload --port 8000

# LLM Service
cd backend/llm-service
pip install -r requirements.txt
uvicorn llm_service:app --reload --port 8085
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Testing

### Run All Tests

```bash
# Backend Java services
cd backend/learning-integrator
mvn test

# Python services
cd ai-model
pytest

# Frontend
cd frontend
npm test
```

### Run E2E Tests

```bash
cd frontend
npm run test:e2e
```

## Troubleshooting

### Services Won't Start

1. Check Docker is running: `docker ps`
2. Check ports aren't already in use: `netstat -an | grep LISTEN`
3. View service logs: `docker-compose logs [service-name]`

### Database Connection Issues

1. Ensure PostgreSQL is running: `docker-compose ps postgres`
2. Check database credentials in `.env`
3. View PostgreSQL logs: `docker-compose logs postgres`

### Upload Fails

1. Check file format (VCF, CSV, or JSON)
2. Ensure file size is under 100MB
3. Check learning-integrator logs: `docker-compose logs learning-integrator`

### LLM Service Not Responding

1. Verify API key is set in `.env`
2. Check LLM provider (huggingface or xai)
3. View LLM service logs: `docker-compose logs llm-service`

## Next Steps

1. **Explore 3D Visualizations**: Navigate to the Explore page to view genomic data in 3D
2. **Get Learning Recommendations**: Visit the Analyze page for AI-driven learning strategies
3. **Try Natural Language Queries**: Use the chatbot to ask questions about your data
4. **Collaborate**: Create a collaboration session and invite others
5. **Enable MFA**: Secure your account with Multi-Factor Authentication

## Production Deployment

For production deployment to Kubernetes:

```bash
# Apply Kubernetes configurations
kubectl apply -f infra/kubernetes/

# Check deployment status
kubectl get pods -n edugenelearn
kubectl get services -n edugenelearn
```

Refer to README.md for detailed production deployment instructions.

## Getting Help

- **Documentation**: See README.md and CONTRIBUTING.md
- **Issues**: https://github.com/sekacorn/Edu-Gene-Learn/issues
- **Email**: Sekacorn@gmail.com

## License

- **Non-profit use**: Free and open-source
- **Commercial use**: Contact Sekacorn@gmail.com for licensing (6% gross income royalty)

See LICENSE file for full details.

---

**Welcome to EduGeneLearn - Advancing humanity through personalized, genomic-driven education!**
