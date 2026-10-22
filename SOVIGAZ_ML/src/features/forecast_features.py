"""
SOVIGAZ Forecasting Features & Time Series Aggregations (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR
from src.utils.logger import setup_logger

logger = setup_logger("ForecastFeatures", log_filename="data_pipeline.log")

def build_time_series_aggregations(df_sales: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """
    Builds Daily, Weekly, and Monthly aggregations from clean transaction sales.
    Does NOT overwrite transaction-level data.
    """
    logger.info("Executing PHẦN E: Building Time Series Datasets (Daily, Weekly, Monthly)...")
    df = df_sales.copy()
    df["RefDate"] = pd.to_datetime(df["RefDate"])

    # 1. Daily Aggregation
    daily = df.groupby(["RefDate", "InventoryItemCode_New", "BranchCode"], observed=False).agg(
        Revenue=("Revenue", "sum"),
        Quantity=("MainQuantity", "sum"),
        TransactionCount=("RefNo", "count"),
        CustomerCount=("AccountObjectCode", "nunique")
    ).reset_index()

    # 2. Weekly Aggregation (Monday of week)
    df["WeekStart"] = df["RefDate"].dt.to_period("W-SUN").dt.start_time
    weekly = df.groupby(["WeekStart", "InventoryItemCode_New", "BranchCode"], observed=False).agg(
        Revenue=("Revenue", "sum"),
        Quantity=("MainQuantity", "sum"),
        TransactionCount=("RefNo", "count"),
        CustomerCount=("AccountObjectCode", "nunique")
    ).reset_index().rename(columns={"WeekStart": "Date"})

    # 3. Monthly Aggregation (1st of month)
    df["MonthStart"] = df["RefDate"].dt.to_period("M").dt.start_time
    monthly = df.groupby(["MonthStart", "InventoryItemCode_New", "BranchCode"], observed=False).agg(
        Revenue=("Revenue", "sum"),
        Quantity=("MainQuantity", "sum"),
        TransactionCount=("RefNo", "count"),
        CustomerCount=("AccountObjectCode", "nunique")
    ).reset_index().rename(columns={"MonthStart": "Date"})

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    daily_path = PROCESSED_DATA_DIR / "sales_daily.parquet"
    weekly_path = PROCESSED_DATA_DIR / "sales_weekly.parquet"
    monthly_path = PROCESSED_DATA_DIR / "sales_monthly.parquet"

    daily.to_parquet(daily_path, index=False, engine="pyarrow")
    weekly.to_parquet(weekly_path, index=False, engine="pyarrow")
    monthly.to_parquet(monthly_path, index=False, engine="pyarrow")

    logger.info(f"Aggregations saved:")
    logger.info(f"  - sales_daily.parquet  : {len(daily):,} rows")
    logger.info(f"  - sales_weekly.parquet : {len(weekly):,} rows")
    logger.info(f"  - sales_monthly.parquet: {len(monthly):,} rows")

    return {
        "daily": daily,
        "weekly": weekly,
        "monthly": monthly
    }

def create_forecasting_features(
    df_ts: pd.DataFrame, 
    date_col: str = "Date", 
    target_col: str = "Revenue",
    freq: str = "daily"
) -> Tuple[pd.DataFrame, List[str]]:
    """
    Creates calendar, lag, and rolling features for time-series forecasting.
    
    STRICT NO-LEAKAGE RULE:
    Rolling statistics MUST use .shift(1).rolling(...) so that current observation
    target value is NEVER included in features.
    """
    logger.info(f"Creating forecasting features for frequency: {freq}, target: {target_col}...")
    df = df_ts.copy()
    df[date_col] = pd.to_datetime(df[date_col])
    
    # Sort strictly by entity and time
    group_cols = [c for c in ["InventoryItemCode_New", "BranchCode"] if c in df.columns]
    if group_cols:
        df = df.sort_values(by=group_cols + [date_col]).reset_index(drop=True)
    else:
        df = df.sort_values(by=[date_col]).reset_index(drop=True)

    features = []

    # 1. Calendar Features
    df["calendar_year"] = df[date_col].dt.year
    df["calendar_month"] = df[date_col].dt.month
    df["calendar_quarter"] = df[date_col].dt.quarter
    features.extend(["calendar_year", "calendar_month", "calendar_quarter"])

    if freq in ["daily", "weekly"]:
        df["calendar_week"] = df[date_col].dt.isocalendar().week.astype(int)
        features.append("calendar_week")

    if freq == "daily":
        df["calendar_day_of_week"] = df[date_col].dt.dayofweek
        df["calendar_day_of_month"] = df[date_col].dt.day
        df["calendar_is_weekend"] = df["calendar_day_of_week"].isin([5, 6]).astype(int)
        features.extend(["calendar_day_of_week", "calendar_day_of_month", "calendar_is_weekend"])

    # 2. Lag Features
    if freq == "daily":
        lags = [1, 7, 14, 28, 30, 60, 90]
    elif freq == "weekly":
        lags = [1, 2, 4, 8, 12]
    else: # monthly
        lags = [1, 2, 3, 6, 12]

    for lag in lags:
        feat_name = f"lag_{lag}"
        if group_cols:
            df[feat_name] = df.groupby(group_cols)[target_col].shift(lag)
        else:
            df[feat_name] = df[target_col].shift(lag)
        features.append(feat_name)

    # 3. Rolling Features with STRICT SHIFT(1) TO PREVENT TARGET LEAKAGE
    if freq == "daily":
        windows = [7, 14, 30]
    elif freq == "weekly":
        windows = [4, 8, 12]
    else: # monthly
        windows = [3, 6]

    for w in windows:
        roll_mean_name = f"rolling_mean_{w}"
        roll_std_name = f"rolling_std_{w}"

        # CRITICAL: .shift(1) BEFORE .rolling()
        if group_cols:
            shifted = df.groupby(group_cols)[target_col].shift(1)
            df[roll_mean_name] = df.groupby(group_cols)[target_col].transform(lambda s: s.shift(1).rolling(w, min_periods=1).mean())
            df[roll_std_name] = df.groupby(group_cols)[target_col].transform(lambda s: s.shift(1).rolling(w, min_periods=1).std()).fillna(0)
        else:
            df[roll_mean_name] = df[target_col].shift(1).rolling(w, min_periods=1).mean()
            df[roll_std_name] = df[target_col].shift(1).rolling(w, min_periods=1).std().fillna(0)

        features.extend([roll_mean_name, roll_std_name])

    logger.info(f"Generated {len(features)} forecasting features. Strict shift(1) applied for rolling windows.")
    return df, features
