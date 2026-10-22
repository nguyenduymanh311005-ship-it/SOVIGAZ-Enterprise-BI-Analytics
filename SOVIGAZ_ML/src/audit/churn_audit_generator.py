"""
SOVIGAZ Sub-Phase 4C.1: Audit Artifact Generator
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-04
"""
import sys
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    average_precision_score, brier_score_loss
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUTS_DIR = PROJECT_ROOT / "outputs" / "churn"
REPORTS_DIR = PROJECT_ROOT / "reports"
MODELS_DIR = PROJECT_ROOT / "models"

FEATURE_COLS_A = [
    "recency_days", "frequency_30d", "frequency_90d", "frequency_180d", "frequency_365d",
    "monetary_30d", "monetary_90d", "monetary_180d", "monetary_365d",
    "active_days_90d", "active_days_180d", "active_days_365d",
    "distinct_products_90d", "distinct_products_180d", "distinct_products_365d",
    "quantity_90d", "quantity_180d", "quantity_365d",
    "avg_order_value_90d", "avg_order_value_365d",
    "mean_interpurchase_days", "median_interpurchase_days", "std_interpurchase_days", "last_interpurchase_days",
    "revenue_change_30_vs_90", "revenue_change_90_vs_180", "frequency_change_90_vs_180", "revenue_momentum_ratio",
    "has_negative_revenue_365d", "has_negative_revenue_90d"
]

def generate_feature_inventory():
    print("Generating churn_feature_inventory_4C1.csv...")
    feat_df = pd.read_parquet(OUTPUTS_DIR / "churn_features.parquet")
    cols = list(feat_df.columns)
    
    records = []
    for c in cols:
        s = feat_df[c]
        dtype = str(s.dtype)
        missing_rate = round(float(s.isna().mean()), 4)
        
        # Classification
        is_id = c in ["AccountObjectCode", "CustomerName", "BranchCode"]
        is_ts = c in ["snapshot_date", "observation_date"]
        is_tgt = c.startswith("churn_target")
        is_model_in = c in FEATURE_COLS_A
        is_pred_out = False
        is_derived_biz = c in ["purchase_count_30d", "purchase_count_90d", "purchase_count_180d", "purchase_count_365d", "temporal_cluster_id"]
        
        if is_id:
            cat = "Identifier / Demographic"
            rule = "Static customer master / transaction header"
            src = "Dim_Customer / processed_sales"
            trans = "Dimension join / aggregation"
            notes = "Primary customer entity key or business dimension; excluded from model input"
        elif is_ts:
            cat = "Temporal Metadata"
            rule = "Fixed snapshot date T"
            src = "Pipeline calendar"
            trans = "Snapshot boundary specification"
            notes = "Defines observation temporal cutoff; excluded from model input"
        elif is_tgt:
            cat = "Target Label"
            rule = f"RefDate in (T, T + {c.split('_')[-1]}]"
            src = "processed_sales (future window)"
            trans = "1 if zero purchases in future window else 0"
            notes = "Ground truth label for supervised learning; strictly excluded from model input"
        elif c in ["purchase_count_30d", "purchase_count_90d", "purchase_count_180d", "purchase_count_365d"]:
            cat = "Intermediate Business Metric"
            rule = "RefDate <= T"
            src = "processed_sales.RefDate"
            trans = "COUNT(rows) in lookback window"
            notes = "Raw transaction row count; kept for audit but excluded from model (model uses distinct RefNo frequency)"
        elif c == "temporal_cluster_id":
            cat = "Temporal Cluster Assignment"
            rule = "RefDate <= T"
            src = "rfm_segmentation_primary <= T"
            trans = "KMeans(K=4) fitted strictly <= T"
            notes = "Used strictly in Model B benchmark; excluded from Model A primary model to prevent cluster leakage"
        elif is_model_in:
            if "recency" in c:
                cat = "RFM - Recency"
                rule = "RefDate <= T"
                src = "processed_sales.RefDate"
                trans = "T - max(RefDate)"
                notes = "Core model feature; strictly causal lookback"
            elif "frequency" in c:
                cat = "RFM - Frequency"
                rule = "RefDate <= T"
                src = "processed_sales.RefNo"
                trans = "COUNT(DISTINCT RefNo)"
                notes = "Core model feature; strictly causal distinct invoice count"
            elif "monetary" in c:
                cat = "RFM - Monetary"
                rule = "RefDate <= T"
                src = "processed_sales.Revenue"
                trans = "SUM(Revenue)"
                notes = "Core model feature; strictly causal monetary aggregate"
            elif "active_days" in c:
                cat = "Engagement - Activity Days"
                rule = "RefDate <= T"
                src = "processed_sales.RefDate"
                trans = "COUNT(DISTINCT RefDate)"
                notes = "Engagement feature; unique transaction dates in window"
            elif "distinct_products" in c:
                cat = "Basket Diversity - Product Variety"
                rule = "RefDate <= T"
                src = "processed_sales.InventoryItemCode_New"
                trans = "COUNT(DISTINCT InventoryItemCode_New)"
                notes = "Product catalog coverage per customer"
            elif "quantity" in c:
                cat = "Volume - Quantity"
                rule = "RefDate <= T"
                src = "processed_sales.MainQuantity"
                trans = "SUM(MainQuantity)"
                notes = "Physical volume consumed in lookback window"
            elif "avg_order_value" in c:
                cat = "AOV - Economic Scale"
                rule = "RefDate <= T"
                src = "Revenue, RefNo"
                trans = "monetary_window / max(1, frequency_window)"
                notes = "Average revenue per distinct purchase invoice"
            elif "interpurchase" in c:
                cat = "Interval Dynamics"
                rule = "RefDate <= T"
                src = "processed_sales.RefDate"
                trans = "Differences between consecutive transaction dates <= T"
                notes = "Captures regularity/burstiness of ordering cycles"
            elif "momentum" in c or "change" in c:
                cat = "Trend & Momentum"
                rule = "RefDate <= T"
                src = "processed_sales.Revenue, RefNo"
                trans = "Short-term vs long-term ratio / difference"
                notes = "Captures acceleration or deceleration of customer purchasing behavior"
            elif "negative_revenue" in c:
                cat = "Financial Anomaly Flag"
                rule = "RefDate <= T"
                src = "processed_sales.Revenue"
                trans = "1 if any line Revenue < 0 else 0"
                notes = "Identifies accounts with credit adjustments or returns in window"
            else:
                cat = "Model Feature"
                rule = "RefDate <= T"
                src = "processed_sales"
                trans = "Derived feature"
                notes = "Model input"
        else:
            cat = "Other"
            rule = "RefDate <= T"
            src = "processed_sales"
            trans = "Unknown"
            notes = "Unclassified"

        records.append({
            "feature_name": c,
            "dtype": dtype,
            "feature_category": cat,
            "is_identifier": is_id,
            "is_timestamp": is_ts,
            "is_target": is_tgt,
            "is_model_input": is_model_in,
            "is_prediction_output": is_pred_out,
            "is_derived_business_field": is_derived_biz,
            "uses_future_data": False,
            "max_source_event_date_rule": rule,
            "source_columns": src,
            "transformation": trans,
            "missing_rate": missing_rate,
            "notes": notes
        })

    inv_df = pd.DataFrame(records)
    out_path = REPORTS_DIR / "churn_feature_inventory_4C1.csv"
    inv_df.to_csv(out_path, index=False, encoding="utf-8-sig")
    print(f"Saved feature inventory to {out_path.name} ({len(inv_df)} columns)")
    return inv_df

def generate_bootstrap_ci():
    print("Generating churn_test_metrics_ci_4C1.csv...")
    pred_df = pd.read_csv(OUTPUTS_DIR / "churn_predictions.csv")
    test_df = pred_df[pred_df["snapshot_date"] == "2025-12-31"].reset_index(drop=True)
    y_true = test_df["actual_churn"].values
    y_prob = test_df["churn_probability"].values
    th = 0.50

    n_boot = 2000
    seed = 42
    rng = np.random.default_rng(seed)
    n_samples = len(test_df)

    boot_metrics = {"pr_auc": [], "roc_auc": [], "f1": [], "precision": [], "recall": [], "brier": []}

    for i in range(n_boot):
        idx = rng.choice(n_samples, size=n_samples, replace=True)
        yt_b = y_true[idx]
        yp_b = y_prob[idx]
        y_pred_b = (yp_b >= th).astype(int)

        if len(np.unique(yt_b)) < 2:
            continue

        boot_metrics["pr_auc"].append(average_precision_score(yt_b, yp_b))
        boot_metrics["roc_auc"].append(roc_auc_score(yt_b, yp_b))
        boot_metrics["f1"].append(f1_score(yt_b, y_pred_b, zero_division=0))
        boot_metrics["precision"].append(precision_score(yt_b, y_pred_b, zero_division=0))
        boot_metrics["recall"].append(recall_score(yt_b, y_pred_b, zero_division=0))
        boot_metrics["brier"].append(brier_score_loss(yt_b, yp_b))

    results = []
    names = [
        ("PR-AUC", "pr_auc"),
        ("ROC-AUC", "roc_auc"),
        ("F1-Score", "f1"),
        ("Precision", "precision"),
        ("Recall", "recall"),
        ("Brier Score", "brier")
    ]
    for label, key in names:
        vals = np.array(boot_metrics[key])
        pt = np.mean(vals)
        ci_low = np.percentile(vals, 2.5)
        ci_high = np.percentile(vals, 97.5)
        results.append({
            "metric": label,
            "point_estimate": round(float(pt), 4),
            "ci_lower_95": round(float(ci_low), 4),
            "ci_upper_95": round(float(ci_high), 4),
            "bootstrap_method": "Nonparametric Percentile Bootstrap",
            "n_bootstrap": n_boot,
            "random_seed": seed,
            "sampling_unit": "Customer (Unique Cross-Sectional Observation at T=2025-12-31)",
            "valid_replicates": len(vals),
            "notes": "Model predictions and threshold theta*=0.50 strictly locked"
        })

    df_ci = pd.DataFrame(results)
    out_ci = REPORTS_DIR / "churn_test_metrics_ci_4C1.csv"
    df_ci.to_csv(out_ci, index=False, encoding="utf-8-sig")
    print(f"Saved bootstrap CI to {out_ci.name}")
    return df_ci

if __name__ == "__main__":
    generate_feature_inventory()
    generate_bootstrap_ci()
