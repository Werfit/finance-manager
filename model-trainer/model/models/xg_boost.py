import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

def train_xg_boost_model(training_data: tuple[pd.DataFrame, pd.Series]):
    """
    Навчання XGBoost моделі для прогнозування витрат по категоріях з урахуванням історичних витрат.
    :param training_data: Кортеж з ознаками (X) та цільовими значеннями (y).
    """
    print("Running XG Boost model")

    X, y = training_data
    # Розділення даних на train/test (80%/20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Підбір гіперпараметрів для XGBoost
    param_grid = {
        'n_estimators': [200, 300],
        'learning_rate': [0.05, 0.1],
        'max_depth': [4, 5, 6],
        'subsample': [0.8, 1.0],
        'alpha': [0, 0.1],
        'lambda': [0, 0.1]
    }
    grid_search = GridSearchCV(XGBRegressor(random_state=42, tree_method='hist'), param_grid, scoring='neg_mean_absolute_error', cv=5, verbose=1)
    grid_search.fit(X_train, y_train)

    # Найкраща модель
    best_model = grid_search.best_estimator_

    # Оцінка моделі
    y_pred = best_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"MAE: {mae}, RMSE: {rmse}")

    return best_model