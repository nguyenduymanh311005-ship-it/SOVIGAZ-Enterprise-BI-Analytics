"""
SOVIGAZ Unit Tests for Sub-Phase 4D: Churn Risk Scoring, Prioritization & Business Activation
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-04
"""
import sys
import json
import hashlib
from pathlib import Path
import unittest
import numpy as np
import pandas as pd
import joblib

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

class TestChurn4D(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.churn_dir = PROJECT_ROOT / "outputs" / "churn"
        cls.pbi_dir = PROJECT_ROOT / "outputs" / "powerbi"
        cls.reports_dir = PROJECT_ROOT / "reports"
        cls.models_dir = PROJECT_ROOT / "models"

        cls.scored_path = cls.churn_dir / "churn_risk_scored.csv"
        cls.priority_path = cls.churn_dir / "churn_priority_customers.csv"
        cls.temp_path = cls.churn_dir / "churn_risk_temporal_summary.csv"
        cls.cal_path = cls.reports_dir / "churn_probability_calibration_4D.csv"
        cls.sens_path = cls.reports_dir / "churn_priority_sensitivity_4D.csv"
        cls.pbi_path = cls.pbi_dir / "churn_customer_risk.csv"

        cls.model_path = cls.models_dir / "best_churn_model.joblib"
        cls.th_path = cls.models_dir / "churn_threshold.json"

        # Load artifacts
        cls.df_scored = pd.read_csv(cls.scored_path)
        cls.df_pri = pd.read_csv(cls.priority_path)
        cls.df_temp = pd.read_csv(cls.temp_path)
        cls.df_cal = pd.read_csv(cls.cal_path)
        cls.df_sens = pd.read_csv(cls.sens_path)
        cls.df_pbi = pd.read_csv(cls.pbi_path)

        with open(cls.th_path, "r", encoding="utf-8") as f:
            cls.th_config = json.load(f)
        cls.model = joblib.load(cls.model_path)

    def test_1_identity_and_schema_integrity(self):
        """Test 1: Master scored table has exactly 5,502 rows and zero duplicate (customer_code, snapshot_date)."""
        self.assertEqual(len(self.df_scored), 5502)
        self.assertFalse(self.df_scored["AccountObjectCode"].isna().any())
        self.assertFalse(self.df_scored["snapshot_date"].isna().any())
        dups = self.df_scored.duplicated(subset=["AccountObjectCode", "snapshot_date"]).sum()
        self.assertEqual(dups, 0, f"Found {dups} duplicate customer-snapshot pairs!")

    def test_2_model_output_bounds_and_threshold(self):
        """Test 2: churn_probability in [0, 1], predicted_churn in {0, 1}, locked threshold = 0.50."""
        probs = self.df_scored["churn_probability"]
        self.assertTrue((probs >= 0.0).all() and (probs <= 1.0).all())
        preds = self.df_scored["predicted_churn"]
        self.assertTrue(set(preds.unique()).issubset({0, 1}))
        self.assertEqual(float(self.th_config["optimal_threshold"]), 0.50)
        # Check predicted_churn corresponds to threshold 0.50
        expected_preds = (probs >= 0.50).astype(int)
        np.testing.assert_array_equal(preds.values, expected_preds.values)

    def test_3_risk_band_mapping_validity(self):
        """Test 3: Risk band mapping strictly adheres to 4-tier stratification rule."""
        valid_bands = {
            "Critical Risk (P >= 0.80)",
            "High Risk (0.50 <= P < 0.80)",
            "Medium Risk (0.25 <= P < 0.50)",
            "Low Risk (P < 0.25)"
        }
        self.assertTrue(set(self.df_scored["risk_band"].unique()).issubset(valid_bands))
        for _, r in self.df_scored.sample(200, random_state=42).iterrows():
            p = r["churn_probability"]
            band = r["risk_band"]
            if p >= 0.80:
                self.assertEqual(band, "Critical Risk (P >= 0.80)")
            elif p >= 0.50:
                self.assertEqual(band, "High Risk (0.50 <= P < 0.80)")
            elif p >= 0.25:
                self.assertEqual(band, "Medium Risk (0.25 <= P < 0.50)")
            else:
                self.assertEqual(band, "Low Risk (P < 0.25)")

    def test_4_value_tier_rules(self):
        """Test 4: Value tiers correctly map monetary_365d into High, Medium, and Low tiers."""
        valid_tiers = {
            "High Value (>= 100M VND)",
            "Medium Value (15M - 100M VND)",
            "Low Value (< 15M VND)"
        }
        self.assertTrue(set(self.df_scored["value_tier"].unique()).issubset(valid_tiers))
        for _, r in self.df_scored.sample(200, random_state=42).iterrows():
            m = r["monetary_365d"]
            vt = r["value_tier"]
            if m >= 100_000_000:
                self.assertEqual(vt, "High Value (>= 100M VND)")
            elif m >= 15_000_000:
                self.assertEqual(vt, "Medium Value (15M - 100M VND)")
            else:
                self.assertEqual(vt, "Low Value (< 15M VND)")

    def test_5_priority_scores_and_levels(self):
        """Test 5: Priority score in [0, 100] and priority_level in approved 4 tiers."""
        scores = self.df_scored["priority_score"]
        self.assertFalse(scores.isna().any())
        self.assertTrue((scores >= 0.0).all() and (scores <= 100.0).all())
        valid_levels = {
            "Tier 1: Immediate Attention",
            "Tier 2: High Priority",
            "Tier 3: Medium Priority",
            "Tier 4: Monitoring / Low"
        }
        self.assertTrue(set(self.df_scored["priority_level"].unique()).issubset(valid_levels))

    def test_6_business_action_assignment(self):
        """Test 6: Every customer has a non-empty recommended_action and action_rationale."""
        self.assertFalse(self.df_scored["recommended_action"].isna().any())
        self.assertFalse(self.df_scored["action_rationale"].isna().any())
        self.assertTrue((self.df_scored["recommended_action"].str.len() > 5).all())
        self.assertTrue((self.df_scored["action_rationale"].str.len() > 10).all())

    def test_7_model_integrity_preserved(self):
        """Test 7: CatBoost model MD5 hash is preserved and feature count equals exactly 30."""
        expected_md5 = "449731b1475ff40e16b8458fdc86665b"
        actual_md5 = hashlib.md5(self.model_path.read_bytes()).hexdigest()
        self.assertEqual(actual_md5, expected_md5, "CatBoost model artifact was altered!")
        self.assertEqual(len(self.model.feature_names_), 30)

    def test_8_top_priority_customers_list(self):
        """Test 8: Priority customer list has 1,174 rows, ranked 1 to 1,174, with local SHAP drivers."""
        self.assertEqual(len(self.df_pri), 1174)
        self.assertEqual(list(self.df_pri["rank"]), list(range(1, 1175)))
        self.assertFalse(self.df_pri["top_driver_1"].isna().any())
        self.assertFalse(self.df_pri["top_driver_2"].isna().any())
        self.assertFalse(self.df_pri["top_driver_3"].isna().any())
        # Priority score strictly non-increasing
        self.assertTrue(self.df_pri["priority_score"].is_monotonic_decreasing)

    def test_9_temporal_monitoring_summary(self):
        """Test 9: Temporal summary table has 5 snapshots and risk counts sum to total customers."""
        self.assertEqual(len(self.df_temp), 5)
        for _, r in self.df_temp.iterrows():
            tot = r["total_customers"]
            risk_sum = r["critical_risk_count"] + r["high_risk_count"] + r["medium_risk_count"] + r["low_risk_count"]
            self.assertEqual(tot, risk_sum)
            pred_churn = r["predicted_churn_count"]
            self.assertEqual(pred_churn, r["critical_risk_count"] + r["high_risk_count"])

    def test_10_calibration_report_validity(self):
        """Test 10: Calibration review table has 10 bins and customer counts sum to 1,174."""
        self.assertEqual(len(self.df_cal), 10)
        tot_cal = self.df_cal["customer_count"].sum()
        self.assertEqual(tot_cal, 1174)
        self.assertFalse(self.df_cal["observed_churn_rate"].isna().any())

    def test_11_sensitivity_analysis_artifact(self):
        """Test 11: Sensitivity analysis table exists and contains 3 pairwise scenario comparisons."""
        self.assertEqual(len(self.df_sens), 3)
        for _, r in self.df_sens.iterrows():
            self.assertGreater(r["spearman_rank_correlation"], 0.50)
            self.assertGreaterEqual(r["top_10_overlap_pct"], 50.0)

    def test_12_powerbi_dataset_grain_and_cleanliness(self):
        """Test 12: Power BI dataset has 5,502 rows, zero duplicate keys, and complete dimensions."""
        self.assertEqual(len(self.df_pbi), 5502)
        dups = self.df_pbi.duplicated(subset=["AccountObjectCode", "snapshot_date"]).sum()
        self.assertEqual(dups, 0)
        self.assertIn("priority_score", self.df_pbi.columns)
        self.assertIn("recommended_action", self.df_pbi.columns)
        self.assertIn("top_driver_1", self.df_pbi.columns)

if __name__ == "__main__":
    unittest.main(verbosity=2)
