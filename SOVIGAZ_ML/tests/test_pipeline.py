"""
SOVIGAZ Data Pipeline Unit Tests (Phase 2)
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

from config.config import PROCESSED_DATA_DIR, RAW_DATA_DIR

class TestDataPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.sales_path = PROCESSED_DATA_DIR / "processed_sales.parquet"
        if not cls.sales_path.exists():
            raise FileNotFoundError(f"Processed sales file missing at: {cls.sales_path}. Run pipeline_runner.py first.")
        cls.df_sales = pd.read_parquet(cls.sales_path)
        cls.cust_dim = pd.read_csv(RAW_DATA_DIR / "Dim_Customer.csv", usecols=["AccountObjectCode"])
        cls.prod_dim = pd.read_csv(RAW_DATA_DIR / "Dim_Products.csv", usecols=["InventoryItemCode_New"])

    def test_no_duplicate_transaction(self):
        """Assures 0 duplicate transactions exist in processed sales."""
        dup_count = self.df_sales.duplicated().sum()
        self.assertEqual(dup_count, 0, f"Found {dup_count} duplicate rows in processed_sales.parquet!")

    def test_no_join_explosion(self):
        """Assures dimension joins did not cause join explosion."""
        rep_path = PROJECT_ROOT / "reports" / "join_validation_report.csv"
        self.assertTrue(rep_path.exists(), "join_validation_report.csv is missing!")
        df_rep = pd.read_csv(rep_path)
        for _, r in df_rep.iterrows():
            self.assertFalse(r["join_explosion_flag"], f"Join explosion flag is TRUE for dimension {r['dimension']}!")

    def test_dates_valid(self):
        """Assures RefDate has no nulls and is within valid operational boundaries."""
        self.assertEqual(self.df_sales["RefDate"].isna().sum(), 0, "Found NaT in RefDate!")
        min_date = self.df_sales["RefDate"].min()
        max_date = self.df_sales["RefDate"].max()
        self.assertGreaterEqual(pd.to_datetime(min_date), pd.to_datetime("2023-01-01"))
        self.assertLessEqual(pd.to_datetime(max_date), pd.to_datetime("2026-06-30"))

    def test_customer_key_integrity(self):
        """Assures customer key match rate >= 99%."""
        dim_custs = set(self.cust_dim["AccountObjectCode"].dropna().str.strip().unique())
        sales_custs = set(self.df_sales["AccountObjectCode"].dropna().str.strip().unique())
        overlap = sales_custs.intersection(dim_custs)
        match_rate = len(overlap) / len(sales_custs) * 100
        self.assertGreaterEqual(match_rate, 99.0, f"Customer match rate {match_rate:.2f}% is below 99%!")

    def test_product_key_integrity(self):
        """Assures product key match rate is 100%."""
        dim_prods = set(self.prod_dim["InventoryItemCode_New"].dropna().str.strip().unique())
        sales_prods = set(self.df_sales["InventoryItemCode_New"].dropna().str.strip().unique())
        unmatched = sales_prods - dim_prods
        self.assertEqual(len(unmatched), 0, f"Found {len(unmatched)} unmatched product codes in sales!")

if __name__ == "__main__":
    unittest.main()
