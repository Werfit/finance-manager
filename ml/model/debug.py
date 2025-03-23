import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import lightgbm as lgb
from math import sqrt


# Load dataset
df = pd.read_csv("./datasets/synthetic-dataset-expanded.csv")

df["year_month"] = pd.to_datetime(df["year_month"], format="%Y-%m")
df = df.sort_values(["sheet_id", "category_id", "year_month"])
df["target_next_month_spent"] = df.groupby(["sheet_id", "category_id"])[
    "total_spent"].shift(-1)
df = df.dropna(subset=["target_next_month_spent"])

# Feature columns
feature_cols = [
    "total_spent",
    "total_spent_in_sheet_last_month",
    "total_spent_in_sheet_last_3_months",
    "average_spent_in_sheet_last_6_months",
    "sheet_spending_trend",
    "total_spent_in_category_last_month",
    "total_spent_in_category_last_3_months",
    "average_spent_in_category_last_6_months",
    "category_spending_trend",
    "category_spent_percentage_last_month",
    "category_spent_percentage_trend",
]

X = df[feature_cols]
y_raw = df["target_next_month_spent"]
y_log = np.log1p(y_raw)

# Plot the target distribution
plt.hist(y_log, bins=50)
plt.title("Log-Transformed Target Distribution")
plt.xlabel("log(1 + target_next_month_spent)")
plt.ylabel("Frequency")
plt.grid(True)
plt.show()


# Train-test split
X_train, X_test, y_train_raw, y_test_raw = train_test_split(
    X, y_raw, test_size=0.2, random_state=42)
y_train_log = np.log1p(y_train_raw)
y_test_log = np.log1p(y_test_raw)

# Train simple model
model = lgb.LGBMRegressor()
model.fit(X_train, y_train_log)

# Predict
y_pred_log = model.predict(X_test)
y_pred = np.expm1(y_pred_log)

# Plot actual vs predicted
plt.figure(figsize=(10, 6))
plt.scatter(y_test_raw, y_pred, alpha=0.5)
plt.plot([y_test_raw.min(), y_test_raw.max()], [
         y_test_raw.min(), y_test_raw.max()], 'r--', lw=2)
plt.xlabel("Actual")
plt.ylabel("Predicted")
plt.title("Actual vs Predicted: Next Month's Category Spend")
plt.grid(True)
plt.tight_layout()
plt.show()

# Evaluate
mae = mean_absolute_error(y_test_raw, y_pred)
rmse = sqrt(mean_squared_error(y_test_raw, y_pred))

print(f"✅ MAE:  {mae:.2f}")
print(f"✅ RMSE: {rmse:.2f}")
