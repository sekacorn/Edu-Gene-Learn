"""
EduGeneLearn LLM Service

This service provides natural language query capabilities for:
- Genomic data interpretation
- Learning recommendations
- Troubleshooting assistance
- MBTI-tailored responses

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

# MBTI-specific prompt templates
MBTI_PROMPTS = {
    'ENTJ': "Provide strategic, goal-oriented advice with actionable steps.",
    'INFP': "Offer creative, value-driven suggestions with a narrative approach.",
    'INFJ': "Give intuitive, empathetic guidance with holistic context.",
    'ESTP': "Deliver concise, action-oriented tips with immediate applicability.",
    'INTJ': "Present analytical, strategic insights with detailed logic.",
    'INTP': "Provide logical, detailed explanations with theoretical depth.",
    'ISTJ': "Offer structured, step-by-step guidance with precision.",
    'ESFJ': "Give supportive, community-focused advice with warm encouragement.",
    'ISFP': "Suggest gentle, sensory-driven ideas with creative freedom.",
    'ENTP': "Present innovative, idea-sparking responses with wit.",
    'ISFJ': "Provide nurturing, practical advice with clear instructions.",
    'ESFP': "Deliver lively, action-oriented tips with enthusiasm.",
    'ENFJ': "Offer inspirational, visionary guidance with motivational tone.",
    'ESTJ': "Give direct, results-driven advice with clear metrics.",
    'ISTP': "Provide practical, hands-on solutions with minimalist approach.",
    'ENFP': "Suggest creative, enthusiastic ideas with exploratory tone."
}


class QueryRequest(BaseModel):
    """Request schema for LLM queries."""

    query: str = Field(..., description="User's natural language query")
    context: Optional[Dict[str, Any]] = Field(default={}, description="Additional context")
    mbti_type: Optional[str] = Field(default=None, description="User's MBTI type for personalized response")
    user_id: Optional[str] = Field(default=None, description="User ID for context")


class QueryResponse(BaseModel):
    """Response schema for LLM queries."""

    response: str = Field(..., description="LLM-generated response")
    model_used: str = Field(..., description="Model used for generation")
    cached: bool = Field(default=False, description="Whether response was cached")
    mbti_tailored: bool = Field(default=False, description="Whether response was tailored for MBTI")


class TroubleshootRequest(BaseModel):
    """Request schema for troubleshooting assistance."""

    error_type: str = Field(..., description="Type of error encountered")
    error_message: str = Field(..., description="Error message")
    user_context: Optional[Dict[str, Any]] = Field(default={}, description="User context")
    mbti_type: Optional[str] = Field(default=None, description="User's MBTI type")


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

    def generate_response(self, query: str, mbti_type: Optional[str] = None,
                         context: Optional[Dict] = None) -> str:
        """
        Generate LLM response for a query.

        Args:
            query: User's natural language query
            mbti_type: User's MBTI type for personalization
            context: Additional context

        Returns:
            Generated response string
        """
        try:
            # Build prompt with MBTI tailoring
            prompt = self._build_prompt(query, mbti_type, context)

            # In production, this would call the actual LLM
            # For demonstration, we generate a mock response
            response = self._generate_mock_response(query, mbti_type, context)

            return response

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your query. Please try again."

    def _build_prompt(self, query: str, mbti_type: Optional[str],
                     context: Optional[Dict]) -> str:
        """Build LLM prompt with MBTI tailoring."""
        prompt_parts = []

        # Add MBTI-specific instruction
        if mbti_type and mbti_type in MBTI_PROMPTS:
            prompt_parts.append(f"Style: {MBTI_PROMPTS[mbti_type]}")

        # Add context if available
        if context:
            prompt_parts.append(f"Context: {json.dumps(context)}")

        # Add the actual query
        prompt_parts.append(f"Query: {query}")

        return "\n".join(prompt_parts)

    def _generate_mock_response(self, query: str, mbti_type: Optional[str],
                               context: Optional[Dict]) -> str:
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

        # Tailor response for MBTI type
        if mbti_type:
            base_response = self._tailor_for_mbti(base_response, mbti_type)

        return base_response

    def _tailor_for_mbti(self, response: str, mbti_type: str) -> str:
        """Tailor response tone and style for MBTI type."""

        mbti_additions = {
            'ENTJ': " Take action on these strategic recommendations to optimize your learning outcomes.",
            'INFP': " I hope these suggestions resonate with your learning journey and values.",
            'INFJ': " These insights are designed to align with your holistic approach to learning.",
            'ESTP': " Try these tips right away for immediate results!",
            'INTJ': " This systematic approach should help you achieve your learning goals efficiently.",
            'INTP': " Feel free to explore these concepts in depth and ask follow-up questions.",
            'ISTJ': " Follow these structured steps for reliable results.",
            'ESFJ': " I'm here to support you every step of the way in your learning journey!",
            'ISFP': " Explore these gentle suggestions at your own pace and see what feels right.",
            'ENTP': " These innovative approaches might spark new ideas for your learning!",
            'ISFJ': " These practical, tried-and-true methods will help you succeed.",
            'ESFP': " Let's make learning fun and engaging with these dynamic strategies!",
            'ENFJ': " Together, we can unlock your full learning potential!",
            'ESTJ': " Here are clear, actionable steps to improve your results.",
            'ISTP': " This hands-on, practical approach should work well for you.",
            'ENFP': " Exciting possibilities await as you explore these creative learning strategies!"
        }

        if mbti_type in mbti_additions:
            response += mbti_additions[mbti_type]

        return response


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
    description="Natural language query service with MBTI-tailored responses",
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
    Process natural language query with optional MBTI personalization.
    """
    try:
        # Check cache
        cache_key = f"llm:query:{request.query}:{request.mbti_type}"
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
                cached=True,
                mbti_tailored=request.mbti_type is not None
            )

        # Generate new response
        response_text = llm_service.generate_response(
            query=request.query,
            mbti_type=request.mbti_type,
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
            cached=False,
            mbti_tailored=request.mbti_type is not None
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
            mbti_type=request.mbti_type,
            context=context
        )

        return {
            "analysis": response_text,
            "error_type": request.error_type,
            "mbti_tailored": request.mbti_type is not None
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
