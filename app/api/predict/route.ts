import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      supplier_reliability = 61,
      lead_time = 14,
      inventory_days = 7,
      demand_growth = 28,
      transport_delay = 5,
      forecast_error = 11,
      quality_score = 78,
      external_risk = 70,
      single_source_dependency = 1,
    } = body;

    // Optional: If an external Python ML FastAPI microservice is deployed and configured
    const externalMlUrl = process.env.ML_SERVICE_URL;
    if (externalMlUrl) {
      try {
        const extRes = await fetch(`${externalMlUrl.replace(/\/$/, "")}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (extRes.ok) {
          const data = await extRes.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.warn("External ML service unavailable, using built-in risk engine:", err);
      }
    }

    // Built-in SupplyIQ Risk Prediction Engine (matches the Random Forest training ground truth)
    const supplier_risk = 100 - Number(supplier_reliability);
    const inventory_risk = Math.max(0, Math.min(100, 100 - Number(inventory_days) * 3.5));
    const demand_risk = Math.max(0, Math.min(100, Number(demand_growth) * 2.5));
    const transport_risk = Math.max(0, Math.min(100, Number(transport_delay) * 10));
    const forecast_risk = Math.max(0, Math.min(100, Number(forecast_error) * 4));
    const quality_risk = 100 - Number(quality_score);
    const single_source_risk = Number(single_source_dependency) * 20;

    const raw_score =
      supplier_risk * 0.20 +
      inventory_risk * 0.18 +
      demand_risk * 0.14 +
      transport_risk * 0.14 +
      forecast_risk * 0.08 +
      quality_risk * 0.08 +
      Number(external_risk) * 0.13 +
      single_source_risk * 0.05;

    const risk_score = Math.max(0, Math.min(100, Number(raw_score.toFixed(2))));

    let risk_level = "Low";
    if (risk_score >= 85) {
      risk_level = "Critical";
    } else if (risk_score >= 70) {
      risk_level = "High";
    } else if (risk_score >= 50) {
      risk_level = "Medium";
    }

    return NextResponse.json({
      risk_score,
      risk_level,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Prediction failed" },
      { status: 400 }
    );
  }
}
