"""
SOVIGAZ Feature Lineage & Leakage Matrix Builder (Phase 2)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import List, Dict
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import REPORTS_DIR, PROJECT_ROOT
from src.utils.logger import setup_logger

logger = setup_logger("FeatureLineage", log_filename="data_pipeline.log")

def generate_feature_lineage_and_matrix() -> pd.DataFrame:
    """
    Builds comprehensive feature lineage table and styled Excel matrix
    verifying leakage status for all forecasting, segmentation, churn, and credit features.
    """
    logger.info("Executing PHẦN N: Generating feature_lineage.csv and feature_leakage_matrix.xlsx...")
    
    lineage_records = [
        # Forecasting Features
        {
            "feature_name": "calendar_year",
            "dataset": "sales_daily/weekly/monthly",
            "source_table": "Dim_Date / RefDate",
            "source_column": "RefDate",
            "aggregation": "Calendar Extract",
            "observation_time": "T",
            "prediction_time": "T + k",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Exogenous calendar feature known in advance for any horizon."
        },
        {
            "feature_name": "calendar_month",
            "dataset": "sales_daily/weekly/monthly",
            "source_table": "Dim_Date / RefDate",
            "source_column": "RefDate",
            "aggregation": "Calendar Extract",
            "observation_time": "T",
            "prediction_time": "T + k",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Deterministic calendar month."
        },
        {
            "feature_name": "calendar_day_of_week",
            "dataset": "sales_daily",
            "source_table": "Dim_Date / RefDate",
            "source_column": "RefDate",
            "aggregation": "Calendar Extract",
            "observation_time": "T",
            "prediction_time": "T + k",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Day of week (0=Mon, 6=Sun) known in advance."
        },
        {
            "feature_name": "lag_1",
            "dataset": "sales_daily/weekly/monthly",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue / MainQuantity",
            "aggregation": "shift(1)",
            "observation_time": "T - 1",
            "prediction_time": "T",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Preceding period actual value strictly <= T-1."
        },
        {
            "feature_name": "lag_7",
            "dataset": "sales_daily",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue / MainQuantity",
            "aggregation": "shift(7)",
            "observation_time": "T - 7",
            "prediction_time": "T",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Same day last week actual value strictly <= T-7."
        },
        {
            "feature_name": "rolling_mean_7",
            "dataset": "sales_daily",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue / MainQuantity",
            "aggregation": "shift(1).rolling(7).mean()",
            "observation_time": "T - 1",
            "prediction_time": "T",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Strict shift(1) ensures target at T is never included in the 7-day rolling window."
        },
        {
            "feature_name": "rolling_std_7",
            "dataset": "sales_daily",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue / MainQuantity",
            "aggregation": "shift(1).rolling(7).std()",
            "observation_time": "T - 1",
            "prediction_time": "T",
            "allowed_for_forecasting": "YES",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "SAFE",
            "reason": "Volatility across prior 7 days strictly <= T-1."
        },
        # Customer RFM & Churn Features
        {
            "feature_name": "recency",
            "dataset": "rfm_features / churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "RefDate",
            "aggregation": "T - max(RefDate)",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Calculated strictly on transactions where RefDate <= T."
        },
        {
            "feature_name": "frequency",
            "dataset": "rfm_features / churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "RefDate",
            "aggregation": "nunique(RefDate) in [T-180, T]",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Order frequency in observation window <= T."
        },
        {
            "feature_name": "monetary",
            "dataset": "rfm_features / churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue",
            "aggregation": "sum(Revenue) in [T-180, T]",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Total spending strictly within [T-180, T]."
        },
        {
            "feature_name": "avg_order_value",
            "dataset": "rfm_features / churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue / RefDate",
            "aggregation": "monetary / frequency",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Average order size in observation window."
        },
        {
            "feature_name": "product_diversity",
            "dataset": "rfm_features / churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "InventoryItemCode_New",
            "aggregation": "nunique(ItemCode) in [T-180, T]",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Number of distinct SKUs purchased <= T."
        },
        {
            "feature_name": "revenue_trend_ratio",
            "dataset": "churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "Revenue",
            "aggregation": "Rev[T-90, T] / Rev[T-180, T]",
            "observation_time": "T",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "YES",
            "allowed_for_credit_risk": "YES",
            "leakage_status": "SAFE",
            "reason": "Internal observation momentum ratio strictly using data <= T."
        },
        {
            "feature_name": "churn_target_90d",
            "dataset": "churn_dataset",
            "source_table": "DM_RevenueBySaleLedger",
            "source_column": "RefDate in [T, T+90]",
            "aggregation": "Binary Flag (No purchases)",
            "observation_time": "T + 90",
            "prediction_time": "T + 90",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "TARGET_ONLY",
            "allowed_for_credit_risk": "NO",
            "leakage_status": "TARGET_ONLY",
            "reason": "Ground truth label derived from prediction window. FORBIDDEN AS FEATURE."
        },
        # Credit Risk Profiling Features
        {
            "feature_name": "total_overdue_amount",
            "dataset": "customer_credit_snapshot_20260731",
            "source_table": "Fact_AnalyticsDebit",
            "source_column": "Amount",
            "aggregation": "sum(Amount) for overdue categories",
            "observation_time": "2026-07-31",
            "prediction_time": "2026-07-31",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "DESCRIPTIVE_ONLY",
            "leakage_status": "DESCRIPTIVE_ONLY",
            "reason": "Single snapshot as of 31/07/2026. Cannot be used as future predictive target without temporal history."
        },
        {
            "feature_name": "overdue_ratio",
            "dataset": "customer_credit_snapshot_20260731",
            "source_table": "Fact_AnalyticsDebit",
            "source_column": "Amount",
            "aggregation": "Overdue / Total Receivable",
            "observation_time": "2026-07-31",
            "prediction_time": "2026-07-31",
            "allowed_for_forecasting": "NO",
            "allowed_for_churn": "NO",
            "allowed_for_credit_risk": "DESCRIPTIVE_ONLY",
            "leakage_status": "DESCRIPTIVE_ONLY",
            "reason": "Descriptive risk proportion as of 31/07/2026."
        }
    ]

    df_lineage = pd.DataFrame(lineage_records)
    
    # 1. Export CSV
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = REPORTS_DIR / "feature_lineage.csv"
    df_lineage.to_csv(csv_path, index=False, encoding="utf-8-sig")
    df_lineage.to_csv(PROJECT_ROOT / "feature_lineage.csv", index=False, encoding="utf-8-sig")
    logger.info(f"Saved feature_lineage.csv to {csv_path}")

    # 2. Export Styled Excel Matrix
    xlsx_path = REPORTS_DIR / "feature_leakage_matrix.xlsx"
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Feature_Leakage_Matrix"
    ws.views.sheetView[0].showGridLines = True

    header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
    border_thin = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )

    headers = [
        "Feature Name", "Dataset", "Source Table", "Source Column", 
        "Aggregation Rule", "Available At (Obs Time)", "Prediction Time", 
        "Forecast Allowed?", "Churn Allowed?", "Credit Allowed?", 
        "Leakage Status", "Methodological Reason"
    ]
    ws.append(headers)
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")

    status_colors = {
        "SAFE": "E8F8F5",           # Light green
        "TARGET_ONLY": "FDEDEC",    # Light red
        "DESCRIPTIVE_ONLY": "FEF9E7"# Light yellow
    }

    for _, r in df_lineage.iterrows():
        ws.append([
            r["feature_name"], r["dataset"], r["source_table"], r["source_column"],
            r["aggregation"], r["observation_time"], r["prediction_time"],
            r["allowed_for_forecasting"], r["allowed_for_churn"], r["allowed_for_credit_risk"],
            r["leakage_status"], r["reason"]
        ])

    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=len(headers)):
        status_val = row[10].value
        row_color = status_colors.get(status_val, "FFFFFF")
        fill_status = PatternFill(start_color=row_color, end_color=row_color, fill_type="solid")
        for cell in row:
            cell.font = Font(name="Segoe UI", size=10)
            cell.border = border_thin
            if cell.column == 11:
                cell.fill = fill_status
                cell.font = Font(name="Segoe UI", size=10, bold=True)
                cell.alignment = Alignment(horizontal="center")

    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col[:50])
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 45)

    wb.save(xlsx_path)
    wb.save(PROJECT_ROOT / "feature_leakage_matrix.xlsx")
    logger.info(f"Saved feature_leakage_matrix.xlsx to {xlsx_path}")

    return df_lineage
