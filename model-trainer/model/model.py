import pandas as pd
from sklearn.preprocessing import LabelEncoder, RobustScaler
import pickle
from models.light_gbm import train_lgb_model
from models.xg_boost import train_xg_boost_model
from typing import Callable, Tuple, Any

def process_data_frame(df: pd.DataFrame, label_encoder: LabelEncoder, scaler: RobustScaler) -> tuple[pd.Series, pd.Series]:
    df["month"] = pd.to_datetime(df["month"], format="%Y-%m")
    df["month_number"] = df["month"].dt.month  # Витягуємо номер місяця
    df["year"] = df["month"].dt.year  # Додаємо рік як окрему ознаку

    # Перетворюємо від'ємні значення витрат у додатні
    df["last_month_spent"] = df["last_month_spent"].abs()
    df["rolling_mean"] = df["rolling_mean"].abs()

    # Нормалізація історичних витрат за допомогою RobustScaler
    df[["last_month_spent", "rolling_mean"]] = scaler.fit_transform(df[["last_month_spent", "rolling_mean"]])

    # Перетворення категорій у числовий формат
    df["category_encoded"] = label_encoder.fit_transform(df["category"])

    # Вибір ознак та цільової змінної
    X = df[["month_number", "year", "last_month_spent", "rolling_mean", "category_encoded"]]
    y = df["total_spent"]

    return X, y


def train(path: str, model_path: str, trainer_cb: Callable[[Tuple[pd.Series, pd.Series]], Any]):
    label_encoder = LabelEncoder()
    scaler = RobustScaler()

    df = pd.read_csv(path)

    training_data = process_data_frame(df, label_encoder, scaler)

    best_model = trainer_cb(training_data)

    # Збереження моделі, енкодера та скейлера
    # with open(model_path, "wb") as f:
    #     pickle.dump((best_model, label_encoder, scaler), f)

    # print(f"Модель збережено у {model_path}")

# train("datasets/processed.csv", "lbm_expense_forecaster.pkl", train_xg_boost_model)
train("datasets/processed.csv", "lbm_expense_forecaster.pkl", train_lgb_model)