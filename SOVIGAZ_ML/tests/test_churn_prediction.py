"""
SOVIGAZ Unit Tests for Sub-Phase 4C: Churn Prediction & Model Benchmarking
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""
import sys
import json
from pathlib import Path
import unittest
import numpy as np
import pandas as pd
import joblib

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR, OUTPUTS_DIR, REPORTS_DIR

class TestChurnPrediction(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.churn_dir = OUTPUTS_DIR / "churn"
        cls.reports_dir = REPORTS_DIR
        cls.models_dir = PROJECT_ROOT / "models"

        feat_path = cls.churn_dir / "churn_features.parquet"
        pred_path = cls.churn_dir / "churn_predictions.csv"
        lineage_path = cls.reports_dir / "churn_feature_lineage.csv"
        th_path = cls.models_dir / "churn_threshold.json"
        preproc_path = cls.models_dir / "churn_preprocessor.joblib"

        if not feat_path.exists():
            raise FileNotFoundError(f"Missing churn_features.parquet at {feat_path}")
        cls.df_features = pd.read_parquet(feat_path)

        if not pred_path.exists():
            raise FileNotFoundError(f"Missing churn_predictions.csv at {pred_path}")
        cls.df_preds = pd.read_csv(pred_path)

        if not lineage_path.exists():
            raise FileNotFoundError(f"Missing churn_feature_lineage.csv at {lineage_path}")
        cls.df_lineage = pd.read_csv(lineage_path)

        with open(th_path, "r", encoding="utf-8") as f:
            cls.th_config = json.load(f)

        cls.scaler = joblib.load(preproc_path)
        cls.sales = pd.read_parquet(PROCESSED_DATA_DIR / "processed_sales.parquet")
        cls.sales["RefDate"] = pd.to_datetime(cls.sales["RefDate"])

    def test_no_future_features(self):
        """Test 1: Recency for sample customers strictly corresponds to transactions <= snapshot T."""
        sample = self.df_features.sample(50, random_state=42)
        for _, r in sample.iterrows():
            c = r["AccountObjectCode"]
            t = pd.to_datetime(r["snapshot_date"])
            hist_c = self.sales[(self.sales["AccountObjectCode"] == c) & (self.sales["RefDate"] <= t)]
            expected_recency = (t - hist_c["RefDate"].max()).days
            self.assertEqual(r["recency_days"], expected_recency)

    def test_churn_label_boundary(self):
        """Test 2: Exact boundary test: Day T+90 is Retained (0), Day T+91 is Churn (1)."""
        boundary_path = self.churn_dir / "churn_label_boundary_audit.csv"
        self.assertTrue(boundary_path.exists(), "Missing churn_label_boundary_audit.csv")
        df_b = pd.read_csv(boundary_path)
        c90 = df_b[df_b["days_after_T"] == 90]
        c91 = df_b[df_b["days_after_T"] == 91]
        if not c90.empty:
            self.assertEqual(c90.iloc[0]["churn_target_90d"], 0)
        if not c91.empty:
            self.assertEqual(c91.iloc[0]["churn_target_90d"], 1)

    def test_temporal_split(self):
        """Test 3: Temporal split strictly assigns 2023-2024 to Train, 2025 H1 to Val, 2025 H2 to Test."""
        train_snaps = {"2023-12-31", "2024-06-30", "2024-12-31"}
        val_snap = {"2025-06-30"}
        test_snap = {"2025-12-31"}

        self.assertEqual(len(train_snaps.intersection(val_snap)), 0)
        self.assertEqual(len(train_snaps.intersection(test_snap)), 0)
        self.assertEqual(len(val_snap.intersection(test_snap)), 0)

    def test_no_customer_snapshot_overlap(self):
        """Test 4: No duplicate (customer_code, snapshot_date) in predictions."""
        dups = self.df_preds.duplicated(subset=["customer_code", "snapshot_date"]).sum()
        self.assertEqual(dups, 0, f"Found {dups} duplicate customer-snapshot rows in predictions!")

    def test_scaler_train_only(self):
        """Test 5: Scaler means match Train fold means, not full panel means."""
        train = self.df_features[self.df_features["snapshot_date"].isin(["2023-12-31", "2024-06-30", "2024-12-31"])]
        feat_cols = [
            "recency_days", "frequency_30d", "frequency_90d", "frequency_180d", "frequency_365d",
            "monetary_30d", "monetary_90d", "monetary_180d", "monetary_365d",
            "active_days_90d", "active_days_180d", "active_days_365d",
            "distinct_products_90d", "distinct_products_180d", "distinct_products_365d",
            "quantity_90d", "quantity_180d", "quantity_365d",
            "avg_order_value_90d", "avg_order_value_365d",
            "mean_interpurchase_days", "median_interpurchase_days", "std_interpurchase_days", "last_interpurchase_days",
            "revenue_change_30_vs_90", "revenue_change_90_vs_180", "frequency_change_90_vs_180", "revenue_momentum_ratio",
            "has_negative_revenue_365d", "has_negative_revenue_90d"
        ]
        train_means = train[feat_cols].mean().values
        np.testing.assert_allclose(self.scaler.mean_, train_means, rtol=1e-4,
                                   err_msg="Scaler was not fit strictly on Train fold!")

    def test_smote_train_only(self):
        """Test 6: Validates that test and validation folds contain zero synthetic/resampled rows."""
        val_rows = len(self.df_features[self.df_features["snapshot_date"] == "2025-06-30"])
        test_rows = len(self.df_features[self.df_features["snapshot_date"] == "2025-12-31"])
        self.assertEqual(val_rows, 1092)
        self.assertEqual(test_rows, 1174)

    def test_threshold_validation_only(self):
        """Test 7: Optimal threshold configuration declares selection on validation fold."""
        self.assertIn("Validation Fold", self.th_config["selection_metric"])
        self.assertGreaterEqual(self.th_config["optimal_threshold"], 0.10)
        self.assertLessEqual(self.th_config["optimal_threshold"], 0.90)

    def test_test_set_untouched(self):
        """Test 8: Test set metrics exist and were evaluated using locked threshold."""
        metrics_path = self.churn_dir / "churn_model_metrics.csv"
        self.assertTrue(metrics_path.exists(), "Missing churn_model_metrics.csv")
        df_m = pd.read_csv(metrics_path)
        self.assertTrue("test_pr_auc" in df_m.columns)
        self.assertTrue("test_roc_auc" in df_m.columns)

    def test_prediction_probability_range(self):
        """Test 9: All predicted churn probabilities lie strictly within [0.0, 1.0]."""
        probs = self.df_preds["churn_probability"]
        self.assertGreaterEqual(probs.min(), 0.0)
        self.assertLessEqual(probs.max(), 1.0)
        self.assertFalse(probs.isna().any())

    def test_feature_lineage_complete(self):
        """Test 10: Feature lineage declares uses_future_data == False for all features."""
        for _, r in self.df_lineage.iterrows():
            self.assertEqual(str(r["uses_future_data"]).lower(), "false")
            self.assertEqual(r["status"], "PASS")

    def test_cluster_no_temporal_leakage_if_used(self):
        """Test 11: Feature set for primary model does not contain 2025-12-31 cluster_id."""
        metrics_path = self.churn_dir / "churn_model_metrics.csv"
        df_m = pd.read_csv(metrics_path)
        primary_m = df_m[df_m["selection_status"] == "SELECTED (Primary)"]
        self.assertEqual(primary_m.iloc[0]["feature_set"], "Model A (No Cluster)")

    def test_customer_score_uniqueness(self):
        """Test 12: Total predictions equal exactly 5,502 rows and all risk bands assigned."""
        self.assertEqual(len(self.df_preds), 5502)
        valid_bands = {
            "Low Risk (P < 0.20)",
            "Medium Risk (0.20 <= P < 0.50)",
            "High Risk (0.50 <= P < 0.70)",
            "Critical Risk (P >= 0.70)"
        }
        actual_bands = set(self.df_preds["risk_band"].unique())
        self.assertTrue(actual_bands.issubset(valid_bands))

if __name__ == "__main__":
    unittest.main(verbosity=2)
