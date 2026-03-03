# Running EduGeneLearn with Podman

This guide explains how to run EduGeneLearn using Podman instead of Docker.

## Prerequisites

- **Podman** installed on your system
- **Podman Compose** (optional, for multi-container setup)
- **Node.js 18+** (for frontend development)
- **Java 17+** (for backend development)
- **Python 3.10+** (for AI services)

## Podman vs Docker

Podman is a daemonless container engine that's compatible with Docker commands. Most Docker commands work with Podman by simply replacing `docker` with `podman`.

## Quick Start with Podman

### Option 1: Using Podman Compose (Recommended)

If you have `podman-compose` installed:

```bash
# Navigate to project directory
cd Edu-Gene-Learn

# Start all services
podman-compose up --build
```

### Option 2: Using Podman with Docker Compose

Podman can work with `docker-compose` by creating an alias:

```bash
# Create alias (Linux/Mac)
alias docker=podman
alias docker-compose=podman-compose

# Or for this session only
docker-compose up --build
```

### Option 3: Manual Container Management

Run containers individually with Podman:

#### 1. Create a Pod (similar to Docker network)

```bash
podman pod create --name edugenelearn-pod -p 3000:3000 -p 8080:8080 -p 5432:5432 -p 6379:6379
```

#### 2. Start PostgreSQL

```bash
podman run -d \
  --pod edugenelearn-pod \
  --name postgres \
  -e POSTGRES_DB=edugenelearn \
  -e POSTGRES_USER=edugene \
  -e POSTGRES_PASSWORD=changeme \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### 3. Start Redis

```bash
podman run -d \
  --pod edugenelearn-pod \
  --name redis \
  redis:7-alpine
```

#### 4. Build and Run Backend Services

```bash
# API Gateway
cd backend/api-gateway
podman build -t edugenelearn-api-gateway .
podman run -d \
  --pod edugenelearn-pod \
  --name api-gateway \
  -e SPRING_PROFILES_ACTIVE=podman \
  -e POSTGRES_HOST=localhost \
  -e REDIS_HOST=localhost \
  edugenelearn-api-gateway

# Learning Integrator
cd ../learning-integrator
podman build -t edugenelearn-learning-integrator .
podman run -d \
  --pod edugenelearn-pod \
  --name learning-integrator \
  -e SPRING_PROFILES_ACTIVE=podman \
  -e POSTGRES_HOST=localhost \
  -e REDIS_HOST=localhost \
  edugenelearn-learning-integrator

# User Session
cd ../user-session
podman build -t edugenelearn-user-session .
podman run -d \
  --pod edugenelearn-pod \
  --name user-session \
  -e SPRING_PROFILES_ACTIVE=podman \
  -e POSTGRES_HOST=localhost \
  -e REDIS_HOST=localhost \
  edugenelearn-user-session
```

#### 5. Build and Run Python Services

```bash
# AI Model
cd ../../ai-model
podman build -t edugenelearn-ai-model .
podman run -d \
  --pod edugenelearn-pod \
  --name ai-model \
  -e POSTGRES_HOST=localhost \
  -e REDIS_HOST=localhost \
  edugenelearn-ai-model

# LLM Service
cd ../backend/llm-service
podman build -t edugenelearn-llm-service .
podman run -d \
  --pod edugenelearn-pod \
  --name llm-service \
  -e REDIS_HOST=localhost \
  -e LLM_PROVIDER=huggingface \
  edugenelearn-llm-service
```

#### 6. Build and Run Frontend

```bash
cd ../../frontend
podman build -t edugenelearn-frontend .
podman run -d \
  --pod edugenelearn-pod \
  --name frontend \
  edugenelearn-frontend
```

### Option 4: Local Development (No Containers)

For active development, run services directly without containers:

#### 1. Start PostgreSQL and Redis

```bash
# PostgreSQL (system installation or container)
podman run -d -p 5432:5432 \
  -e POSTGRES_DB=edugenelearn \
  -e POSTGRES_USER=edugene \
  -e POSTGRES_PASSWORD=changeme \
  postgres:15-alpine

# Redis
podman run -d -p 6379:6379 redis:7-alpine
```

#### 2. Run Backend Services

```bash
# Terminal 1 - API Gateway
cd backend/api-gateway
./mvnw spring-boot:run

# Terminal 2 - Learning Integrator
cd backend/learning-integrator
./mvnw spring-boot:run

# Terminal 3 - User Session
cd backend/user-session
./mvnw spring-boot:run
```

#### 3. Run Python Services

```bash
# Terminal 4 - AI Model
cd ai-model
pip install -r requirements.txt
uvicorn learning_predictor:app --reload --port 8000

# Terminal 5 - LLM Service
cd backend/llm-service
pip install -r requirements.txt
uvicorn llm_service:app --reload --port 8085
```

#### 4. Run Frontend

```bash
# Terminal 6 - Frontend
cd frontend
npm install
npm run dev
```

## Managing Podman Containers

### View Running Containers

```bash
podman ps
```

### View All Containers (including stopped)

```bash
podman ps -a
```

### Stop All Containers

```bash
podman stop $(podman ps -aq)
```

### Remove All Containers

```bash
podman rm $(podman ps -aq)
```

### View Logs

```bash
# View logs for specific container
podman logs frontend
podman logs postgres

# Follow logs
podman logs -f api-gateway
```

### Stop and Remove Pod

```bash
podman pod stop edugenelearn-pod
podman pod rm edugenelearn-pod
```

## Accessing the Application

Once services are running:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Troubleshooting Podman

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :3000
# or
netstat -an | grep 3000

# Kill the process
kill -9 <PID>
```

### Permission Denied

Podman runs rootless by default. If you encounter permission issues:

```bash
# Run in rootless mode (default)
podman run --user $(id -u):$(id -g) ...

# Or use sudo (not recommended)
sudo podman run ...
```

### SELinux Issues (Linux)

If you're on Linux with SELinux:

```bash
# Add :Z to volumes for proper labeling
podman run -v ./data:/data:Z ...
```

### Container Won't Start

```bash
# Check logs
podman logs <container-name>

# Inspect container
podman inspect <container-name>

# Remove and rebuild
podman rm <container-name>
podman rmi <image-name>
podman build -t <image-name> .
```

## Performance Tips

1. **Use Pods**: Group related containers in a pod for better networking
2. **Volume Management**: Use named volumes instead of bind mounts when possible
3. **Resource Limits**: Set memory and CPU limits for containers
4. **Cleanup**: Regularly remove unused containers, images, and volumes

```bash
# Remove unused images
podman image prune

# Remove unused volumes
podman volume prune

# System cleanup
podman system prune -a
```

## Differences from Docker

1. **Rootless by default**: Podman doesn't require root privileges
2. **No daemon**: Podman doesn't run a background service
3. **Pod concept**: Podman has native pod support (like Kubernetes)
4. **Systemd integration**: Better integration with systemd for service management

## Converting Docker Commands to Podman

| Docker Command | Podman Equivalent |
|----------------|-------------------|
| `docker run` | `podman run` |
| `docker build` | `podman build` |
| `docker ps` | `podman ps` |
| `docker images` | `podman images` |
| `docker-compose` | `podman-compose` |
| `docker network` | `podman network` |
| `docker volume` | `podman volume` |

## Next Steps

After starting the application:
1. Access http://localhost:3000
2. Create an account or login with admin/Admin123!
3. Upload genomic data (VCF, CSV, or JSON)
4. Get personalized learning recommendations

## Support

For Podman-specific issues: https://podman.io/getting-started/
For EduGeneLearn issues: Sekacorn@gmail.com
