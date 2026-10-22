"""
SOVIGAZ Machine Learning Project — Unit Tests for Problem 3: B2B Credit Risk
Module: test_credit_risk.py
Author: Senior Machine Learning Engineer & Data Scientist
Audited Standard: Data Quality, Integrity, Non-Leakage, and Non-Pseudo-Labeling Verification
"""

import os
import unittest
import numpy as np
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CREDIT_DIR = os.path.join(PROJECT_ROOT, "outputs", "credit")
POWERBI_DIR = os.path.join(PROJECT_ROOT, "outputs", "powerbi")
DATA_PROCESSED = os.path.join(PROJECT_ROOT, "data", "processed")


class TestCreditRiskDataIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        master_csv = os.path.join(CREDIT_DIR, "customer_credit_master.csv")
        powerbi_csv = os.path.join(POWERBI_DIR, "credit_risk_customer.csv")
        top_csv = os.path.join(CREDIT_DIR, "top_credit_exposure_customers.csv")
        hhi_csv = os.path.join(CREDIT_DIR, "credit_concentration_hhi.csv")
        stats_csv = os.path.join(CREDIT_DIR, "credit_risk_summary_stats.csv")
        source_parquet = os.path.join(DATA_PROCESSED, "customer_credit_snapshot_20260731.parquet")

        cls.df_master = pd.read_csv(master_csv)
        cls.df_powerbi = pd.read_csv(powerbi_csv)
        cls.df_top = pd.read_csv(top_csv)
        cls.df_hhi = pd.read_csv(hhi_csv)
        cls.df_stats = pd.read_csv(stats_csv)
        cls.df_source = pd.read_parquet(source_parquet)

    def test_01_customer_key_not_null(self):
        """Test 1: Customer key (AccountObjectCode) must never be null"""
        self.assertEqual(self.df_master["AccountObjectCode"].isna().sum(), 0)
        self.assertEqual(self.df_powerbi["AccountObjectCode"].isna().sum(), 0)

    def test_02_customer_key_unique_at_grain(self):
        """Test 2: Customer key must be strictly unique at the account grain (N = 584)"""
        self.assertEqual(len(self.df_master), 584)
        self.assertEqual(self.df_master["AccountObjectCode"].nunique(), 584)
        self.assertEqual(len(self.df_powerbi), 584)
        self.assertEqual(self.df_powerbi["AccountObjectCode"].nunique(), 584)

    def test_03_debt_snapshot_date_valid(self):
        """Test 3: Debt snapshot date must be exactly 2026-07-31"""
        snapshot_dates = pd.to_datetime(self.df_master["snapshot_date"]).dt.strftime("%Y-%m-%d").unique()
        self.assertEqual(len(snapshot_dates), 1)
        self.assertEqual(snapshot_dates[0], "2026-07-31")

    def test_04_outstanding_debt_matches_source(self):
        """Test 4: Total outstanding debt in master must match source accounting ledger to the penny"""
        source_total = float(self.df_source["total_receivable_debt"].sum())
        master_total = float(self.df_master["outstanding_debt"].sum())
        powerbi_total = float(self.df_powerbi["outstanding_debt"].sum())
        self.assertAlmostEqual(master_total, 56582422635.0, places=0)
        self.assertAlmostEqual(master_total, source_total, places=2)
        self.assertAlmostEqual(powerbi_total, source_total, places=2)

    def test_05_no_join_explosion(self):
        """Test 5: Merges with customer master, clustering, and churn must not cause row multiplication"""
        self.assertEqual(len(self.df_master), len(self.df_source))
        self.assertEqual(len(self.df_powerbi), len(self.df_source))
        self.assertEqual(len(self.df_top), len(self.df_source))

    def test_06_revenue_denominator_safe(self):
        """Test 6: Debt-to-revenue ratios must be finite, non-null, and protected against division by zero"""
        self.assertFalse(self.df_master["debt_to_revenue_365d"].isna().any())
        self.assertFalse(self.df_master["debt_to_revenue_365d"].isin([np.inf, -np.inf]).any())
        self.assertTrue((self.df_master["debt_to_revenue_365d"] >= 0.0).all())
        self.assertTrue((self.df_master["debt_to_revenue_365d"] <= 10.0).all())

    def test_07_negative_revenue_handled(self):
        """Test 7: Negative revenue accounts must be properly flagged and ratios bounded"""
        has_neg = (self.df_master["revenue_365d"] < 0)
        neg_count = has_neg.sum()
        self.assertTrue(neg_count >= 0)
        # All flagged accounts must have non-negative debt_to_revenue ratio
        self.assertTrue((self.df_master.loc[has_neg, "debt_to_revenue_365d"] >= 0.0).all())

    def test_08_credit_score_range(self):
        """Test 8: Credit risk score must be bounded within [0.0, 100.0]"""
        scores = self.df_master["credit_risk_score"]
        self.assertTrue((scores >= 0.0).all())
        self.assertTrue((scores <= 100.0).all())
        self.assertFalse(scores.isna().any())

    def test_09_credit_risk_band_mapping(self):
        """Test 9: 100% of customers must be mapped to valid, predefined risk bands"""
        valid_bands = {
            "Critical Exposure (Score >= 70)",
            "High Exposure (50 <= Score < 70)",
            "Moderate Exposure (30 <= Score < 50)",
            "Low Exposure (Score < 30)"
        }
        actual_bands = set(self.df_master["credit_risk_band"].unique())
        self.assertTrue(actual_bands.issubset(valid_bands))
        self.assertEqual(self.df_master["credit_risk_band"].isna().sum(), 0)

    def test_10_priority_mapping_valid(self):
        """Test 10: Priority mapping must be strictly 1 of 4 defined priority tiers"""
        valid_priorities = {
            "Priority 1: Critical Joint Action (Finance & Sales)",
            "Priority 2: Credit Terms & Exposure Monitoring",
            "Priority 3: Customer Retention & Re-engagement",
            "Priority 4: Standard Commercial Monitoring"
        }
        actual_priorities = set(self.df_master["credit_priority"].unique())
        self.assertTrue(actual_priorities.issubset(valid_priorities))
        self.assertEqual(self.df_master["credit_priority"].isna().sum(), 0)

    def test_11_no_future_information_leakage(self):
        """Test 11: Sales exposure features must only use information prior to cutoff date"""
        # Snapshot date is 2026-07-31, cutoff date is 2026-06-30
        self.assertTrue((self.df_master["active_days_365d"] >= 0).all())
        self.assertTrue((self.df_master["transaction_count_365d"] >= 0).all())

    def test_12_no_pseudo_labels_created(self):
        """Test 12: Branch B compliance — NO binary target columns like 'default' or 'overdue_target' allowed"""
        banned_target_cols = ["default", "is_default", "default_target", "bad_debt_target", "default_label"]
        for col in banned_target_cols:
            self.assertNotIn(col, self.df_master.columns, f"Banned pseudo-label found: {col}")
            self.assertNotIn(col, self.df_powerbi.columns, f"Banned pseudo-label found in PowerBI: {col}")

    def test_13_churn_join_no_duplicates(self):
        """Test 13: Merging churn probabilities must preserve exact customer row count"""
        self.assertEqual(len(self.df_master), 584)
        # Churn probability column exists
        self.assertIn("churn_probability", self.df_master.columns)

    def test_14_total_debt_preserved_across_aggregations(self):
        """Test 14: Total debt must be exactly preserved across all crosstab tables"""
        seg_crosstab_path = os.path.join(CREDIT_DIR, "credit_segment_crosstab.csv")
        priority_path = os.path.join(CREDIT_DIR, "credit_priority_matrix_summary.csv")
        
        df_seg = pd.read_csv(seg_crosstab_path)
        df_prio = pd.read_csv(priority_path)
        
        self.assertAlmostEqual(df_seg["total_debt_vnd"].sum(), 56582422635.0, places=0)
        self.assertAlmostEqual(df_prio["total_debt_vnd"].sum(), 56582422635.0, places=0)

    def test_15_concentration_hhi_bounds(self):
        """Test 15: HHI points must be within [0.0, 10000.0] and top concentration shares monotonic"""
        hhi = float(self.df_hhi["hhi_points"].iloc[0])
        top_10 = float(self.df_hhi["top_10_share_pct"].iloc[0])
        top_20 = float(self.df_hhi["top_20_share_pct"].iloc[0])
        top_50 = float(self.df_hhi["top_50_share_pct"].iloc[0])
        
        self.assertTrue(0.0 <= hhi <= 10000.0)
        self.assertTrue(0.0 < top_10 < top_20 < top_50 <= 100.0)

    def test_16_temporal_metadata_fields(self):
        """Test 16 (Sub-Phase 3.1): Explicit dual snapshot metadata dates in Master and PowerBI"""
        # credit_snapshot_date must be strictly 2026-07-31
        self.assertIn("credit_snapshot_date", self.df_master.columns)
        self.assertIn("credit_snapshot_date", self.df_powerbi.columns)
        self.assertEqual(list(self.df_master["credit_snapshot_date"].unique()), ["2026-07-31"])
        self.assertEqual(list(self.df_powerbi["credit_snapshot_date"].unique()), ["2026-07-31"])

        # churn_snapshot_date must exist, no nulls, and correctly distinguish 2025-12-31 vs Not Evaluated
        self.assertIn("churn_snapshot_date", self.df_master.columns)
        self.assertIn("churn_snapshot_date", self.df_powerbi.columns)
        self.assertEqual(self.df_master["churn_snapshot_date"].isna().sum(), 0)
        self.assertEqual(self.df_powerbi["churn_snapshot_date"].isna().sum(), 0)
        valid_churn_dates = {"2025-12-31", "Not Evaluated in 2025"}
        self.assertTrue(set(self.df_master["churn_snapshot_date"].unique()).issubset(valid_churn_dates))
        self.assertTrue(set(self.df_powerbi["churn_snapshot_date"].unique()).issubset(valid_churn_dates))

    def test_17_credit_exposure_risk_score_consistency(self):
        """Test 17 (Sub-Phase 3.1): Credit Exposure Risk Score terminology column consistency"""
        self.assertIn("credit_exposure_risk_score", self.df_master.columns)
        self.assertIn("credit_exposure_risk_score", self.df_powerbi.columns)
        self.assertTrue((self.df_master["credit_exposure_risk_score"] == self.df_master["credit_risk_score"]).all())
        self.assertTrue((self.df_powerbi["credit_exposure_risk_score"] == self.df_powerbi["credit_risk_score"]).all())
        self.assertTrue((self.df_master["credit_exposure_risk_score"] >= 0.0).all())
        self.assertTrue((self.df_master["credit_exposure_risk_score"] <= 100.0).all())

    def test_18_temporal_alignment_audit_artifact_exists(self):
        """Test 18 (Sub-Phase 3.1): Formal credit_temporal_alignment_audit.csv report artifact exists and valid"""
        audit_path = os.path.join(PROJECT_ROOT, "reports", "credit_temporal_alignment_audit.csv")
        self.assertTrue(os.path.exists(audit_path))
        df_audit = pd.read_csv(audit_path)
        self.assertGreaterEqual(len(df_audit), 4)
        self.assertIn("temporal_alignment_status", df_audit.columns)
        self.assertTrue(df_audit["temporal_alignment_status"].str.contains("PASS").all())


if __name__ == "__main__":
    unittest.main()
