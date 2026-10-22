"""
SOVIGAZ Unit Tests for Sub-Phase 4A & 4A.1: RFM Snapshot Engineering & Pre-Clustering Audit
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""
import sys
from pathlib import Path
import unittest
import numpy as np
import pandas as pd

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import PROCESSED_DATA_DIR, OUTPUTS_DIR, REPORTS_DIR

class TestRFMSnapshotPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.cust_dir = OUTPUTS_DIR / "customer_segmentation"
        cls.churn_dir = OUTPUTS_DIR / "churn"
        cls.fig_dir = OUTPUTS_DIR / "figures" / "customer"

        rfm_panel_path = cls.cust_dir / "rfm_snapshot.parquet"
        if not rfm_panel_path.exists():
            raise FileNotFoundError(f"Missing rfm_snapshot.parquet at {rfm_panel_path}")
        cls.df_panel = pd.read_parquet(rfm_panel_path)

        rfm_primary_path = cls.cust_dir / "rfm_segmentation_primary.parquet"
        if not rfm_primary_path.exists():
            raise FileNotFoundError(f"Missing rfm_segmentation_primary.parquet at {rfm_primary_path}")
        cls.df_primary = pd.read_parquet(rfm_primary_path)

        cls.df_sales = pd.read_parquet(PROCESSED_DATA_DIR / "processed_sales.parquet")
        cls.df_sales["RefDate"] = pd.to_datetime(cls.df_sales["RefDate"])

    # ---------------------------------------------------------
    # 1. CRITICAL AUDIT: FREQUENCY DEFINITION
    # ---------------------------------------------------------
    def test_frequency_uses_distinct_refno(self):
        """Test 1 (Finding Verification): RFM Frequency must equal COUNT(DISTINCT RefNo), not raw row count."""
        t = pd.to_datetime("2025-12-31")
        w365_start = t - pd.Timedelta(days=365)
        w365_sales = self.df_sales[(self.df_sales["RefDate"] <= t) & (self.df_sales["RefDate"] > w365_start)]

        # Sample test customer with known multi-product invoices: BDNB2
        c_code = "BDNB2"
        c_sales = w365_sales[w365_sales["AccountObjectCode"] == c_code]
        expected_distinct_refno = c_sales["RefNo"].nunique()
        raw_row_count = len(c_sales)

        # Ensure raw row count != distinct RefNo for BDNB2 (proof of multi-line invoice)
        self.assertNotEqual(raw_row_count, expected_distinct_refno, "BDNB2 was expected to have multi-line invoices!")

        # Verify primary dataset frequency matches distinct RefNo
        actual_freq = self.df_primary.loc[self.df_primary["AccountObjectCode"] == c_code, "frequency_365d"].values[0]
        self.assertEqual(actual_freq, expected_distinct_refno, 
                         f"Frequency must be COUNT(DISTINCT RefNo) = {expected_distinct_refno}, but got {actual_freq}!")

    # ---------------------------------------------------------
    # 2. PRIMARY SEGMENTATION POPULATION INTEGRITY
    # ---------------------------------------------------------
    def test_primary_segmentation_has_unique_customer(self):
        """Test 2: Exactly 1 row per unique customer (no pseudo-replication) in primary segmentation."""
        unique_custs = self.df_primary["AccountObjectCode"].nunique()
        total_rows = len(self.df_primary)
        self.assertEqual(unique_custs, total_rows, 
                         f"Primary segmentation must have 1 row per customer! Unique: {unique_custs}, Rows: {total_rows}")

    def test_primary_segmentation_snapshot_is_2025_12_31(self):
        """Test 3: Primary segmentation population must strictly belong to snapshot_date 2025-12-31."""
        snapshots = set(self.df_primary["snapshot_date"].unique())
        self.assertEqual(snapshots, {"2025-12-31"}, f"Unexpected snapshot dates in primary segmentation: {snapshots}")

    # ---------------------------------------------------------
    # 3. OBSERVATION WINDOW & BOUNDARY VERIFICATION
    # ---------------------------------------------------------
    def test_rfm_observation_window_365d(self):
        """Test 4: Verify 365d window strictly spans (T - 365d, T] = [2025-01-01, 2025-12-31]."""
        t = pd.to_datetime("2025-12-31")
        w_start = t - pd.Timedelta(days=365)
        # T (2025-12-31) must be included
        tx_on_t = (self.df_sales["RefDate"] == t).sum()
        self.assertGreater(tx_on_t, 0, "Expected transactions on snapshot date T (2025-12-31)")

        # T - 365d (2024-12-31) must be excluded from w365
        w365_sales = self.df_sales[(self.df_sales["RefDate"] <= t) & (self.df_sales["RefDate"] > w_start)]
        tx_on_start = (w365_sales["RefDate"] == w_start).sum()
        self.assertEqual(tx_on_start, 0, "Transactions on T - 365d (2024-12-31) must be excluded from 365d window!")

    def test_rfm_no_future_transaction(self):
        """Test 5: Zero future data leakage: no transaction with RefDate > T is used in RFM features."""
        sample = self.df_primary.sample(50, random_state=42)
        t = pd.to_datetime("2025-12-31")
        for _, r in sample.iterrows():
            c = r["AccountObjectCode"]
            hist_c = self.df_sales[(self.df_sales["AccountObjectCode"] == c) & (self.df_sales["RefDate"] <= t)]
            expected_recency = (t - hist_c["RefDate"].max()).days
            self.assertEqual(r["recency_days"], expected_recency)

    def test_customer_eligibility_rule_consistent(self):
        """Test 6: All primary segmentation customers must satisfy >= 1 purchase in past 365 days."""
        min_freq = self.df_primary["frequency_365d"].min()
        self.assertGreaterEqual(min_freq, 1, f"Customer with 0 frequency found in primary cohort: {min_freq}")

    # ---------------------------------------------------------
    # 4. MULTI-SNAPSHOT PANEL INTEGRITY
    # ---------------------------------------------------------
    def test_panel_customer_key_not_null(self):
        """Test 7: Customer key AccountObjectCode is never null in panel."""
        null_count = self.df_panel["AccountObjectCode"].isna().sum()
        self.assertEqual(null_count, 0, f"Found {null_count} null customer keys in rfm_snapshot!")

    def test_panel_no_duplicate_customer_snapshot_key(self):
        """Test 8: Exactly 1 row per (AccountObjectCode, snapshot_date) in panel."""
        dup_count = self.df_panel.duplicated(subset=["AccountObjectCode", "snapshot_date"]).sum()
        self.assertEqual(dup_count, 0, f"Found {dup_count} duplicate customer-snapshot rows in panel!")

    def test_panel_expected_row_count(self):
        """Test 9: Total panel rows equals exactly 5,502 matching Phase 2 baseline."""
        self.assertEqual(len(self.df_panel), 5502, f"Expected 5,502 rows, got {len(self.df_panel)}")

    def test_panel_snapshots_preserved(self):
        """Test 10: All 5 canonical snapshots exist in panel."""
        expected_snapshots = {"2023-12-31", "2024-06-30", "2024-12-31", "2025-06-30", "2025-12-31"}
        actual_snapshots = set(self.df_panel["snapshot_date"].unique())
        self.assertEqual(actual_snapshots, expected_snapshots)

    def test_panel_churn_labels_binary(self):
        """Test 11: Churn labels 60d, 90d, 120d must be strictly binary {0, 1}."""
        for days in [60, 90, 120]:
            col = f"churn_target_{days}d"
            unique_vals = set(self.df_panel[col].unique())
            self.assertTrue(unique_vals.issubset({0, 1}), f"Non-binary values in {col}: {unique_vals}")

    # ---------------------------------------------------------
    # 5. NEGATIVE MONETARY HANDLING
    # ---------------------------------------------------------
    def test_negative_monetary_handled_properly(self):
        """Test 12: Negative monetary amounts must have log_monetary >= 0 and has_negative_revenue flag == 1."""
        neg_cases = self.df_panel[self.df_panel["monetary_365d"] < 0]
        self.assertGreater(len(neg_cases), 0, "Expected negative monetary cases in panel!")
        for _, r in neg_cases.iterrows():
            self.assertEqual(r["has_negative_revenue_365d"], 1)
            self.assertFalse(np.isnan(r["log_monetary_365d"]))
            self.assertGreaterEqual(r["log_monetary_365d"], 0.0)

    # ---------------------------------------------------------
    # 6. ARTIFACTS EXISTENCE
    # ---------------------------------------------------------
    def test_artifacts_exist(self):
        """Test 13: Verify all Sub-Phase 4A and 4A.1 artifacts exist on disk."""
        self.assertTrue((self.cust_dir / "rfm_snapshot.parquet").exists())
        self.assertTrue((self.cust_dir / "rfm_segmentation_primary.parquet").exists())
        self.assertTrue((self.cust_dir / "rfm_frequency_audit_comparison.csv").exists())
        self.assertTrue((self.cust_dir / "negative_monetary_audit.csv").exists())
        self.assertTrue((self.cust_dir / "rfm_summary_stats.csv").exists())
        self.assertTrue((self.cust_dir / "rfm_primary_summary_stats.csv").exists())
        self.assertTrue((self.cust_dir / "rfm_window_comparison.csv").exists())
        self.assertTrue((self.churn_dir / "churn_sensitivity_analysis.csv").exists())
        self.assertTrue((self.churn_dir / "churn_label_boundary_audit.csv").exists())
        self.assertTrue((REPORTS_DIR / "feature_leakage_matrix_4a.csv").exists())
        self.assertTrue((self.fig_dir / "01_rfm_distribution.png").exists())

if __name__ == "__main__":
    unittest.main(verbosity=2)
