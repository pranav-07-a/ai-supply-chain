import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error


# =========================================================
# 1. CREATE DEMO SUPPLY-CHAIN TRAINING DATA
# =========================================================

np.random.seed(42)

number_of_samples = 2000

supplier_reliability = np.random.uniform(
    40, 100, number_of_samples
)

lead_time = np.random.uniform(
    2, 25, number_of_samples
)

inventory_days = np.random.uniform(
    1, 30, number_of_samples
)

demand_growth = np.random.uniform(
    -5, 40, number_of_samples
)

transport_delay = np.random.uniform(
    0, 10, number_of_samples
)

forecast_error = np.random.uniform(
    0, 20, number_of_samples
)

quality_score = np.random.uniform(
    60, 100, number_of_samples
)

external_risk = np.random.uniform(
    0, 100, number_of_samples
)

single_source_dependency = np.random.randint(
    0, 2, number_of_samples
)


# =========================================================
# 2. CALCULATE TRAINING RISK SCORE
# =========================================================

supplier_risk = 100 - supplier_reliability

inventory_risk = np.clip(
    100 - (inventory_days * 3.5),
    0,
    100
)

demand_risk = np.clip(
    demand_growth * 2.5,
    0,
    100
)

transport_risk = np.clip(
    transport_delay * 10,
    0,
    100
)

forecast_risk = np.clip(
    forecast_error * 4,
    0,
    100
)

quality_risk = 100 - quality_score

single_source_risk = (
    single_source_dependency * 20
)


risk_score = (
    supplier_risk * 0.20
    + inventory_risk * 0.18
    + demand_risk * 0.14
    + transport_risk * 0.14
    + forecast_risk * 0.08
    + quality_risk * 0.08
    + external_risk * 0.13
    + single_source_risk * 0.05
)

risk_score = np.clip(
    risk_score,
    0,
    100
)


# =========================================================
# 3. CREATE DATAFRAME
# =========================================================

data = pd.DataFrame({

    "supplier_reliability":
        supplier_reliability,

    "lead_time":
        lead_time,

    "inventory_days":
        inventory_days,

    "demand_growth":
        demand_growth,

    "transport_delay":
        transport_delay,

    "forecast_error":
        forecast_error,

    "quality_score":
        quality_score,

    "external_risk":
        external_risk,

    "single_source_dependency":
        single_source_dependency,

    "risk_score":
        risk_score
})


# =========================================================
# 4. SELECT FEATURES
# =========================================================

features = [

    "supplier_reliability",

    "lead_time",

    "inventory_days",

    "demand_growth",

    "transport_delay",

    "forecast_error",

    "quality_score",

    "external_risk",

    "single_source_dependency"

]


X = data[features]

y = data["risk_score"]


# =========================================================
# 5. SPLIT DATA
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42
)


# =========================================================
# 6. CREATE RANDOM FOREST MODEL
# =========================================================

model = RandomForestRegressor(

    n_estimators=200,

    max_depth=12,

    random_state=42,

    n_jobs=-1
)


# =========================================================
# 7. TRAIN MODEL
# =========================================================

print("")
print("==========================================")
print("   SUPPLYIQ ML MODEL TRAINING")
print("==========================================")

print("")
print("Training Random Forest model...")

model.fit(
    X_train,
    y_train
)


# =========================================================
# 8. TEST MODEL
# =========================================================

predictions = model.predict(
    X_test
)

mae = mean_absolute_error(
    y_test,
    predictions
)

print("")
print(
    f"Mean Absolute Error: {mae:.2f}"
)


# =========================================================
# 9. FEATURE IMPORTANCE
# =========================================================

importance = pd.DataFrame({

    "feature":
        features,

    "importance":
        model.feature_importances_

})

importance = importance.sort_values(

    by="importance",

    ascending=False

)


print("")
print("Feature Importance")
print("------------------------------------------")

for _, row in importance.iterrows():

    print(
        f"{row['feature']:<30} "
        f"{row['importance']:.4f}"
    )


# =========================================================
# 10. SAVE TRAINED MODEL
# =========================================================

model_package = {

    "model": model,

    "features": features

}


joblib.dump(

    model_package,

    "model.pkl"

)


# =========================================================
# 11. COMPLETION MESSAGE
# =========================================================

print("")
print("==========================================")
print("Model saved successfully as model.pkl")
print("Training completed successfully!")
print("==========================================")
print("")