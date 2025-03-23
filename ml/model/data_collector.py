import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd

# --- Load environment variables ---
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# --- Fetch data ---
records = supabase.table("records").select("*").execute().data
categories = supabase.table("categories").select("*").execute().data
sheets = supabase.table("sheets").select("*").execute().data

# --- DataFrames ---
df_records = pd.DataFrame(records)
df_categories = pd.DataFrame(categories)
df_sheets = pd.DataFrame(sheets)

# --- Enrich records ---
df_records['created_at'] = pd.to_datetime(df_records['created_at'])
df_records['year_month'] = df_records['created_at'].dt.to_period("M")
df_records = df_records.merge(df_categories[[
                              'id', 'name', 'type']], left_on='category_id', right_on='id', suffixes=('', '_category'))
df_records = df_records.merge(
    df_sheets[['id', 'name']], left_on='sheet_id', right_on='id', suffixes=('', '_sheet'))

# --- Total monthly spending per sheet + category ---
monthly = df_records.groupby(['sheet_id', 'category_id', 'year_month']) \
    .agg(total_spent=('amount', 'sum')).reset_index()

# --- Rolling features (SHEET-based) ---


def add_sheet_rolling_features(df):
    df = df.sort_values(['sheet_id', 'year_month'])

    group = df.groupby('sheet_id')['total_spent']
    df['total_spent_in_sheet_last_month'] = group.shift(1)
    df['total_spent_in_sheet_last_3_months'] = group.transform(
        lambda x: x.shift(1).rolling(3).sum())
    df['average_spent_in_sheet_last_6_months'] = group.transform(
        lambda x: x.shift(1).rolling(6).mean())
    df['sheet_spending_trend'] = group.transform(
        lambda x: x.diff().apply(lambda d: 1 if d > 0 else (-1 if d < 0 else 0)))

    return df

# --- Rolling features (CATEGORY-based) ---


def add_category_rolling_features(df):
    df = df.sort_values(['sheet_id', 'category_id', 'year_month'])

    # Group object
    group = df.groupby(['sheet_id', 'category_id'])['total_spent']

    # Rolling aggregates with proper index alignment
    df['total_spent_in_category_last_month'] = group.shift(1)
    df['total_spent_in_category_last_3_months'] = group.transform(
        lambda x: x.shift(1).rolling(3).sum())
    df['average_spent_in_category_last_6_months'] = group.transform(
        lambda x: x.shift(1).rolling(6).mean())

    # Trend direction
    df['category_spending_trend'] = group.transform(
        lambda x: x.diff().apply(lambda d: 1 if d > 0 else (-1 if d < 0 else 0)))

    return df


monthly = add_sheet_rolling_features(monthly)
monthly = add_category_rolling_features(monthly)

# --- Category % of sheet total (last month) ---
monthly['category_spent_percentage_last_month'] = (
    monthly['total_spent_in_category_last_month'] /
    monthly['total_spent_in_sheet_last_month']
)

# --- Category % trend ---
monthly['category_spent_percentage_trend'] = monthly.groupby(['sheet_id', 'category_id'])['category_spent_percentage_last_month'].diff().apply(
    lambda x: 1 if x > 0 else (-1 if x < 0 else 0)
)

# --- Most frequent, most/least expensive categories per sheet/month ---


def get_top_categories(df_records):
    df_records['year_month'] = df_records['created_at'].dt.to_period("M")
    grouped = df_records.groupby(['sheet_id', 'year_month'])

    top_freq = grouped['category_id'].agg(
        lambda x: x.value_counts().idxmax()).reset_index()
    top_freq = top_freq.rename(
        columns={'category_id': 'most_frequent_spending_category_in_sheet'})

    cat_totals = df_records.groupby(['sheet_id', 'year_month', 'category_id']).agg(
        total_spent=('amount', 'sum')).reset_index()

    max_cat = cat_totals.loc[cat_totals.groupby(['sheet_id', 'year_month'])['total_spent'].idxmax()][
        ['sheet_id', 'year_month', 'category_id']].rename(columns={'category_id': 'most_expensive_category_last_month_in_sheet'})

    min_cat = cat_totals.loc[cat_totals.groupby(['sheet_id', 'year_month'])['total_spent'].idxmin()][
        ['sheet_id', 'year_month', 'category_id']].rename(columns={'category_id': 'least_expensive_category_last_month_in_sheet'})

    return top_freq, max_cat, min_cat


top_freq, max_cat, min_cat = get_top_categories(df_records)

# Merge into final dataframe
monthly = monthly.merge(top_freq, on=['sheet_id', 'year_month'], how='left')
monthly = monthly.merge(max_cat, on=['sheet_id', 'year_month'], how='left')
monthly = monthly.merge(min_cat, on=['sheet_id', 'year_month'], how='left')

# Fill NaNs with 0 for numeric columns
numeric_cols = [
    'total_spent',
    'total_spent_in_sheet_last_month',
    'total_spent_in_sheet_last_3_months',
    'average_spent_in_sheet_last_6_months',
    'sheet_spending_trend',
    'total_spent_in_category_last_month',
    'total_spent_in_category_last_3_months',
    'average_spent_in_category_last_6_months',
    'category_spending_trend',
    'category_spent_percentage_last_month',
    'category_spent_percentage_trend',
]

monthly[numeric_cols] = monthly[numeric_cols].fillna(0)

# If desired: fill missing category IDs with empty string (optional)
category_id_cols = [
    'most_frequent_spending_category_in_sheet',
    'most_expensive_category_last_month_in_sheet',
    'least_expensive_category_last_month_in_sheet'
]
monthly[category_id_cols] = monthly[category_id_cols].fillna("")

# --- Save to CSV ---
output_path = "monthly_category_summary_full.csv"
monthly.to_csv(output_path, index=False)
print(f"✅ Saved enriched dataset to: {output_path}")
