from fastapi import FastAPI

from pydantic import BaseModel

import numpy as np
import uvicorn
import lightgbm as lgb
from dotenv import load_dotenv
import os
load_dotenv()

# Load trained model
booster = lgb.Booster(model_file="./models/lgbm_model_percentage_v3.txt")


# Create FastAPI app
app = FastAPI()


# Define the expected input schema


class PredictionInput(BaseModel):
    total_spent: float
    total_spent_in_sheet_last_month: float
    total_spent_in_sheet_last_3_months: float
    average_spent_in_sheet_last_6_months: float
    sheet_spending_trend: float
    total_spent_in_category_last_month: float
    total_spent_in_category_last_3_months: float
    average_spent_in_category_last_6_months: float
    category_spending_trend: float
    category_spent_percentage_last_month: float
    category_spent_percentage_trend: float


@app.post("/predict")
def predict(input: PredictionInput):
    """
    Predict the next month's spending for a category
    """
    print(input)
    # Convert input to a 2D array
    features = np.array([[
        input.total_spent,
        input.total_spent_in_sheet_last_month,
        input.total_spent_in_sheet_last_3_months,
        input.average_spent_in_sheet_last_6_months,
        input.sheet_spending_trend,
        input.total_spent_in_category_last_month,
        input.total_spent_in_category_last_3_months,
        input.average_spent_in_category_last_6_months,
        input.category_spending_trend,
        input.category_spent_percentage_last_month,
        input.category_spent_percentage_trend,
    ]])

    # Make prediction
    prediction_percentage = booster.predict(features)[0]
    prediction = input.total_spent_in_category_last_month * prediction_percentage
    return {"predicted_next_month_spent": round(float(prediction), 2), "predicted_next_month_spent_percentage": round(float(prediction_percentage), 2)}


@app.get("/health")
def health_check():
    return {"status": "ok"}


# Auto-run uvicorn if this script is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0",
                port=int(os.getenv("PORT", 8000)), reload=True)
