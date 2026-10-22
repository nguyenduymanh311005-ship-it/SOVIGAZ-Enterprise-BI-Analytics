"""
SOVIGAZ Data Leakage Unit Tests (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
import unittest
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR
from src.features.forecast_features import create_forecasting_features

class TestDataLeakage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.churn_path = PROCESSED_DATA_DIR / "churn_dataset.parquet"
        cls.daily_path = PROCESSED_DATA_DIR / "sales_daily.parquet"
        cls.sales_path = PROCESSED_DATA_DIR / "processed_sales.parquet"

        if not cls.churn_path.exists():
            raise FileNotFoundError(f"churn_dataset.parquet missing at: {cls.churn_path}. Run pipeline_runner.py first.")
        cls.df_churn = pd.read_parquet(cls.churn_path)
        cls.df_sales = pd.read_parquet(cls.sales_path)
        cls.df_daily = pd.read_parquet(cls.daily_path)

    def test_no_future_features(self):
        """
        MANDATORY LEAKAGE CHECK:
        Verifies that for every observation snapshot T, max(feature_source_date) <= observation_date.
        """
        for snapshot_dt, group in self.df_churn.groupby("snapshot_date"):
            t = pd.to_datetime(snapshot_dt)
            # Check last order date in feature table
            max_feature_date = pd.to_datetime(group["last_order_date"]).max()
            self.assertLessEqual(
                max_feature_date, t,
                f"LEAKAGE VIOLATION: max feature date {max_feature_date} > observation date {t}!"
            )
            # Recency must be non-negative
            self.assertTrue(
                (group["recency"] >= 0).all(),
                f"Negative recency found at snapshot {t}!"
            )

    def test_forecast_lag_integrity(self):
        """
        Verifies that lag_1 is strictly target at T-1, not T,
        and that rolling mean uses shift(1) preventing target leakage.
        """
        # Take single entity time-series
        sample_prod = self.df_daily["InventoryItemCode_New"].iloc[0]
        sample_branch = self.df_daily["BranchCode"].iloc[0]
        subset = self.df_daily[
            (self.df_daily["InventoryItemCode_New"] == sample_prod) & 
            (self.df_daily["BranchCode"] == sample_branch)
        ].copy()
        
        subset = subset.sort_values(by="RefDate").reset_index(drop=True)
        if len(subset) >= 10:
            df_feat, feat_cols = create_forecasting_features(subset, date_col="RefDate", target_col="Revenue", freq="daily")
            
            # Check lag_1
            # Row i lag_1 must equal Row i-1 Revenue
            for i in range(1, min(10, len(df_feat))):
                expected_lag1 = df_feat.loc[i - 1, "Revenue"]
                actual_lag1 = df_feat.loc[i, "lag_1"]
                self.assertAlmostEqual(
                    expected_lag1, actual_lag1, places=2,
                    msg=f"Lag 1 mismatch at row {i}: expected {expected_lag1}, got {actual_lag1}"
                )
                
            # Check rolling mean 7
            # Row 7 rolling_mean_7 must equal mean of Revenue from rows 0 to 6 (strictly excluding row 7)
            if len(df_feat) >= 8:
                expected_roll7 = df_feat.loc[0:6, "Revenue"].mean()
                actual_roll7 = df_feat.loc[7, "rolling_mean_7"]
                self.assertAlmostEqual(
                    expected_roll7, actual_roll7, places=2,
                    msg=f"Rolling mean 7 includes current target! Expected {expected_roll7}, got {actual_roll7}"
                )

    def test_churn_label_integrity(self):
        """
        Verifies that churn prediction window is strictly [T, T + 90]
        and does not exceed the maximum sales date in the historical database.
        """
        max_sales_date = pd.to_datetime(self.df_sales["RefDate"].max())
        for snapshot_dt in self.df_churn["snapshot_date"].unique():
            t = pd.to_datetime(snapshot_dt)
            pred_end = t + pd.Timedelta(days=90)
            self.assertLessEqual(
                pred_end, max_sales_date,
                f"Prediction window end {pred_end} exceeds max sales date {max_sales_date}!"
            )

if __name__ == "__main__":
    unittest.main()
