"""
SOVIGAZ Unit Tests for Sub-Phase 4B: Customer Clustering & Validation
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

class TestCustomerClustering(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.cust_dir = OUTPUTS_DIR / "customer_segmentation"
        cls.fig_dir = OUTPUTS_DIR / "figures" / "customer"
        cls.models_dir = PROJECT_ROOT / "models"

        # Check required files
        cls.assign_path = cls.cust_dir / "cluster_assignments.csv"
        cls.profile_path = cls.cust_dir / "cluster_profiles.csv"
        cls.config_path = cls.models_dir / "cluster_config.json"
        cls.scaler_path = cls.models_dir / "rfm_scaler.joblib"
        cls.model_path = cls.models_dir / "best_clustering_model.joblib"

        if not cls.assign_path.exists():
            raise FileNotFoundError(f"Missing cluster_assignments.csv at {cls.assign_path}")
        cls.df_assignments = pd.read_csv(cls.assign_path)

        if not cls.profile_path.exists():
            raise FileNotFoundError(f"Missing cluster_profiles.csv at {cls.profile_path}")
        cls.df_profiles = pd.read_csv(cls.profile_path)

        with open(cls.config_path, "r", encoding="utf-8") as f:
            cls.config = json.load(f)

        cls.scaler = joblib.load(cls.scaler_path)
        cls.best_model = joblib.load(cls.model_path)
        cls.df_prim = pd.read_parquet(cls.cust_dir / "rfm_segmentation_primary.parquet")

    def test_cluster_assignment_count(self):
        """Test 1: Cluster assignment count must equal exactly 1,359 rows."""
        self.assertEqual(len(self.df_assignments), 1359, f"Expected 1,359 rows, got {len(self.df_assignments)}")

    def test_cluster_assignment_no_null(self):
        """Test 2: No null cluster assignments."""
        null_count = self.df_assignments["cluster_id"].isna().sum()
        self.assertEqual(null_count, 0, f"Found {null_count} null cluster assignments!")

    def test_each_customer_assigned_once(self):
        """Test 3: Each customer is assigned exactly once (no duplicates)."""
        unique_c = self.df_assignments["AccountObjectCode"].nunique()
        self.assertEqual(unique_c, 1359, f"Expected 1,359 unique customers, got {unique_c}")
        self.assertEqual(self.df_assignments["AccountObjectCode"].duplicated().sum(), 0)

    def test_cluster_k_matches_config(self):
        """Test 4: Number of unique clusters matches K specified in config."""
        k_config = self.config["K"]
        k_actual = self.df_assignments["cluster_id"].nunique()
        self.assertEqual(k_actual, k_config, f"Config K={k_config} != Actual K={k_actual}")

    def test_scaler_fitted_on_primary_only(self):
        """Test 5: RobustScaler center and scale match primary population medians and IQRs."""
        feat_cols = ["log_recency", "log_frequency_365d", "log_monetary_365d"]
        expected_centers = self.df_prim[feat_cols].median().values
        np.testing.assert_allclose(self.scaler.center_, expected_centers, rtol=1e-4,
                                   err_msg="Scaler was not fit on primary population!")

    def test_no_identifier_features(self):
        """Test 6: No identifier columns in clustering feature list."""
        banned = {"AccountObjectCode", "CustomerCode", "CustomerName", "BranchCode", "RefNo", "snapshot_date"}
        features_used = set(self.config["features"])
        intersect = banned.intersection(features_used)
        self.assertEqual(len(intersect), 0, f"Banned identifier features found in model features: {intersect}")

    def test_cluster_metric_output_exists(self):
        """Test 7: K-Means and GMM evaluation metric CSV outputs exist and have rows."""
        km_csv = self.cust_dir / "kmeans_metrics.csv"
        gmm_csv = self.cust_dir / "gmm_metrics.csv"
        self.assertTrue(km_csv.exists(), "Missing kmeans_metrics.csv")
        self.assertTrue(gmm_csv.exists(), "Missing gmm_metrics.csv")
        df_km = pd.read_csv(km_csv)
        df_gmm = pd.read_csv(gmm_csv)
        self.assertEqual(len(df_km), 7, f"Expected 7 K-Means evaluations (K=2..8), got {len(df_km)}")
        self.assertGreaterEqual(len(df_gmm), 14, f"Expected at least 14 GMM evaluations, got {len(df_gmm)}")

    def test_stability_output_exists(self):
        """Test 8: Cluster stability evaluation CSV exists and has ARI/NMI metrics."""
        stab_csv = self.cust_dir / "cluster_stability.csv"
        self.assertTrue(stab_csv.exists(), "Missing cluster_stability.csv")
        df_stab = pd.read_csv(stab_csv)
        self.assertTrue("mean_ari" in df_stab.columns)
        self.assertTrue("min_ari" in df_stab.columns)
        self.assertTrue("mean_nmi" in df_stab.columns)

    def test_primary_snapshot_only(self):
        """Test 9: All assignments in primary clustering strictly belong to snapshot 2025-12-31."""
        snapshots = set(self.df_assignments["snapshot_date"].unique())
        self.assertEqual(snapshots, {"2025-12-31"})

    def test_cluster_profile_reconciliation(self):
        """Test 10: Sum of customers across clusters in profile must equal exactly 1,359."""
        total_profile_cust = self.df_profiles["customers"].sum()
        self.assertEqual(total_profile_cust, 1359, f"Profile customers sum {total_profile_cust} != 1,359")

if __name__ == "__main__":
    unittest.main(verbosity=2)
