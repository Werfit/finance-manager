import pandas as pd
import lightgbm as lgb
import optuna
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Load original dataset
df = pd.read_csv("./datasets/synthetic-dataset-expanded.csv")

# Parse and sort
df["year_month"] = pd.to_datetime(df["year_month"])
df = df.sort_values(["sheet_id", "category_id", "year_month"])

# Compute target: category spend as % of sheet
df["next_category_spent"] = df.groupby(["sheet_id", "category_id"])[
    "total_spent"].shift(-1)
df["next_sheet_spent"] = df.groupby(
    "sheet_id")["total_spent_in_sheet_last_month"].shift(-1)
df["target"] = df["next_category_spent"] / df["next_sheet_spent"]

# Clean up
df = df.replace([np.inf, -np.inf], np.nan)
df = df.dropna(subset=["target"])

# ✅ In-memory oversampling: amplify rare target > 1 cases
df_rare = df[df["target"] > 1]
df_balanced = pd.concat(
    [df, df_rare.sample(frac=5, replace=True)], ignore_index=True)

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

X = df_balanced[feature_cols]
y = df_balanced["target"]

# Train/valid split
X_train, X_valid, y_train, y_valid = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Optuna objective


def objective(trial):
    params = {
        "objective": "regression",
        "metric": "mae",
        "boosting_type": "gbdt",
        "verbosity": -1,
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "num_leaves": trial.suggest_int("num_leaves", 15, 100),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "feature_fraction": trial.suggest_float("feature_fraction", 0.6, 1.0),
        "bagging_fraction": trial.suggest_float("bagging_fraction", 0.6, 1.0),
        "bagging_freq": trial.suggest_int("bagging_freq", 1, 7),
        "min_child_samples": trial.suggest_int("min_child_samples", 5, 50),
    }

    model = lgb.LGBMRegressor(**params)
    model.fit(
        X_train,
        y_train,
        eval_set=[(X_valid, y_valid)],
        callbacks=[
            lgb.early_stopping(20),
            lgb.log_evaluation(0)
        ]
    )

    preds = model.predict(X_valid)
    return mean_absolute_error(y_valid, preds)


# Run Optuna
study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=50)

print("Best MAE:", study.best_value)
print("Best params:", study.best_params)

# Final training on all oversampled data
final_model = lgb.LGBMRegressor(**study.best_params)
final_model.fit(X, y)

# Save model
final_model.booster_.save_model("./models/lgbm_model_percentage.txt")
print("✅ Final model saved to ./models/lgbm_model_percentage.txt")
