"""
SOVIGAZ Customer Master & Point-in-Time RFM Features (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import Optional, Tuple
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR
from src.utils.logger import setup_logger

logger = setup_logger("RFMFeatures", log_filename="data_pipeline.log")

def build_customer_master(df_sales: pd.DataFrame, df_cust_dim: pd.DataFrame) -> pd.DataFrame:
    """
    Builds single-row-per-customer Master table with lifetime summary metrics.
    """
    logger.info("Executing PHẦN G: Building customer_master.parquet...")
    df = df_sales.copy()
    df["RefDate"] = pd.to_datetime(df["RefDate"])

    # Aggregate sales metrics per customer
    cust_agg = df.groupby("AccountObjectCode").agg(
        FirstPurchaseDate=("RefDate", "min"),
        LastPurchaseDate=("RefDate", "max"),
        TotalTransactions=("RefNo", "count"),
        TotalOrders=("RefNo", "nunique"),
        LifetimeRevenue=("Revenue", "sum"),
        LifetimeQuantity=("MainQuantity", "sum")
    ).reset_index()

    # Active months count
    df["YearMonth"] = df["RefDate"].dt.to_period("M")
    active_m = df.groupby("AccountObjectCode")["YearMonth"].nunique().reset_index(name="ActiveMonths")
    cust_agg = cust_agg.merge(active_m, on="AccountObjectCode", how="left")

    # Merge with Dim_Customer
    dim_cols = [c for c in ["AccountObjectCode", "CustomerName", "StockCode", "ProvinceOrCity", "Country"] if c in df_cust_dim.columns]
    master = df_cust_dim[dim_cols].drop_duplicates(subset=["AccountObjectCode"]).merge(
        cust_agg, on="AccountObjectCode", how="left"
    )

    master = master.rename(columns={
        "AccountObjectCode": "CustomerCode",
        "StockCode": "BranchCode",
        "ProvinceOrCity": "Region"
    })

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DATA_DIR / "customer_master.parquet"
    master.to_parquet(out_path, index=False, engine="pyarrow")
    logger.info(f"Saved customer_master.parquet: {len(master):,} customers.")
    return master

def compute_point_in_time_rfm(
    df_sales: pd.DataFrame, 
    observation_date: pd.Timestamp,
    lookback_days: Optional[int] = None
) -> pd.DataFrame:
    """
    Computes Point-in-Time RFM(T) at an explicit observation date T.
    
    STRICT NO-LEAKAGE RULE:
    Transactions with RefDate > T are STRICTLY EXCLUDED.
    """
    t = pd.to_datetime(observation_date)
    df = df_sales.copy()
    df["RefDate"] = pd.to_datetime(df["RefDate"])

    # Temporal filter
    mask = df["RefDate"] <= t
    if lookback_days is not None:
        mask = mask & (df["RefDate"] >= (t - pd.Timedelta(days=lookback_days)))

    df_filtered = df[mask].copy()

    if df_filtered.empty:
        logger.warning(f"No transactions found for RFM at T={t.strftime('%Y-%m-%d')}")
        return pd.DataFrame()

    # 1. Base RFM aggregations
    rfm = df_filtered.groupby("AccountObjectCode").agg(
        last_order_date=("RefDate", "max"),
        first_order_date=("RefDate", "min"),
        frequency=("RefDate", lambda s: s.dt.date.nunique()), # distinct active purchase days
        monetary=("Revenue", "sum"),
        total_quantity=("MainQuantity", "sum"),
        product_diversity=("InventoryItemCode_New", "nunique"),
        order_count=("RefNo", "nunique")
    ).reset_index()

    # Recency: days from last order date to observation date T
    rfm["recency"] = (t - rfm["last_order_date"]).dt.days
    rfm["observation_date"] = t

    # Derived Behavior Metrics
    rfm["avg_order_value"] = np.where(rfm["frequency"] > 0, rfm["monetary"] / rfm["frequency"], 0.0)
    rfm["avg_item_value"] = np.where(rfm["total_quantity"] > 0, rfm["monetary"] / rfm["total_quantity"], 0.0)

    # Active months within observation window
    df_filtered["YearMonth"] = df_filtered["RefDate"].dt.to_period("M")
    active_m = df_filtered.groupby("AccountObjectCode")["YearMonth"].nunique().reset_index(name="active_months")
    rfm = rfm.merge(active_m, on="AccountObjectCode", how="left")

    # Purchase Interval statistics (inter-purchase days)
    cust_dates = df_filtered[["AccountObjectCode", "RefDate"]].drop_duplicates().sort_values(by=["AccountObjectCode", "RefDate"])
    cust_dates["prev_date"] = cust_dates.groupby("AccountObjectCode")["RefDate"].shift(1)
    cust_dates["interval"] = (cust_dates["RefDate"] - cust_dates["prev_date"]).dt.days
    
    interval_stats = cust_dates.groupby("AccountObjectCode")["interval"].agg(
        purchase_interval_mean="mean",
        purchase_interval_std="std"
    ).reset_index()
    interval_stats["purchase_interval_mean"] = interval_stats["purchase_interval_mean"].fillna(0.0)
    interval_stats["purchase_interval_std"] = interval_stats["purchase_interval_std"].fillna(0.0)

    rfm = rfm.merge(interval_stats, on="AccountObjectCode", how="left")

    return rfm

def save_rfm_snapshot(df_sales: pd.DataFrame, observation_date: str = "2026-06-16") -> Path:
    """
    Saves the latest full RFM feature set to rfm_features.parquet for customer segmentation.
    """
    t = pd.to_datetime(observation_date)
    logger.info(f"Computing latest RFM features at T={t.strftime('%Y-%m-%d')} for segmentation...")
    rfm = compute_point_in_time_rfm(df_sales, t)
    
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DATA_DIR / "rfm_features.parquet"
    rfm.to_parquet(out_path, index=False, engine="pyarrow")
    logger.info(f"Saved rfm_features.parquet: {len(rfm):,} customers.")
    return out_path
