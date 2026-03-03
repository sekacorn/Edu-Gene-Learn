"""
EduGeneLearn AI Model Service

This service provides AI-driven learning recommendations based on:
- Genomic data (cognitive traits)
- Educational assessments (learning styles)
- Environmental factors (socio-economic context)

Author: sekacorn
Version: 1.0.0
"""

import os
import logging
from typing import List, Dict, Any
from contextlib import asynccontextmanager

import torch
import torch.nn as nn
import numpy as np
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Model configuration
MODEL_PATH = os.getenv('MODEL_PATH', './model.pt')
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Global model variable
model = None


class LearningProfileInput(BaseModel):
    """Input schema for learning profile prediction."""

    # Genomic features (normalized 0-1)
    memory_gene_score: float = Field(ge=0.0, le=1.0, description="Genetic memory score")
    attention_gene_score: float = Field(ge=0.0, le=1.0, description="Genetic attention score")
    processing_speed_score: float = Field(ge=0.0, le=1.0, description="Genetic processing speed")

    # Educational features
    current_visual_score: float = Field(ge=0.0, le=100.0, description="Current visual learning score")
    current_auditory_score: float = Field(ge=0.0, le=100.0, description="Current auditory learning score")
    current_kinesthetic_score: float = Field(ge=0.0, le=100.0, description="Current kinesthetic score")

    # Environmental features
    tech_access_score: float = Field(ge=0.0, le=1.0, description="Technology access score")
    study_env_quality: float = Field(ge=0.0, le=1.0, description="Study environment quality")
    internet_quality: float = Field(ge=0.0, le=1.0, description="Internet quality score")

    # MBTI influence (optional)
    mbti_type: str = Field(default="", description="MBTI personality type")


class LearningRecommendation(BaseModel):
    """Output schema for learning recommendations."""

    recommended_visual_emphasis: float = Field(description="Recommended visual learning emphasis (0-100)")
    recommended_auditory_emphasis: float = Field(description="Recommended auditory emphasis (0-100)")
    recommended_kinesthetic_emphasis: float = Field(description="Recommended kinesthetic emphasis (0-100)")
    optimal_session_duration_minutes: int = Field(description="Optimal study session duration")
    preferred_study_time: str = Field(description="Recommended study time (morning/afternoon/evening/night)")
    strategies: List[str] = Field(description="Personalized learning strategies")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Prediction confidence")


class LearningPredictorModel(nn.Module):
    """
    Neural network model for learning recommendations.

    Architecture:
    - Input: 9 features (genomic + educational + environmental)
    - Hidden layers: 64, 32 neurons with ReLU activation
    - Output: 6 predictions (learning style scores + session duration)
    """

    def __init__(self, input_size=9, hidden_size=64, output_size=6):
        super(LearningPredictorModel, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.2)

        self.fc2 = nn.Linear(hidden_size, 32)
        self.relu2 = nn.ReLU()
        self.dropout2 = nn.Dropout(0.2)

        self.fc3 = nn.Linear(32, output_size)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu1(x)
        x = self.dropout1(x)

        x = self.fc2(x)
        x = self.relu2(x)
        x = self.dropout2(x)

        x = self.fc3(x)
        # Apply sigmoid to keep outputs in 0-1 range
        x = self.sigmoid(x)
        return x


def load_model():
    """Load the pretrained learning predictor model."""
    global model

    try:
        model = LearningPredictorModel()

        # Check if pretrained model exists
        if os.path.exists(MODEL_PATH):
            logger.info(f"Loading pretrained model from {MODEL_PATH}")
            model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
        else:
            logger.warning(f"No pretrained model found at {MODEL_PATH}. Using untrained model.")
            # In production, you would train this model on real data
            # For now, we initialize with random weights

        model.to(DEVICE)
        model.eval()
        logger.info(f"Model loaded successfully on {DEVICE}")

    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise


def unload_model():
    """Unload model to free memory."""
    global model
    model = None
    logger.info("Model unloaded")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("Starting AI Model Service...")
    load_model()
    yield
    # Shutdown
    logger.info("Shutting down AI Model Service...")
    unload_model()


# Create FastAPI app
app = FastAPI(
    title="EduGeneLearn AI Model Service",
    description="AI-driven learning recommendations based on genomic, educational, and environmental data",
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


def preprocess_input(profile: LearningProfileInput) -> torch.Tensor:
    """
    Preprocess input features for the model.

    Returns:
        torch.Tensor: Preprocessed feature tensor
    """
    features = [
        profile.memory_gene_score,
        profile.attention_gene_score,
        profile.processing_speed_score,
        profile.current_visual_score / 100.0,  # Normalize to 0-1
        profile.current_auditory_score / 100.0,
        profile.current_kinesthetic_score / 100.0,
        profile.tech_access_score,
        profile.study_env_quality,
        profile.internet_quality
    ]

    return torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(DEVICE)


def generate_strategies(profile: LearningProfileInput, predictions: np.ndarray) -> List[str]:
    """
    Generate personalized learning strategies based on predictions.

    Args:
        profile: Input learning profile
        predictions: Model predictions

    Returns:
        List of personalized strategy recommendations
    """
    strategies = []

    visual_emphasis = predictions[0] * 100
    auditory_emphasis = predictions[1] * 100
    kinesthetic_emphasis = predictions[2] * 100

    # Strategy based on dominant learning style
    if visual_emphasis > auditory_emphasis and visual_emphasis > kinesthetic_emphasis:
        strategies.append("Use visual aids: diagrams, charts, and color-coded notes")
        strategies.append("Watch educational videos and create mind maps")

    if auditory_emphasis > visual_emphasis and auditory_emphasis > kinesthetic_emphasis:
        strategies.append("Listen to educational podcasts and recorded lectures")
        strategies.append("Discuss concepts with study groups or teach others")

    if kinesthetic_emphasis > visual_emphasis and kinesthetic_emphasis > auditory_emphasis:
        strategies.append("Use hands-on activities and practical experiments")
        strategies.append("Take frequent breaks and incorporate physical movement")

    # Strategy based on genomic scores
    if profile.memory_gene_score > 0.7:
        strategies.append("Your genetic profile suggests strong memory - use spaced repetition techniques")
    elif profile.memory_gene_score < 0.4:
        strategies.append("Use mnemonic devices and memory aids to enhance retention")

    if profile.attention_gene_score > 0.7:
        strategies.append("Your focus ability is strong - tackle complex topics in long study sessions")
    elif profile.attention_gene_score < 0.4:
        strategies.append("Use the Pomodoro technique: 25-minute focused sessions with breaks")

    # Strategy based on environmental factors
    if profile.tech_access_score < 0.5:
        strategies.append("Focus on offline resources and printed materials")
    else:
        strategies.append("Leverage online learning platforms and interactive tools")

    return strategies


@app.post("/api/v1/predictions/learning-profile", response_model=LearningRecommendation)
async def predict_learning_profile(profile: LearningProfileInput):
    """
    Predict optimal learning recommendations based on user profile.

    This endpoint uses AI to analyze genomic data, educational assessments,
    and environmental factors to provide personalized learning strategies.
    """
    try:
        logger.info(f"Received prediction request for MBTI type: {profile.mbti_type}")

        # Preprocess input
        input_tensor = preprocess_input(profile)

        # Make prediction
        with torch.no_grad():
            predictions = model(input_tensor)
            predictions = predictions.cpu().numpy()[0]

        # Calculate confidence (based on prediction variance)
        confidence = 1.0 - float(np.std(predictions))
        confidence = max(0.5, min(1.0, confidence))  # Clamp between 0.5 and 1.0

        # Determine optimal study time based on processing speed and attention
        time_score = (profile.processing_speed_score + profile.attention_gene_score) / 2
        if time_score > 0.7:
            study_time = "morning"
        elif time_score > 0.5:
            study_time = "afternoon"
        elif time_score > 0.3:
            study_time = "evening"
        else:
            study_time = "night"

        # Calculate optimal session duration (30-120 minutes)
        base_duration = 60
        attention_factor = profile.attention_gene_score
        session_duration = int(base_duration * (0.5 + attention_factor))
        session_duration = max(30, min(120, session_duration))

        # Generate personalized strategies
        strategies = generate_strategies(profile, predictions)

        return LearningRecommendation(
            recommended_visual_emphasis=float(predictions[0] * 100),
            recommended_auditory_emphasis=float(predictions[1] * 100),
            recommended_kinesthetic_emphasis=float(predictions[2] * 100),
            optimal_session_duration_minutes=session_duration,
            preferred_study_time=study_time,
            strategies=strategies,
            confidence_score=confidence
        )

    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Model Service",
        "model_loaded": model is not None,
        "device": str(DEVICE)
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "EduGeneLearn AI Model Service",
        "version": "1.0.0",
        "description": "AI-driven learning recommendations"
    }


if __name__ == "__main__":
    uvicorn.run(
        "learning_predictor:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
