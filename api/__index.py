from fastapi import FastAPI
import uvicorn
import pickle
import pandas as pd
from pydantic import BaseModel
from typing import List

# Завантаження моделі
with open("models/lbm_expense_forecaster.pkl", "rb") as f:
    model, encoder, scaler = pickle.load(f)

app = FastAPI()

# Формат запиту
class CategoryData(BaseModel):
    month_number: int
    year: int
    category_id: str
    category_name: str
    last_month_spent: float
    rolling_mean: float

class PredictionRequest(BaseModel):
    categories: List[CategoryData]

@app.post("/predict")
def predict_expense(data: PredictionRequest):
    predictions = []

    for category_data in data.categories:
        # Перетворення категорії
        category_encoded = encoder.transform([category_data.category_name])[0]

        # Масштабування
        features = pd.DataFrame([[category_data.month_number, category_data.year, category_data.last_month_spent,
                                  category_data.rolling_mean, category_encoded]],
                                columns=["month_number", "year", "last_month_spent", "rolling_mean", "category_encoded"])
        features[["last_month_spent", "rolling_mean"]] = scaler.transform(features[["last_month_spent", "rolling_mean"]])

        # Прогноз
        prediction = model.predict(features)[0]
        predictions.append({
            "category_id": category_data.category_id,
            "category_name": category_data.category_name,
            "last_month_spent": category_data.last_month_spent,
            "rolling_mean": category_data.rolling_mean,
            "predicted_expense": prediction
        })

    return {"predictions": predictions}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)