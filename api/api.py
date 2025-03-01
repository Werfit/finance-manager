import os
import pandas as pd


from flask import Flask, request
import pickle
from pydantic import BaseModel
from typing import List

# Завантаження моделі
with open("./models/lbm_expense_forecaster.pkl", "rb") as f:
    model, encoder, scaler = pickle.load(f)

app = Flask(__name__)

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

@app.route("/predict", methods=['POST'])
def predict_expense():
    data: PredictionRequest = request.get_json()
    print(data)
    predictions = []

    for category_data in data.get("categories"):
        # Перетворення категорії
        category_encoded = encoder.transform([category_data.get('category_name')])[0]

        # Масштабування
        features = pd.DataFrame([[category_data.get('month_number'), category_data.get('year'), category_data.get('last_month_spent'),
                                  category_data.get('rolling_mean'), category_encoded]],
                                columns=["month_number", "year", "last_month_spent", "rolling_mean", "category_encoded"])
        features[["last_month_spent", "rolling_mean"]] = scaler.transform(features[["last_month_spent", "rolling_mean"]])

        # Прогноз
        prediction = model.predict(features)[0]
        predictions.append({
            "category_id": category_data.get('category_id'),
            "category_name": category_data.get('category_name'),
            "last_month_spent": category_data.get('last_month_spent'),
            "rolling_mean": category_data.get('rolling_mean'),
            "predicted_expense": prediction
        })

    return {"predictions": predictions}


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)