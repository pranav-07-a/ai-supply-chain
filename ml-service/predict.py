import joblib
import pandas as pd


# =========================================================
# LOAD TRAINED MODEL
# =========================================================

model_data = joblib.load("model.pkl")

model = model_data["model"]
features = model_data["features"]


# =========================================================
# CONVERT RISK SCORE INTO RISK LEVEL
# =========================================================

def get_risk_level(score: float) -> str:

    if score >= 85:
        return "Critical"

    elif score >= 70:
        return "High"

    elif score >= 50:
        return "Medium"

    else:
        return "Low"


# =========================================================
# PREDICT SUPPLY-CHAIN RISK
# =========================================================

def predict_risk(input_data: dict):

    # Check that all required inputs exist
    for feature in features:

        if feature not in input_data:

            raise ValueError(
                f"Missing required feature: {feature}"
            )

    # Create one-row DataFrame
    dataframe = pd.DataFrame(
        [{
            feature: input_data[feature]
            for feature in features
        }],
        columns=features
    )

    # Run the Random Forest model
    prediction = model.predict(dataframe)[0]

    # Keep result between 0 and 100
    risk_score = max(
        0,
        min(
            100,
            float(prediction)
        )
    )

    # Convert score to category
    risk_level = get_risk_level(
        risk_score
    )

    return {
        "risk_score": round(
            risk_score,
            2
        ),

        "risk_level": risk_level
    }