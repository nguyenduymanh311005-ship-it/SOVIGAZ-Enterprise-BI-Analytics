"""
SOVIGAZ Unit Tests for Sub-Phase 4C.1: Churn Model Audit, Reconciliation & Hardening
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-04
"""
import sys
import json
from pathlib import Path
import unittest
import numpy as np
import pandas as pd
import joblib
from sklearn.metrics import (
    confusion_matrix, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, brier_score_loss
)

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

class TestChurnAudit4C1(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.churn_dir = PROJECT_ROOT / "outputs" / "churn"
        cls.reports_dir = PROJECT_ROOT / "reports"
        cls.models_dir = PROJECT_ROOT / "models"
        cls.seg_dir = PROJECT_ROOT / "outputs" / "customer_segmentation"

        cls.inv_path = cls.reports_dir / "churn_feature_inventory_4C1.csv"
        cls.ci_path = cls.reports_dir / "churn_test_metrics_ci_4C1.csv"
        cls.pred_path = cls.churn_dir / "churn_predictions.csv"
        cls.feat_path = cls.churn_dir / "churn_features.parquet"
        cls.th_path = cls.models_dir / "churn_threshold.json"
        cls.model_path = cls.models_dir / "best_churn_model.joblib"
        cls.preproc_path = cls.models_dir / "churn_preprocessor.joblib"
        cls.shap_path = cls.churn_dir / "churn_feature_importance.csv"

        cls.df_inv = pd.read_csv(cls.inv_path)
        cls.df_ci = pd.read_csv(cls.ci_path)
        cls.df_pred = pd.read_csv(cls.pred_path)
        cls.df_feat = pd.read_parquet(cls.feat_path)
        with open(cls.th_path, "r", encoding="utf-8") as f:
            cls.th_config = json.load(f)
        cls.model = joblib.load(cls.model_path)
        cls.scaler = joblib.load(cls.preproc_path)
        cls.df_shap = pd.read_csv(cls.shap_path)

        cls.test_df = cls.df_pred[cls.df_pred["snapshot_date"] == "2025-12-31"].reset_index(drop=True)

    def test_1_feature_inventory_matches_model_input(self):
        """Test 1: Exactly 30 features marked as is_model_input matching CatBoost feature_names_."""
        model_feats = set(self.model.feature_names_)
        inv_model_feats = set(self.df_inv[self.df_inv["is_model_input"] == True]["feature_name"])
        self.assertEqual(len(model_feats), 30)
        self.assertEqual(len(inv_model_feats), 30)
        self.assertEqual(model_feats, inv_model_feats)
        self.assertEqual(len(self.df_inv), 43)

    def test_2_no_targets_or_identifiers_in_model_input(self):
        """Test 2: No target, customer ID, or prediction output marked as model input."""
        in_feats = self.df_inv[self.df_inv["is_model_input"] == True]
        self.assertFalse(in_feats["is_target"].any(), "Target label found in model input!")
        self.assertFalse(in_feats["is_identifier"].any(), "Customer identifier found in model input!")
        self.assertFalse(in_feats["is_prediction_output"].any(), "Prediction output found in model input!")

    def test_3_feature_lineage_and_rules_complete(self):
        """Test 3: Every feature in inventory has source columns, transformation, and temporal rule."""
        self.assertFalse(self.df_inv["source_columns"].isna().any())
        self.assertFalse(self.df_inv["transformation"].isna().any())
        self.assertFalse(self.df_inv["max_source_event_date_rule"].isna().any())

    def test_4_zero_future_leakage_declared(self):
        """Test 4: uses_future_data is strictly False for all 43 columns."""
        for _, r in self.df_inv.iterrows():
            self.assertFalse(bool(r["uses_future_data"]))

    def test_5_threshold_consistency_and_validation_origin(self):
        """Test 5: Threshold is locked at 0.50 and metadata declares Validation fold selection."""
        self.assertEqual(self.th_config["optimal_threshold"], 0.50)
        self.assertIn("Validation Fold", self.th_config["selection_metric"])
        self.assertEqual(self.test_df["threshold"].iloc[0], 0.50)

    def test_6_prediction_uniqueness_and_row_count(self):
        """Test 6: Total prediction rows = 5,502; zero duplicate (customer_code, snapshot_date)."""
        self.assertEqual(len(self.df_pred), 5502)
        dups = self.df_pred.duplicated(subset=["customer_code", "snapshot_date"]).sum()
        self.assertEqual(dups, 0)
        # Test fold has exactly 1,174 unique customers
        self.assertEqual(len(self.test_df), 1174)
        self.assertEqual(self.test_df["customer_code"].nunique(), 1174)

    def test_7_confusion_matrix_recalculation(self):
        """Test 7: Recalculated confusion matrix on Hold-out Test strictly equals TN=617, FP=102, FN=145, TP=310."""
        y_true = self.test_df["actual_churn"].values
        y_pred = self.test_df["predicted_churn"].values
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        self.assertEqual(tn, 617)
        self.assertEqual(fp, 102)
        self.assertEqual(fn, 145)
        self.assertEqual(tp, 310)
        self.assertEqual(tn + fp + fn + tp, 1174)

    def test_8_test_metrics_recalculation(self):
        """Test 8: Recalculated test metrics match reported values within 1e-3."""
        y_true = self.test_df["actual_churn"].values
        y_prob = self.test_df["churn_probability"].values
        y_pred = self.test_df["predicted_churn"].values

        prec = precision_score(y_true, y_pred)
        rec = recall_score(y_true, y_pred)
        f1 = f1_score(y_true, y_pred)
        roc = roc_auc_score(y_true, y_prob)
        pr = average_precision_score(y_true, y_prob)
        brier = brier_score_loss(y_true, y_prob)

        self.assertAlmostEqual(prec, 0.7524, places=3)
        self.assertAlmostEqual(rec, 0.6813, places=3)
        self.assertAlmostEqual(f1, 0.7151, places=3)
        self.assertAlmostEqual(roc, 0.8210, places=3)
        self.assertAlmostEqual(pr, 0.7796, places=3)
        self.assertAlmostEqual(brier, 0.1587, places=3)

    def test_9_shap_percentages_sum_and_relative_formula(self):
        """Test 9: SHAP relative importance sum equals 100% within rounding tolerance."""
        total_pct = self.df_shap["relative_importance_pct"].sum()
        self.assertGreaterEqual(total_pct, 99.9)
        self.assertLessEqual(total_pct, 100.2)
        # Verify rank 1 is recency_days
        self.assertEqual(self.df_shap.iloc[0]["feature"], "recency_days")
        self.assertEqual(self.df_shap.iloc[0]["rank"], 1)

    def test_10_bootstrap_ci_validity(self):
        """Test 10: Bootstrap CI artifact exists, has 6 metrics, and ci_lower <= point <= ci_upper."""
        self.assertEqual(len(self.df_ci), 6)
        for _, r in self.df_ci.iterrows():
            pt = r["point_estimate"]
            lo = r["ci_lower_95"]
            hi = r["ci_upper_95"]
            self.assertLessEqual(lo, pt)
            self.assertGreaterEqual(hi, pt)
            self.assertEqual(r["n_bootstrap"], 2000)
            self.assertEqual(r["random_seed"], 42)

    def test_11_scaler_train_only_fit(self):
        """Test 11: Scaler mean matches Train fold (2023-2024, N=3236) and NOT Test fold."""
        train = self.df_feat[self.df_feat["snapshot_date"].isin(["2023-12-31", "2024-06-30", "2024-12-31"])]
        train_mean = train[self.model.feature_names_].mean().values
        np.testing.assert_allclose(self.scaler.mean_, train_mean, rtol=1e-4)

    def test_12_negative_revenue_exact_reconciliation(self):
        """Test 12: Cluster 3 revenue difference between 4B (-4.89B) and 4C (-5.06B) reconciles to the exact dong."""
        assign_path = self.seg_dir / "cluster_assignments.csv"
        df_assign = pd.read_csv(assign_path)
        primary_path = self.seg_dir / "rfm_segmentation_primary.parquet"
        df_primary = pd.read_parquet(primary_path)

        c3_custs_4b = set(df_assign[df_assign["cluster_id"] == 3]["AccountObjectCode"])
        test_custs_4c = set(self.test_df["customer_code"])

        excluded_custs = c3_custs_4b - test_custs_4c
        self.assertEqual(len(excluded_custs), 114)

        # Revenue of the 114 excluded customers in 4B
        excl_rev = df_primary[df_primary["AccountObjectCode"].isin(excluded_custs)]["monetary_365d"].sum()

        rev_4b = df_primary[df_primary["AccountObjectCode"].isin(c3_custs_4b)]["monetary_365d"].sum()
        # Revenue of remaining 221 in 4C
        remaining_c3 = c3_custs_4b.intersection(test_custs_4c)
        self.assertEqual(len(remaining_c3), 221)
        rev_4c = self.test_df[self.test_df["customer_code"].isin(remaining_c3)]["monetary_365d"].sum()

        # Check exact mathematical reconciliation
        np.testing.assert_allclose(rev_4b - excl_rev, rev_4c, rtol=1e-5)
        self.assertAlmostEqual(rev_4b, -4886978295.0, places=0)
        self.assertAlmostEqual(rev_4c, -5058370254.0, places=0)

if __name__ == "__main__":
    unittest.main(verbosity=2)
