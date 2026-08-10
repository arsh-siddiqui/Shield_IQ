"""
schemas.py — Pydantic request/response schemas for the ML inference API.

Input validation enforced at the API boundary:
  - text must be a non-empty string
  - text length capped at 10,000 characters
  - text content is never executed or stored
"""

from pydantic import BaseModel, Field, field_validator


class PredictRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The message text to classify. Must not be empty.",
    )

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("text must not be blank or whitespace only")
        return v


class ModelInfo(BaseModel):
    name: str
    version: str


class PredictResponse(BaseModel):
    label: str = Field(..., description="'phishing' or 'safe'")
    probability: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Probability that the text is phishing (0.0–1.0)",
    )
    model: ModelInfo


class HealthResponse(BaseModel):
    status: str
    modelLoaded: bool
    modelVersion: str | None = None
    error: str | None = None
