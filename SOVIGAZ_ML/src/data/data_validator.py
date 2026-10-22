"""
SOVIGAZ Data Validator & Cleaning Pipeline (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import Dict, Tuple
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import REPORTS_DIR, PROCESSED_DATA_DIR
from src.utils.logger import setup_logger

logger = setup_logger("DataValidator", log_filename="data_pipeline.log")

def audit_and_clean_duplicates(df_sales: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Audits exact duplicate rows in sales transaction ledger, exports duplicate_audit.csv,
    and removes duplicates safely.
    """
    logger.info("Executing B1: Duplicate Rows Audit...")
    before_rows = len(df_sales)
    
    # Identify duplicate rows based on core business transaction columns
    cols_check = [
        "RefNo", "RefDate", "PostedDate", "AccountObjectCode", "InventoryItemCode_New",
        "InventoryItemName", "Revenue", "SaleAmount", "UnitPrice", "MainQuantity",
        "MainConvertRate", "RefTypeName"
    ]
    avail_check = [c for c in cols_check if c in df_sales.columns]
    
    dup_mask = df_sales.duplicated(subset=avail_check, keep=False)
    dup_rows = df_sales[dup_mask].copy()
    num_dup_rows = len(dup_rows)
    
    logger.info(f"Duplicate check: Found {num_dup_rows} rows involved in duplication on business transaction keys.")
    
    if num_dup_rows > 0:
        # Group duplicates for audit report
        dup_summary = dup_rows.groupby(avail_check).size().reset_index(name="duplicate_occurrences")
        dup_summary["rows_to_remove"] = dup_summary["duplicate_occurrences"] - 1
        
        # Export duplicate_audit.csv
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        audit_path = REPORTS_DIR / "duplicate_audit.csv"
        dup_summary.to_csv(audit_path, index=False, encoding="utf-8-sig")
        logger.info(f"Saved duplicate audit report to: {audit_path}")
        
        # Perform safe drop_duplicates on business keys
        df_cleaned = df_sales.drop_duplicates(subset=avail_check).reset_index(drop=True)
        removed_rows = before_rows - len(df_cleaned)
        logger.info(f"Duplicates removed: {removed_rows:,} rows. Before: {before_rows:,}, After: {len(df_cleaned):,}")
    else:
        dup_summary = pd.DataFrame()
        df_cleaned = df_sales.copy()
        logger.info("No duplicates found.")

    return df_cleaned, dup_summary

def apply_data_quality_flags(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies explicit business quality flags without deleting records.
    - is_sales_return: negative revenue due to customer return
    - is_credit_adjustment: negative revenue due to accounting discount/adjustment
    - is_negative_unit_price: erroneous negative price flag
    - is_zero_revenue: zero-value transaction (loan/promotional item)
    """
    logger.info("Executing B2 & B3: Data Quality Flagging...")
    df = df.copy()

    ref_type = df["RefTypeName"].fillna("").astype(str).str.lower()
    
    # Return transactions
    df["flag_sales_return"] = ref_type.str.contains("trả lại|bị trả", regex=True)
    
    # Accounting adjustments / discounts
    df["flag_accounting_adjustment"] = (df["Revenue"] < 0) & (~df["flag_sales_return"])
    
    # Negative unit price
    df["flag_invalid_unit_price"] = df["UnitPrice"] < 0
    
    # Zero revenue
    df["flag_zero_revenue"] = df["Revenue"] == 0

    # Summary
    logger.info(f"Quality Flags Summary:")
    logger.info(f"  - Sales Returns: {df['flag_sales_return'].sum():,} rows")
    logger.info(f"  - Credit Adjustments: {df['flag_accounting_adjustment'].sum():,} rows")
    logger.info(f"  - Invalid Unit Price (<0): {df['flag_invalid_unit_price'].sum():,} rows")
    logger.info(f"  - Zero Revenue: {df['flag_zero_revenue'].sum():,} rows")

    return df

def validate_and_join_dimensions(df_sales: pd.DataFrame, dims: Dict[str, pd.DataFrame]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Joins Sales with Customer, Product, Stock, and Date dimensions.
    Strictly asserts that row count does NOT increase (No Join Explosion).
    Exports join_validation_report.csv.
    """
    logger.info("Executing PHẦN C: Dimension Join Validation...")
    before_rows = len(df_sales)
    join_reports = []

    # 1. Join Dim_Customer
    df_cust = dims["customer"][["AccountObjectCode", "CustomerName", "StockCode"]].copy()
    df_cust = df_cust.rename(columns={"StockCode": "CustomerStockCode"})
    
    # Check duplicate keys in Customer
    cust_dup_keys = df_cust["AccountObjectCode"].duplicated().sum()
    
    m_cust = df_sales.merge(df_cust, on="AccountObjectCode", how="left")
    after_cust_rows = len(m_cust)
    unmatched_cust = m_cust["CustomerName"].isna().sum()

    join_reports.append({
        "dimension": "Dim_Customer",
        "join_key": "AccountObjectCode",
        "before_rows": before_rows,
        "after_rows": after_cust_rows,
        "unmatched_rows": unmatched_cust,
        "unmatched_pct": round(unmatched_cust / before_rows * 100, 2),
        "duplicate_dimension_keys": cust_dup_keys,
        "join_explosion_flag": after_cust_rows > before_rows
    })

    if after_cust_rows > before_rows:
        logger.error(f"FATAL: Join explosion on Dim_Customer! {before_rows} -> {after_cust_rows}")
        raise ValueError("Join explosion on Dim_Customer detected!")

    # 2. Join Dim_Products
    df_prod = dims["product"][[
        "InventoryItemCode_New", "InventoryItemCategoryName", "Excel_Category_Name"
    ]].copy()
    prod_dup_keys = df_prod["InventoryItemCode_New"].duplicated().sum()

    m_prod = m_cust.merge(df_prod, on="InventoryItemCode_New", how="left")
    after_prod_rows = len(m_prod)
    unmatched_prod = m_prod["Excel_Category_Name"].isna().sum()

    join_reports.append({
        "dimension": "Dim_Products",
        "join_key": "InventoryItemCode_New",
        "before_rows": after_cust_rows,
        "after_rows": after_prod_rows,
        "unmatched_rows": unmatched_prod,
        "unmatched_pct": round(unmatched_prod / after_cust_rows * 100, 2),
        "duplicate_dimension_keys": prod_dup_keys,
        "join_explosion_flag": after_prod_rows > after_cust_rows
    })

    if after_prod_rows > after_cust_rows:
        logger.error(f"FATAL: Join explosion on Dim_Products! {after_cust_rows} -> {after_prod_rows}")
        raise ValueError("Join explosion on Dim_Products detected!")

    # Export join_validation_report.csv
    df_join_report = pd.DataFrame(join_reports)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / "join_validation_report.csv"
    df_join_report.to_csv(report_path, index=False, encoding="utf-8-sig")
    logger.info(f"Saved join validation report to: {report_path}")

    # Standardize Branch / Stock column
    # If CustomerStockCode is available, use it; otherwise extract from RefNo prefix
    m_prod["BranchCode"] = m_prod["CustomerStockCode"].fillna(
        m_prod["RefNo"].astype(str).str.extract(r"^([A-Z]{2})", expand=False)
    ).fillna("OTHER")

    # Final assert: strictly 1 row = 1 transaction
    assert len(m_prod) == before_rows, f"Join row mismatch: before={before_rows}, after={len(m_prod)}"
    logger.info(f"SUCCESS: Dimension join validated. Final rows: {len(m_prod):,} (1:1 preserved).")

    return m_prod, df_join_report

def save_processed_sales(df: pd.DataFrame) -> Path:
    """
    Saves clean, joined sales ledger to processed_sales.parquet.
    """
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DATA_DIR / "processed_sales.parquet"
    logger.info(f"Saving processed sales to {out_path}...")
    
    # Select clean columns
    cols_to_save = [
        "RefNo", "RefDate", "PostedDate", "AccountObjectCode", "CustomerName",
        "BranchCode", "InventoryItemCode_New", "InventoryItemName", 
        "InventoryItemCategoryName", "Excel_Category_Name", "Revenue", 
        "SaleAmount", "UnitPrice", "MainQuantity", "MainConvertRate",
        "RefTypeName", "flag_sales_return", "flag_accounting_adjustment",
        "flag_invalid_unit_price", "flag_zero_revenue"
    ]
    avail_cols = [c for c in cols_to_save if c in df.columns]
    df_to_save = df[avail_cols].copy()

    # Convert object dtypes to categories where appropriate
    cat_cols = ["BranchCode", "Excel_Category_Name", "InventoryItemCategoryName", "RefTypeName"]
    for col in cat_cols:
        if col in df_to_save.columns:
            df_to_save[col] = df_to_save[col].astype("category")

    # Deduplicate across processed transaction columns
    before_p = len(df_to_save)
    df_to_save = df_to_save.drop_duplicates().reset_index(drop=True)
    if len(df_to_save) < before_p:
        logger.info(f"Deduplicated across processed columns: removed {before_p - len(df_to_save)} residual duplicate rows.")

    df_to_save.to_parquet(out_path, index=False, engine="pyarrow")
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    logger.info(f"Saved processed_sales.parquet ({size_mb:.2f} MB, {len(df_to_save):,} rows).")
    return out_path
