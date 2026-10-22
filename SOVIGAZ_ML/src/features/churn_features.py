"""
SOVIGAZ Multi-Snapshot Temporal Churn Feature Pipeline (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Tuple
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR, REPORTS_DIR
from src.utils.logger import setup_logger
from src.features.rfm_features import compute_point_in_time_rfm

logger = setup_logger("ChurnFeatures", log_filename="data_pipeline.log")

DEFAULT_SNAPSHOTS = [
    "2023-12-31",
    "2024-06-30",
    "2024-12-31",
    "2025-06-30",
    "2025-12-31"
]

def analyze_purchase_intervals(df_sales: pd.DataFrame) -> pd.DataFrame:
    """
    Computes rigorous interpurchase days percentiles overall and by product category/branch
    to provide the empirical foundation for Churn Thresholds (PHẦN J).
    """
    logger.info("Executing PHẦN J: Rigorous Interpurchase Interval Analysis...")
    df = df_sales.copy()
    df["RefDate"] = pd.to_datetime(df["RefDate"])

    # 1. Overall Interpurchase Distribution
    cust_dates = df[["AccountObjectCode", "RefDate"]].drop_duplicates().sort_values(by=["AccountObjectCode", "RefDate"])
    cust_dates["prev_date"] = cust_dates.groupby("AccountObjectCode")["RefDate"].shift(1)
    cust_dates["interval"] = (cust_dates["RefDate"] - cust_dates["prev_date"]).dt.days
    intervals = cust_dates["interval"].dropna()

    percentiles = [0.25, 0.50, 0.75, 0.90, 0.95, 0.99]
    quant_vals = intervals.quantile(percentiles).to_dict()

    summary_rows = [{
        "Dimension": "Overall",
        "Group": "All Customers",
        "Observed_Intervals": len(intervals),
        "Mean_Days": round(float(intervals.mean()), 2),
        "Median_Days": round(float(quant_vals[0.50]), 1),
        "P25_Days": round(float(quant_vals[0.25]), 1),
        "P75_Days": round(float(quant_vals[0.75]), 1),
        "P90_Days": round(float(quant_vals[0.90]), 1),
        "P95_Days": round(float(quant_vals[0.95]), 1),
        "P99_Days": round(float(quant_vals[0.99]), 1),
        "Pct_le_60d": round(float((intervals <= 60).mean() * 100), 2),
        "Pct_le_90d": round(float((intervals <= 90).mean() * 100), 2),
        "Pct_le_120d": round(float((intervals <= 120).mean() * 100), 2)
    }]

    # 2. By Branch
    if "BranchCode" in df.columns:
        cust_branch = df[["AccountObjectCode", "BranchCode", "RefDate"]].drop_duplicates().sort_values(by=["AccountObjectCode", "RefDate"])
        cust_branch["prev_date"] = cust_branch.groupby("AccountObjectCode")["RefDate"].shift(1)
        cust_branch["interval"] = (cust_branch["RefDate"] - cust_branch["prev_date"]).dt.days
        
        for br, grp in cust_branch.groupby("BranchCode", observed=False):
            b_inv = grp["interval"].dropna()
            if len(b_inv) > 100:
                q = b_inv.quantile(percentiles).to_dict()
                summary_rows.append({
                    "Dimension": "Branch",
                    "Group": str(br),
                    "Observed_Intervals": len(b_inv),
                    "Mean_Days": round(float(b_inv.mean()), 2),
                    "Median_Days": round(float(q[0.50]), 1),
                    "P25_Days": round(float(q[0.25]), 1),
                    "P75_Days": round(float(q[0.75]), 1),
                    "P90_Days": round(float(q[0.90]), 1),
                    "P95_Days": round(float(q[0.95]), 1),
                    "P99_Days": round(float(q[0.99]), 1),
                    "Pct_le_60d": round(float((b_inv <= 60).mean() * 100), 2),
                    "Pct_le_90d": round(float((b_inv <= 90).mean() * 100), 2),
                    "Pct_le_120d": round(float((b_inv <= 120).mean() * 100), 2)
                })

    df_summary = pd.DataFrame(summary_rows)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    out_csv = REPORTS_DIR / "churn_threshold_interval_analysis.csv"
    df_summary.to_csv(out_csv, index=False, encoding="utf-8-sig")
    logger.info(f"Saved churn threshold analysis to {out_csv}")
    return df_summary

def build_temporal_churn_dataset(
    df_sales: pd.DataFrame,
    snapshots: List[str] = DEFAULT_SNAPSHOTS,
    obs_days: int = 180,
    pred_days: int = 90
) -> pd.DataFrame:
    """
    Constructs Multi-Snapshot Temporal Panel Dataset for B2B Churn Prediction.
    
    Observation Window: [T - obs_days, T]
    Prediction Window : [T, T + pred_days]
    Target            : 1 = No purchases in [T, T + pred_days], 0 = Repurchased
    
    STRICT DATA LEAKAGE CHECKS:
    1. All feature columns are calculated ONLY from transactions in [T - obs_days, T].
    2. Prediction window strictly terminates before or at max(sales_date).
    3. Prediction-window transactions are exclusively used to compute binary label Y.
    """
    logger.info(f"Executing PHẦN I: Building Multi-Snapshot Churn Dataset across {len(snapshots)} dates...")
    df = df_sales.copy()
    df["RefDate"] = pd.to_datetime(df["RefDate"])
    dataset_max_date = df["RefDate"].max()

    all_snapshot_dfs = []

    for s_date_str in snapshots:
        t = pd.to_datetime(s_date_str)
        obs_start = t - pd.Timedelta(days=obs_days)
        pred_end = t + pd.Timedelta(days=pred_days)

        # Leakage / Completeness Guard
        if pred_end > dataset_max_date:
            raise ValueError(
                f"FATAL LEAKAGE VIOLATION: Prediction window end {pred_end.strftime('%Y-%m-%d')} "
                f"exceeds dataset max date {dataset_max_date.strftime('%Y-%m-%d')}!"
            )

        logger.info(f"Processing Snapshot T={s_date_str}: Obs [{obs_start.strftime('%Y-%m-%d')} to {t.strftime('%Y-%m-%d')}], Pred [{t.strftime('%Y-%m-%d')} to {pred_end.strftime('%Y-%m-%d')}]")

        # 1. Transactions in Observation Window
        obs_sales = df[(df["RefDate"] >= obs_start) & (df["RefDate"] <= t)].copy()
        active_customers = obs_sales["AccountObjectCode"].unique()

        if len(active_customers) == 0:
            logger.warning(f"No active customers in snapshot T={s_date_str}")
            continue

        # 2. Features from Observation Window ONLY
        rfm_obs = compute_point_in_time_rfm(obs_sales, t, lookback_days=obs_days)
        
        # Additional Behavioral Features in [T - obs_days, T]
        # Revenue trend: Compare revenue in last 90 days vs previous 90 days of observation window
        mid_date = t - pd.Timedelta(days=90)
        recent_rev = obs_sales[obs_sales["RefDate"] > mid_date].groupby("AccountObjectCode")["Revenue"].sum().reset_index(name="rev_last_90d")
        prior_rev = obs_sales[obs_sales["RefDate"] <= mid_date].groupby("AccountObjectCode")["Revenue"].sum().reset_index(name="rev_prior_90d")
        
        rfm_obs = rfm_obs.merge(recent_rev, on="AccountObjectCode", how="left").fillna({"rev_last_90d": 0.0})
        rfm_obs = rfm_obs.merge(prior_rev, on="AccountObjectCode", how="left").fillna({"rev_prior_90d": 0.0})
        
        # Momentum / Trend ratio
        rfm_obs["revenue_trend_ratio"] = np.where(
            (rfm_obs["rev_prior_90d"] + rfm_obs["rev_last_90d"]) > 0,
            rfm_obs["rev_last_90d"] / (rfm_obs["rev_prior_90d"] + rfm_obs["rev_last_90d"]),
            0.5
        )

        # 3. Target Label from Prediction Window [T, T + pred_days]
        pred_sales = df[(df["RefDate"] > t) & (df["RefDate"] <= pred_end)].copy()
        repurchased_customers = set(pred_sales["AccountObjectCode"].unique())

        # Target: 1 = Churn (Did NOT buy in prediction window), 0 = Retained (Bought in prediction window)
        rfm_obs["churn_target_90d"] = (~rfm_obs["AccountObjectCode"].isin(repurchased_customers)).astype(int)
        rfm_obs["snapshot_date"] = t

        churn_count = rfm_obs["churn_target_90d"].sum()
        total_count = len(rfm_obs)
        churn_pct = (churn_count / total_count * 100) if total_count > 0 else 0.0
        logger.info(f"Snapshot T={s_date_str} completed: {total_count:,} samples | Churned (Y=1): {churn_count:,} ({churn_pct:.2f}%) | Retained (Y=0): {total_count - churn_count:,}")

        all_snapshot_dfs.append(rfm_obs)

    combined_df = pd.concat(all_snapshot_dfs, ignore_index=True)
    logger.info(f"Total Combined Multi-Snapshot Churn Dataset: {len(combined_df):,} samples.")
    logger.info(f"Overall Churn Class Distribution: Y=1 (Churn): {combined_df['churn_target_90d'].sum():,} ({combined_df['churn_target_90d'].mean()*100:.2f}%), Y=0: {(combined_df['churn_target_90d']==0).sum():,}")

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DATA_DIR / "churn_dataset.parquet"
    combined_df.to_parquet(out_path, index=False, engine="pyarrow")
    logger.info(f"Saved churn_dataset.parquet to {out_path}")
    return combined_df
