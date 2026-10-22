"""
SOVIGAZ Data Loader Module (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import Dict, Tuple, Optional
import pandas as pd
import numpy as np

# Ensure root in path
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import RAW_DATA_DIR, PROCESSED_DATA_DIR
from src.utils.logger import setup_logger

logger = setup_logger("DataLoader", log_filename="data_pipeline.log")

REQUIRED_SALES_COLUMNS = [
    "RefNo", "RefDate", "PostedDate", "AccountObjectCode", 
    "InventoryItemCode_New", "InventoryItemName", "Revenue", 
    "SaleAmount", "UnitPrice", "MainQuantity", "MainConvertRate", "RefTypeName"
]

REQUIRED_CUSTOMER_COLUMNS = [
    "AccountObjectCode", "CustomerName", "StockCode"
]

REQUIRED_PRODUCT_COLUMNS = [
    "InventoryItemCode_New", "InventoryItemName", 
    "InventoryItemCategoryName", "Excel_Category_Name"
]

def load_sales_raw(file_path: Optional[Path] = None) -> pd.DataFrame:
    """
    Loads raw sales transaction ledger safely with optimized dtypes and date parsing.
    """
    path = file_path or (RAW_DATA_DIR / "DM_RevenueBySaleLedger.csv")
    if not path.exists():
        raise FileNotFoundError(f"Sales file not found at: {path}")

    logger.info(f"Loading raw sales from {path.name}...")
    
    # Specify dtype mapping for memory optimization
    dtype_map = {
        "RefNo": "string",
        "AccountObjectCode": "string",
        "InventoryItemCode": "string",
        "InventoryItemCode_New": "string",
        "InventoryItemName": "string",
        "AccountObjectNameDI": "string",
        "RefTypeName": "string",
        "Revenue": "float64",
        "SaleAmount": "float64",
        "UnitPrice": "float64",
        "ReceiptAmount": "float64",
        "VATAmount": "float64",
        "MainUnitPrice": "float64",
        "MainConvertRate": "float64",
        "MainQuantity": "float64",
    }

    df = pd.read_csv(
        path,
        dtype=dtype_map,
        low_memory=False,
        encoding="utf-8"
    )

    # Check required columns
    missing = [c for c in REQUIRED_SALES_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Sales table is missing required columns: {missing}")

    # Parse dates safely
    df["RefDate"] = pd.to_datetime(df["RefDate"], errors="coerce")
    df["PostedDate"] = pd.to_datetime(df["PostedDate"], errors="coerce")

    # Drop rows where RefDate is NaT (invalid date)
    invalid_dates = df["RefDate"].isna().sum()
    if invalid_dates > 0:
        logger.warning(f"Found {invalid_dates} rows with invalid RefDate. Dropping them.")
        df = df.dropna(subset=["RefDate"]).reset_index(drop=True)

    logger.info(f"Loaded raw sales: {len(df):,} rows, {df.shape[1]} columns. Date range: {df['RefDate'].min()} -> {df['RefDate'].max()}")
    return df

def load_dimensions(raw_dir: Optional[Path] = None) -> Dict[str, pd.DataFrame]:
    """
    Loads and standardizes key dimension tables: Customer, Products, Stock, Date.
    """
    base_dir = raw_dir or RAW_DATA_DIR
    logger.info("Loading dimension tables...")

    # 1. Dim_Customer
    cust_path = base_dir / "Dim_Customer.csv"
    df_cust = pd.read_csv(cust_path, low_memory=False, encoding="utf-8")
    missing_cust = [c for c in REQUIRED_CUSTOMER_COLUMNS if c not in df_cust.columns]
    if missing_cust:
        raise ValueError(f"Dim_Customer missing columns: {missing_cust}")
    
    # Clean customer keys
    df_cust["AccountObjectCode"] = df_cust["AccountObjectCode"].astype(str).str.strip()
    df_cust["CustomerName"] = df_cust["CustomerName"].astype(str).str.strip()
    df_cust["StockCode"] = df_cust["StockCode"].astype(str).str.strip()
    # Deduplicate Customer PK
    df_cust = df_cust.drop_duplicates(subset=["AccountObjectCode"]).reset_index(drop=True)

    # 2. Dim_Products
    prod_path = base_dir / "Dim_Products.csv"
    df_prod = pd.read_csv(prod_path, low_memory=False, encoding="utf-8")
    missing_prod = [c for c in REQUIRED_PRODUCT_COLUMNS if c not in df_prod.columns]
    if missing_prod:
        raise ValueError(f"Dim_Products missing columns: {missing_prod}")

    df_prod["InventoryItemCode_New"] = df_prod["InventoryItemCode_New"].astype(str).str.strip()
    df_prod = df_prod.drop_duplicates(subset=["InventoryItemCode_New"]).reset_index(drop=True)

    # 3. Dim_Stock
    stock_path = base_dir / "Dim_Stock.csv"
    df_stock = pd.read_csv(stock_path, low_memory=False, encoding="utf-8")
    df_stock["StockCode"] = df_stock["StockCode"].astype(str).str.strip()
    df_stock = df_stock.drop_duplicates(subset=["StockCode"]).reset_index(drop=True)

    # 4. Dim_Date
    date_path = base_dir / "Dim_Date.csv"
    df_date = pd.read_csv(date_path, low_memory=False, encoding="utf-8")
    df_date["Date"] = pd.to_datetime(df_date["Date"], errors="coerce")

    dims = {
        "customer": df_cust,
        "product": df_prod,
        "stock": df_stock,
        "date": df_date
    }
    logger.info(f"Dimensions loaded: Customer ({len(df_cust):,} rows), Product ({len(df_prod):,} rows), Stock ({len(df_stock):,} rows), Date ({len(df_date):,} rows)")
    return dims

def load_debt_tables(raw_dir: Optional[Path] = None) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Loads debt and debit analytics tables.
    """
    base_dir = raw_dir or RAW_DATA_DIR
    logger.info("Loading debt tables...")

    analytics_path = base_dir / "Fact_AnalyticsDebit.csv"
    df_analytics = pd.read_csv(analytics_path, low_memory=False, encoding="utf-8")
    df_analytics["AccountObjectCode"] = df_analytics["AccountObjectCode"].astype(str).str.strip()

    summary_debt_path = base_dir / "DM_AccountObjectDebt.csv"
    df_summary_debt = pd.read_csv(summary_debt_path, low_memory=False, encoding="utf-8")
    df_summary_debt["AccountObjectCode"] = df_summary_debt["AccountObjectCode"].astype(str).str.strip()

    logger.info(f"Debt tables loaded: Fact_AnalyticsDebit ({len(df_analytics):,} rows), DM_AccountObjectDebt ({len(df_summary_debt):,} rows)")
    return df_analytics, df_summary_debt
