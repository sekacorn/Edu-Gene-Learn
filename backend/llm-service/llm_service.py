"""
EduGeneLearn LLM Service

This service provides natural language query capabilities for:
- Genomic data interpretation
- Learning recommendations
- Troubleshooting assistance

Supports:
- Hugging Face Transformers (local models)
- xAI API (cloud-based)

Author: sekacorn
Version: 1.0.0
"""

import os
import logging
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from redis import Redis
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'huggingface')  # huggingface or xai
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', '')
XAI_API_KEY = os.getenv('XAI_API_KEY', '')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', '6379'))

# Redis client for caching
redis_client = None

class QueryRequest(BaseModel):
    """Request schema for LLM queries."""

    query: str = Field(..., description="User's natural language query")
    context: Optional[Dict[str, Any]] = Field(default={}, description="Additional context")
    user_id: Optional[str] = Field(default=None, description="User ID for context")


class QueryResponse(BaseModel):
    """Response schema for LLM queries."""

    response: str = Field(..., description="LLM-generated response")
    model_used: str = Field(..., description="Model used for generation")
    cached: bool = Field(default=False, description="Whether response was cached")


class TroubleshootRequest(BaseModel):
    """Request schema for troubleshooting assistance."""

    error_type: str = Field(..., description="Type of error encountered")
    error_message: str = Field(..., description="Error message")
    user_context: Optional[Dict[str, Any]] = Field(default={}, description="User context")


class LLMService:
    """LLM service handler supporting multiple providers."""

    def __init__(self, provider: str = 'huggingface'):
        self.provider = provider
        self.model = None

        if provider == 'huggingface':
            self._init_huggingface()
        elif provider == 'xai':
            self._init_xai()
        else:
            logger.warning(f"Unknown provider: {provider}. Using mock mode.")

    def _init_huggingface(self):
        """Initialize Hugging Face model."""
        try:
            # For production, you would load a specific model
            # For now, we'll use a lightweight model or mock implementation
            logger.info("Initializing Hugging Face LLM...")

            # Example: Load a small model for demonstration
            # from transformers import pipeline
            # self.model = pipeline("text-generation", model="microsoft/DialoGPT-small")

            # Mock implementation for demonstration
            self.model = "huggingface-mock"
            logger.info("Hugging Face LLM initialized (mock mode)")

        except Exception as e:
            logger.error(f"Error initializing Hugging Face: {e}")
            self.model = None

    def _init_xai(self):
        """Initialize xAI API client."""
        try:
            if not XAI_API_KEY:
                logger.warning("No xAI API key provided")
                return

            logger.info("Initializing xAI LLM...")
            # xAI API client would be initialized here
            self.model = "xai-mock"
            logger.info("xAI LLM initialized (mock mode)")

        except Exception as e:
            logger.error(f"Error initializing xAI: {e}")
            self.model = None

    def generate_response(self, query: str, context: Optional[Dict] = None) -> str:
        """
        Generate LLM response for a query.

        Args:
            query: User's natural language query
            context: Additional context

        Returns:
            Generated response string
        """
        try:
            self._build_prompt(query, context)

            # In production, this would call the actual LLM
            # For demonstration, we generate a mock response
            response = self._generate_mock_response(query, context)

            return response

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your query. Please try again."

    def _build_prompt(self, query: str, context: Optional[Dict]) -> str:
        """Build LLM prompt."""
        prompt_parts = []

        # Add context if available
        if context:
            prompt_parts.append(f"Context: {json.dumps(context)}")

        # Add the actual query
        prompt_parts.append(f"Query: {query}")

        return "\n".join(prompt_parts)

    def _generate_mock_response(self, query: str, context: Optional[Dict]) -> str:
        """Generate a mock response for demonstration."""

        # Analyze query type
        query_lower = query.lower()

        # VCF/Data upload queries
        if 'vcf' in query_lower or 'upload' in query_lower or 'import' in query_lower:
            base_response = (
                "To import your genomic data (VCF file from 23andMe or AncestryDNA), "
                "go to the Data Upload page and select your VCF file. "
                "The system supports VCF, CSV, and JSON formats. "
                "After upload, the data will be processed and integrated with your learning profile."
            )

        # Learning recommendations
        elif 'learn' in query_lower or 'study' in query_lower or 'recommend' in query_lower:
            base_response = (
                "Based on your genomic profile and learning assessments, "
                "I recommend focusing on your strongest learning modality. "
                "The AI model will analyze your cognitive traits (memory, attention, processing speed) "
                "to provide personalized study strategies. "
                "Check your Learning Dashboard for detailed recommendations."
            )

        # Visualization queries
        elif 'visual' in query_lower or '3d' in query_lower or 'view' in query_lower:
            base_response = (
                "You can view 3D visualizations of your genomic data and learning traits "
                "in the Explore section. The interactive 3D viewer lets you zoom, pan, and rotate "
                "to examine gene loci linked to cognitive traits. "
                "You can also export visualizations as PNG, SVG, or STL for 3D printing."
            )

        # Troubleshooting
        elif 'error' in query_lower or 'fail' in query_lower or 'problem' in query_lower:
            base_response = (
                "If you're experiencing issues, please check: "
                "1) Your file format is supported (VCF, CSV, JSON), "
                "2) File size is under 100MB, "
                "3) Your internet connection is stable. "
                "For persistent issues, contact support at Sekacorn@gmail.com."
            )

        # Default response
        else:
            base_response = (
                "I'm here to help you with EduGeneLearn! "
                "You can ask me about uploading genomic data, viewing learning recommendations, "
                "exploring 3D visualizations, or troubleshooting issues. "
                "What would you like to know more about?"
            )

        return base_response


# Global LLM service instance
llm_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown."""
    global llm_service, redis_client

    # Startup
    logger.info("Starting LLM Service...")

    # Initialize Redis
    try:
        redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        redis_client.ping()
        logger.info("Redis connected")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}. Caching disabled.")
        redis_client = None

    # Initialize LLM
    llm_service = LLMService(provider=LLM_PROVIDER)

    yield

    # Shutdown
    logger.info("Shutting down LLM Service...")
    if redis_client:
        redis_client.close()


# Create FastAPI app
app = FastAPI(
    title="EduGeneLearn LLM Service",
    description="Natural language query service",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/v1/llm/query", response_model=QueryResponse)
async def query_llm(request: QueryRequest):
    """
    Process natural language query.
    """
    try:
        # Check cache
        cache_key = f"llm:query:{request.query}"
        cached_response = None

        if redis_client:
            try:
                cached_response = redis_client.get(cache_key)
            except Exception as e:
                logger.warning(f"Cache read error: {e}")

        if cached_response:
            logger.info("Returning cached response")
            return QueryResponse(
                response=cached_response,
                model_used=LLM_PROVIDER,
                cached=True
            )

        # Generate new response
        response_text = llm_service.generate_response(
            query=request.query,
            context=request.context
        )

        # Cache response
        if redis_client:
            try:
                redis_client.setex(cache_key, 3600, response_text)  # Cache for 1 hour
            except Exception as e:
                logger.warning(f"Cache write error: {e}")

        return QueryResponse(
            response=response_text,
            model_used=LLM_PROVIDER,
            cached=False
        )

    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/llm/troubleshoot")
async def troubleshoot(request: TroubleshootRequest):
    """
    Provide troubleshooting assistance for errors.
    """
    try:
        # Build troubleshooting context
        context = {
            "error_type": request.error_type,
            "error_message": request.error_message,
            **request.user_context
        }

        query = f"I'm experiencing a {request.error_type} error: {request.error_message}. How can I fix this?"

        response_text = llm_service.generate_response(
            query=query,
            context=context
        )

        return {
            "analysis": response_text,
            "error_type": request.error_type
        }

    except Exception as e:
        logger.error(f"Error in troubleshooting: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "LLM Service",
        "provider": LLM_PROVIDER,
        "redis_connected": redis_client is not None
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "EduGeneLearn LLM Service",
        "version": "1.0.0",
        "provider": LLM_PROVIDER
    }


if __name__ == "__main__":
    uvicorn.run(
        "llm_service:app",
        host="0.0.0.0",
        port=8085,
        reload=True,
        log_level="info"
    )
