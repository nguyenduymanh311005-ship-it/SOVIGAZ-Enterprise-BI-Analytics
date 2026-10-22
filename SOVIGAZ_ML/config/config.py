"""
SOVIGAZ Machine Learning Project Configuration
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = PROJECT_ROOT.parent

RAW_DATA_DIR = WORKSPACE_ROOT / "Project Sovigaz" / "3. Phát triển ETL dữ liệu" / "Data ETL"
SOURCE_RAW_DIR = WORKSPACE_ROOT / "Project Sovigaz" / "1. Giới thiệu và khảo sát dự án" / "Nguồn dữ liệu" / "Data raw"
DATA_DICT_SOURCE = WORKSPACE_ROOT / "Project Sovigaz" / "2. Tài liệu phân tích và thiết kế" / "04. Mô hình dữ liệu" / "Data_Dictionary_Sovigaz.xlsx"

PROCESSED_DATA_DIR = PROJECT_ROOT / "data" / "processed"
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
REPORTS_DIR = PROJECT_ROOT / "reports"
LOGS_DIR = PROJECT_ROOT / "logs"
MODELS_DIR = PROJECT_ROOT / "models"

# Global Parameters
RANDOM_STATE = 42

# Temporal Boundaries
SALES_START_DATE = "2023-01-02"
SALES_END_DATE = "2026-06-16"
DEBT_SNAPSHOT_DATE = "2026-07-31"

# Forecasting Configuration
FORECAST_TARGET_REVENUE = "Revenue"
FORECAST_TARGET_QUANTITY = "MainQuantity"
FORECAST_DATE_COL = "RefDate"
TOP_N_PRODUCTS = 5

# Customer Segmentation & Churn Configuration
CHURN_INTERPURCHASE_MEDIAN_DAYS = 3
CHURN_INTERPURCHASE_P90_DAYS = 21
CHURN_HIGH_RISK_THRESHOLD_DAYS = 60
CHURN_DEFINITIVE_THRESHOLD_DAYS = 90

# Credit Risk Configuration
CREDIT_TARGET_OVERDUE = "IsOverdue"
CREDIT_ACCOUNT_RECEIVABLE = 131
