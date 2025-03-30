from typing import List, Dict, Tuple

import pandas as pd
import lightgbm as lgb
import optuna
import numpy as np
from sklearn.metrics import mean_absolute_error
import shap
import matplotlib.pyplot as plt

# Global variable for feature columns
feature_cols: List[str] = []


def load_and_prepare_data(file_path: str) -> pd.DataFrame:
    """
    Load the dataset and perform initial preprocessing steps.

    Args:
        file_path: Path to the CSV file containing the dataset

    Returns:
        DataFrame with initial preprocessing applied
    """
    # Load original dataset
    df = pd.read_csv(file_path)

    # Parse and sort
    df["year_month"] = pd.to_datetime(df["year_month"])
    df = df.sort_values(["sheet_id", "category_id", "year_month"])

    return df


def compute_target_variable(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute the target variable: category spend as percentage of sheet.

    Args:
        df: Input DataFrame

    Returns:
        DataFrame with target variable added
    """
    # Compute next month's values for category and sheet spending
    df["next_category_spent"] = df.groupby(["sheet_id", "category_id"])[
        "total_spent"].shift(-1)
    df["next_sheet_spent"] = df.groupby(
        "sheet_id")["total_spent_in_sheet_last_month"].shift(-1)

    # Calculate target as ratio
    df["target"] = df["next_category_spent"] / df["next_sheet_spent"]

    # Clean up
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna(subset=["target"])

    return df


def balance_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Balance the dataset by oversampling rare cases where target > 1.

    Args:
        df: Input DataFrame

    Returns:
        Balanced DataFrame
    """
    df_rare = df[df["target"] > 1]
    df_balanced = pd.concat(
        [df, df_rare.sample(frac=5, replace=True)], ignore_index=True)
    return df_balanced


def create_lag_features(df: pd.DataFrame, lag_periods: List[int]) -> pd.DataFrame:
    """
    Create lag features for both category and sheet spending.

    Args:
        df: Input DataFrame
        lag_periods: List of lag periods to create

    Returns:
        DataFrame with lag features added
    """
    for lag in lag_periods:
        df[f'category_spent_lag_{lag}'] = df.groupby(['sheet_id', 'category_id'])[
            'total_spent'].shift(lag)
        df[f'sheet_spent_lag_{lag}'] = df.groupby(
            ['sheet_id'])['total_spent_in_sheet_last_month'].shift(lag)
    return df


def create_rolling_statistics(df: pd.DataFrame, windows: List[int]) -> pd.DataFrame:
    """
    Create rolling statistics (mean, std) for different time windows.

    Args:
        df: Input DataFrame
        windows: List of window sizes for rolling calculations

    Returns:
        DataFrame with rolling statistics added
    """
    for window_size in windows:
        # Category level
        df[f'category_rolling_mean_{window_size}m'] = df.groupby(['sheet_id', 'category_id'])['total_spent'].transform(
            lambda x: x.rolling(window_size, min_periods=1).mean()
        )
        df[f'category_rolling_std_{window_size}m'] = df.groupby(['sheet_id', 'category_id'])['total_spent'].transform(
            lambda x: x.rolling(window_size, min_periods=1).std()
        )

        # Sheet level
        df[f'sheet_rolling_mean_{window_size}m'] = df.groupby(['sheet_id'])['total_spent_in_sheet_last_month'].transform(
            lambda x: x.rolling(window_size, min_periods=1).mean()
        )
    return df


def create_cross_cutting_features(df: pd.DataFrame, windows: List[int]) -> pd.DataFrame:
    """
    Create cross-cutting average features across sheets and categories.

    Args:
        df: Input DataFrame
        windows: List of window sizes for rolling calculations

    Returns:
        DataFrame with cross-cutting features added
    """
    # 1. Average across all categories for each sheet
    df['sheet_category_avg'] = df.groupby(['sheet_id', 'year_month'])[
        'total_spent'].transform('mean')

    # 2. Average across all sheets for each category
    df['category_sheet_avg'] = df.groupby(['category_id', 'year_month'])[
        'total_spent'].transform('mean')

    # 3. Rolling average of cross-cutting features
    for window_size in windows:
        # Rolling average of sheet-category averages
        df[f'sheet_category_rolling_avg_{window_size}m'] = df.groupby('sheet_id')['sheet_category_avg'].transform(
            lambda x: x.rolling(window_size, min_periods=1).mean()
        )

        # Rolling average of category-sheet averages
        df[f'category_sheet_rolling_avg_{window_size}m'] = df.groupby('category_id')['category_sheet_avg'].transform(
            lambda x: x.rolling(window_size, min_periods=1).mean()
        )

    return df


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add time-based features (month, quarter, year) from the year_month column.

    Args:
        df: Input DataFrame

    Returns:
        DataFrame with time features added
    """
    df['month'] = df['year_month'].dt.month
    df['quarter'] = df['year_month'].dt.quarter
    df['year'] = df['year_month'].dt.year
    return df


def create_time_aware_split(df: pd.DataFrame, validation_months: int = 3) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Create time-aware train/validation split.

    Args:
        df: Input DataFrame
        validation_months: Number of months to use for validation

    Returns:
        Tuple of (X_train, X_valid, y_train, y_valid)
    """
    train_end_date = df['year_month'].max(
    ) - pd.DateOffset(months=validation_months)
    train_mask = df['year_month'] <= train_end_date

    X_train = df[train_mask][feature_cols]
    y_train = df[train_mask]['target']
    X_valid = df[~train_mask][feature_cols]
    y_valid = df[~train_mask]['target']

    return X_train, X_valid, y_train, y_valid


def objective(trial: optuna.Trial, X_train: pd.DataFrame, y_train: pd.Series,
              X_valid: pd.DataFrame, y_valid: pd.Series) -> float:
    params = {
        "objective": "regression",
        "metric": "mae",
        "boosting_type": trial.suggest_categorical("boosting_type", ["gbdt", "dart"]),
        "verbosity": -1,
        # More granular hyperparameter ranges
        "max_depth": trial.suggest_int("max_depth", 4, 12),
        "num_leaves": trial.suggest_int("num_leaves", 20, 150),
        "learning_rate": trial.suggest_float("learning_rate", 0.005, 0.2, log=True),
        "feature_fraction": trial.suggest_float("feature_fraction", 0.5, 1.0),
        "bagging_fraction": trial.suggest_float("bagging_fraction", 0.5, 1.0),
        "bagging_freq": trial.suggest_int("bagging_freq", 1, 10),
        "min_child_samples": trial.suggest_int("min_child_samples", 5, 100),
        "max_bin": trial.suggest_int("max_bin", 200, 1000),
        "min_data_in_leaf": trial.suggest_int("min_data_in_leaf", 5, 200),
        "lambda_l1": trial.suggest_float("lambda_l1", 1e-8, 10.0, log=True),
        "lambda_l2": trial.suggest_float("lambda_l2", 1e-8, 10.0, log=True),
        "min_gain_to_split": trial.suggest_float("min_gain_to_split", 1e-8, 1.0, log=True),
        # Additional parameters
        "max_cat_threshold": trial.suggest_int("max_cat_threshold", 16, 64),
        "cat_l2": trial.suggest_float("cat_l2", 1.0, 10.0),
        "cat_smooth": trial.suggest_float("cat_smooth", 1.0, 10.0),
        "n_estimators": trial.suggest_int("n_estimators", 500, 3000)
    }

    # Train with more epochs and stricter early stopping
    model = lgb.LGBMRegressor(**params)
    model.fit(
        X_train,
        y_train,
        eval_set=[(X_train, y_train), (X_valid, y_valid)],
        eval_metric=['mae', 'rmse'],
        callbacks=[
            lgb.early_stopping(100),  # Increased from 50 to 100
            lgb.log_evaluation(100)
        ],
    )

    # Use multiple evaluation metrics
    predictions = model.predict(X_valid)
    mae_score = mean_absolute_error(y_valid, predictions)

    # Weight recent predictions more heavily (last 20% of data)
    recent_mask = y_valid.index >= y_valid.index[int(len(y_valid) * 0.8)]
    recent_mae = mean_absolute_error(
        y_valid[recent_mask], predictions[recent_mask])

    # Add stability metric
    stability_score = np.std(predictions) / np.std(y_valid)

    # Combined score (weighted average of different metrics)
    final_score = (0.4 * mae_score +
                   0.4 * recent_mae +
                   # Penalize both under and over-variation
                   0.2 * abs(1 - stability_score))

    return final_score


def evaluate_predictions(y_true: pd.Series, y_pred: np.ndarray, dates: pd.Series) -> Dict[str, float]:
    """
    Evaluate predictions using time-aware metrics.

    Args:
        y_true: True values
        y_pred: Predicted values
        dates: Dates corresponding to the predictions

    Returns:
        Dictionary of evaluation metrics
    """
    # Convert predictions to pandas Series with same index as y_true
    y_pred_series = pd.Series(y_pred, index=y_true.index)

    # Calculate recent dates threshold
    recent_threshold = dates.quantile(0.8)

    # Create mask for recent dates
    recent_mask = dates > recent_threshold

    results = {
        'Overall MAE': mean_absolute_error(y_true, y_pred),
        'Recent MAE': mean_absolute_error(
            y_true[recent_mask],
            y_pred_series[recent_mask]
        )
    }
    return results


def create_exponential_smoothing_features(df: pd.DataFrame, alphas: List[float]) -> pd.DataFrame:
    """
    Create exponential smoothing features for both category and sheet spending.

    Args:
        df: Input DataFrame
        alphas: List of smoothing factors (between 0 and 1)

    Returns:
        DataFrame with exponential smoothing features added
    """
    for alpha in alphas:
        # Category level exponential smoothing
        df[f'category_exp_smooth_{alpha}'] = df.groupby(['sheet_id', 'category_id'])['total_spent'].transform(
            lambda x: x.ewm(alpha=alpha, adjust=False).mean()
        )

        # Sheet level exponential smoothing
        df[f'sheet_exp_smooth_{alpha}'] = df.groupby(['sheet_id'])['total_spent_in_sheet_last_month'].transform(
            lambda x: x.ewm(alpha=alpha, adjust=False).mean()
        )
    return df


def main(dataset_path: str, model_path: str) -> None:
    """
    Main function to orchestrate the model training pipeline.

    Args:
        dataset_path: Path to the dataset
        model_path: Path to save the model
    """
    # Define feature columns
    global feature_cols
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

    # Load and prepare data
    df = load_and_prepare_data(dataset_path)

    # Compute target variable
    df = compute_target_variable(df)

    # Balance dataset
    df_balanced = balance_dataset(df)

    # Create features
    df_balanced = create_lag_features(
        df_balanced, lag_periods=[1, 2, 3, 6, 12])
    df_balanced = create_rolling_statistics(df_balanced, windows=[3, 6, 12])
    df_balanced = create_exponential_smoothing_features(
        df_balanced, alphas=[0.2, 0.4, 0.6])
    df_balanced = create_cross_cutting_features(
        df_balanced, windows=[3, 6, 12])
    df_balanced = add_time_features(df_balanced)

    # Create time-aware split
    X_train, X_valid, y_train, y_valid = create_time_aware_split(df_balanced)

    # Run Optuna optimization with more trials and better sampling
    study = optuna.create_study(
        direction="minimize",
        sampler=optuna.samplers.TPESampler(
            n_startup_trials=25,  # Number of random trials before TPE
            multivariate=True,  # Consider parameter relationships
            seed=42
        )
    )

    study.optimize(
        lambda trial: objective(trial, X_train, y_train, X_valid, y_valid),
        n_trials=300,  # Increased from 200
        timeout=7200,  # Increased to 2 hours
        show_progress_bar=True,
        n_jobs=-1  # Use all available cores
    )

    print("Best MAE:", study.best_value)
    print("Best params:", study.best_params)

    # Train final model with cross-validation
    final_params = study.best_params
    final_params['n_estimators'] = 2000  # Use more trees for final model

    final_model = lgb.LGBMRegressor(**final_params)
    final_model.fit(
        X_train,
        y_train,
        eval_set=[(X_valid, y_valid)],
        eval_metric=['mae', 'rmse'],
        callbacks=[
            lgb.early_stopping(100),
            lgb.log_evaluation(100)
        ],
    )

    # Make predictions on validation set
    y_pred = final_model.predict(X_valid)

    # Evaluate model performance
    validation_dates = df_balanced[~df_balanced['year_month'].isin(
        X_train.index)]['year_month']
    evaluation_results = evaluate_predictions(
        y_valid, y_pred, validation_dates)
    print("\nModel Evaluation Results:")
    for metric, value in evaluation_results.items():
        print(f"{metric}: {value:.4f}")

    # Calculate and display feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': final_model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))

    # Calculate and display SHAP values
    explainer = shap.TreeExplainer(final_model)
    shap_values = explainer.shap_values(X_valid)

    # Plot SHAP summary
    print("\nGenerating SHAP summary plot...")
    shap.summary_plot(shap_values, X_valid, plot_type="bar", show=False)
    plt.savefig("./models/shap_summary.png")
    plt.close()

    # Save model
    final_model.booster_.save_model(model_path)
    print(f"✅ Final model saved to {model_path}")


if __name__ == "__main__":
    main(dataset_path="./datasets/synthetic-dataset-expanded-v2.csv",
         model_path="./models/lgbm_model_percentage_v2.txt")
