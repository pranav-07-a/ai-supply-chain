from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from predict import predict_risk


# =========================================================
# CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="SupplyIQ AI Risk API",
    description="AI Supply Chain Risk Intelligence API",
    version="1.0.0"
)


# =========================================================
# ENABLE FRONTEND CONNECTION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# HOME ENDPOINT
# =========================================================

@app.get("/")
def home():
    return {
        "message": "SupplyIQ AI Risk API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# RISK PREDICTION ENDPOINT
# =========================================================

@app.post("/predict")
def predict(data: dict):

    try:
        result = predict_risk(data)
        return result

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )