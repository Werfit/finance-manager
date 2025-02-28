import pandas as pd

def load_and_aggregate_transactions(file_path: str, output_file: str):
    # Завантаження CSV
    df = pd.read_csv(file_path)

    print(f"Загальна кількість транзакцій: {len(df)}")

    # Конвертація дати у формат datetime (ISO 8601 підтримка)
    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce", utc=True)

    # Витягуємо рік-місяць у форматі YYYY-MM
    df["month"] = df["created_at"].dt.tz_localize(None).dt.to_period("M")

    # Визначаємо святкові місяці (грудень, січень, березень)
    df["is_holiday_month"] = df["created_at"].dt.month.isin([12, 1, 3]).astype(int)

    # Конвертація amount у float
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df.dropna(subset=["amount"], inplace=True)

    # Перевірка статистики перед агрегуванням
    print(f"Статистика по amount перед агрегуванням:\n{df['amount'].describe()}")

    # Агрегація витрат по користувачах, місяцях і категоріях
    aggregated_df = (
        df.groupby(["user_id", "month", "category"])
        .agg(total_spent=("amount", "sum"), is_holiday_month=("is_holiday_month", "max"))
        .reset_index()
    )

    # Перетворимо month у формат YYYY-MM (рядок для збереження у CSV)
    aggregated_df["month"] = aggregated_df["month"].astype(str)

    # Додавання попередніх витрат у тій же категорії (last_month_spent)
    aggregated_df.sort_values(by=["user_id", "category", "month"], inplace=True)
    aggregated_df["last_month_spent"] = aggregated_df.groupby(["user_id", "category"])["total_spent"].shift(1)

    # Додавання середніх витрат за останні 3 місяці (rolling_mean)
    aggregated_df["rolling_mean"] = aggregated_df.groupby(["user_id", "category"])["total_spent"].rolling(window=3, min_periods=1).mean().reset_index(level=[0,1], drop=True)

    # Заповнення NaN значень нулями
    aggregated_df.fillna(0, inplace=True)

    # Використання абсолютних значень для статистичних підрахунків
    abs_total_spent = aggregated_df["total_spent"].abs()

    # Обчислення мінімального, максимального та середнього total_spent по всьому файлу
    min_total_spent = abs_total_spent.min()
    max_total_spent = abs_total_spent.max()
    mean_total_spent = abs_total_spent.mean()

    print(f"Мінімальні загальні витрати: {min_total_spent}")
    print(f"Максимальні загальні витрати: {max_total_spent}")
    print(f"Середні загальні витрати: {mean_total_spent}")

    # Збереження результатів у CSV
    aggregated_df.to_csv(output_file, index=False)

    return aggregated_df

def main():
    dataset = load_and_aggregate_transactions('datasets/final.csv', 'datasets/processed.csv')
    print(dataset.head())

if __name__ == "__main__":
    main()