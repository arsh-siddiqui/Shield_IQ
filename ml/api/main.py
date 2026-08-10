"""
main.py — FastAPI ML inference service for ShieldIQ.

Exposes:
  POST /predict  — classify text as phishing or safe
  GET  /health   — health check + model status

Security:
  - Input is validated (non-empty, max 10,000 chars)
  - Submitted text is NEVER executed
  - Submitted text is NEVER stored (only the in-memory clean vector is kept)
  - No API keys are exposed
  - Stack traces are suppressed in error responses

Usage:
  python -m uvicorn ml.api.main:app --host 0.0.0.0 --port 8001
  # or from project root:
  python -m uvicorn ml.api.main:app --port 8001
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import logging

from .schemas import PredictRequest, PredictResponse, HealthResponse, ModelInfo
from .predictor import get_predictor, is_model_loaded, _load_error

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shieldiq-ml")

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ShieldIQ ML Inference Service",
    description="Phishing text classifier — TF-IDF + Logistic Regression",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health():
    """Health check — returns model status."""
    loaded = is_model_loaded()
    if loaded:
        predictor = get_predictor()
        return HealthResponse(
            status="ok",
            modelLoaded=True,
            modelVersion=predictor.version,
        )
    else:
        return HealthResponse(
            status="degraded",
            modelLoaded=False,
            error="Model artifacts not found. Run 'python ml/train.py' first.",
        )


@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(request: PredictRequest):
    """
    Classify text as phishing or safe.

    SECURITY NOTE: The submitted text is treated as untrusted data.
    It is vectorised and classified — never executed, never stored.
    """
    if not is_model_loaded():
        raise HTTPException(
            status_code=503,
            detail="ML model is not loaded. Run 'python ml/train.py' to generate artifacts.",
        )

    try:
        predictor = get_predictor()
        result = predictor.predict(request.text)

        return PredictResponse(
            label=result["label"],
            probability=result["probability"],
            model=ModelInfo(
                name=result["model"]["name"],
                version=result["model"]["version"],
            ),
        )
    except Exception as e:
        logger.error(f"Prediction error: {type(e).__name__}: {e}")
        # Don't expose internal error details to the caller
        raise HTTPException(status_code=500, detail="Prediction failed. Please try again.")


# ---------------------------------------------------------------------------
# Global exception handler — suppress stack traces in responses
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {type(exc).__name__}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
    )


# ---------------------------------------------------------------------------
# Startup log
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    if is_model_loaded():
        predictor = get_predictor()
        logger.info(
            f"[shieldiq-ml] Model loaded: {predictor.metadata.get('modelName')} "
            f"v{predictor.version} | "
            f"Accuracy={predictor.metadata.get('accuracy')} | "
            f"F1={predictor.metadata.get('f1')}"
        )
    else:
        logger.warning(
            f"[shieldiq-ml] Model NOT loaded: {_load_error}. "
            "Run 'python ml/train.py' to generate artifacts."
        )
