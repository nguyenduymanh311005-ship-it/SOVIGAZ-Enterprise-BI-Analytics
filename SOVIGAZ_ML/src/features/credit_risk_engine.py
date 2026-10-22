"""
SOVIGAZ Machine Learning System — Problem 3: B2B Credit Risk & Outstanding Debt Risk
Module: credit_risk_engine.py
Author: Senior Machine Learning Engineer & Data Scientist
Audited Standard: Operational Credit Exposure Profiling & Risk Scoring (Branch B)
"""

import os
import json
import logging
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger("CreditRiskEngine")

# Base paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_PROCESSED = os.path.join(PROJECT_ROOT, "data", "processed")
OUTPUTS_DIR = os.path.join(PROJECT_ROOT, "outputs")
CREDIT_OUTPUTS_DIR = os.path.join(OUTPUTS_DIR, "credit")
POWERBI_OUTPUTS_DIR = os.path.join(OUTPUTS_DIR, "powerbi")
REPORTS_DIR = os.path.join(PROJECT_ROOT, "reports")

os.makedirs(CREDIT_OUTPUTS_DIR, exist_ok=True)
os.makedirs(POWERBI_OUTPUTS_DIR, exist_ok=True)


def load_input_datasets():
    """Load verified data sources for credit risk analysis"""
    logger.info("Loading credit snapshot, customer master, sales, clustering and churn artifacts...")
    
    # 1. Audited Credit Snapshot (Account 131)
    credit_path = os.path.join(DATA_PROCESSED, "customer_credit_snapshot_20260731.parquet")
    df_credit = pd.read_parquet(credit_path)
    
    # 2. Customer Master
    cust_path = os.path.join(DATA_PROCESSED, "customer_master.parquet")
    df_cust = pd.read_parquet(cust_path).rename(columns={"CustomerCode": "AccountObjectCode"})
    
    # 3. Processed Sales
    sales_path = os.path.join(DATA_PROCESSED, "processed_sales.parquet")
    df_sales = pd.read_parquet(sales_path)
    df_sales["RefDate"] = pd.to_datetime(df_sales["RefDate"])
    
    # 4. K-Means Customer Segment (Sub-Phase 4B locked artifact)
    cluster_path = os.path.join(OUTPUTS_DIR, "customer_segmentation", "cluster_assignments.csv")
    df_cluster = pd.read_csv(cluster_path)
    df_cluster_latest = df_cluster[df_cluster["snapshot_date"] == "2025-12-31"].drop_duplicates("AccountObjectCode")
    
    # 5. Churn Priority List (Sub-Phase 4D locked artifact)
    churn_path = os.path.join(OUTPUTS_DIR, "churn", "churn_priority_customers.csv")
    df_churn = pd.read_csv(churn_path)
    
    return df_credit, df_cust, df_sales, df_cluster_latest, df_churn


def compute_sales_exposure_features(df_sales, cutoff_date=pd.Timestamp("2026-06-30")):
    """
    Computes audited trailing sales exposure metrics preceding credit snapshot
    Ensures strict zero-leakage cutoff.
    """
    logger.info(f"Computing sales exposure features with cutoff at {cutoff_date}...")
    
    sales_365 = df_sales[df_sales["RefDate"].between(cutoff_date - pd.Timedelta(days=365), cutoff_date)]
    sales_180 = df_sales[df_sales["RefDate"].between(cutoff_date - pd.Timedelta(days=180), cutoff_date)]
    sales_90 = df_sales[df_sales["RefDate"].between(cutoff_date - pd.Timedelta(days=90), cutoff_date)]
    sales_30 = df_sales[df_sales["RefDate"].between(cutoff_date - pd.Timedelta(days=30), cutoff_date)]
    
    rev_365 = sales_365.groupby("AccountObjectCode")["Revenue"].sum().rename("revenue_365d")
    rev_180 = sales_180.groupby("AccountObjectCode")["Revenue"].sum().rename("revenue_180d")
    rev_90 = sales_90.groupby("AccountObjectCode")["Revenue"].sum().rename("revenue_90d")
    rev_30 = sales_30.groupby("AccountObjectCode")["Revenue"].sum().rename("revenue_30d")
    orders_365 = sales_365.groupby("AccountObjectCode")["RefNo"].nunique().rename("transaction_count_365d")
    days_365 = sales_365.groupby("AccountObjectCode")["RefDate"].nunique().rename("active_days_365d")
    
    sales_df = pd.concat([rev_365, rev_180, rev_90, rev_30, orders_365, days_365], axis=1).reset_index()
    return sales_df


def build_customer_credit_master():
    """
    Constructs the official Customer Credit Master dataset (N = 584 trade credit accounts)
    Joins debt aging, audited sales, segment clusters, and churn indicators.
    """
    df_credit, df_cust, df_sales, df_cluster, df_churn = load_input_datasets()
    sales_df = compute_sales_exposure_features(df_sales)
    
    logger.info("Merging customer identification, debt aging, and sales exposure...")
    master = df_credit.copy()
    
    # Standardize core column names
    master = master.rename(columns={
        "total_receivable_debt": "outstanding_debt",
        "total_current_amount": "current_debt",
        "total_overdue_amount": "overdue_debt"
    })
    
    # Merge Customer Identification
    master = master.merge(
        df_cust[["AccountObjectCode", "CustomerName", "BranchCode", "Region", "Country"]],
        on="AccountObjectCode",
        how="left"
    )
    # Fill any null customer names from Dim_Customer fallback or code
    master["CustomerName"] = master["CustomerName"].fillna(master["AccountObjectCode"])
    master["BranchCode"] = master["BranchCode"].fillna("UNKNOWN")
    master["Region"] = master["Region"].fillna("VN")
    
    # Merge Sales Exposure metrics
    master = master.merge(sales_df, on="AccountObjectCode", how="left")
    for col in ["revenue_365d", "revenue_180d", "revenue_90d", "revenue_30d", "transaction_count_365d", "active_days_365d"]:
        master[col] = master[col].fillna(0.0)
        
    # Merge Customer Segment from Sub-Phase 4B
    master = master.merge(
        df_cluster[["AccountObjectCode", "cluster_id", "business_segment"]].rename(
            columns={"business_segment": "customer_segment"}
        ),
        on="AccountObjectCode",
        how="left"
    )
    master["customer_segment"] = master["customer_segment"].fillna("Dormant / Non-Clustered")
    
    # Merge Churn Dimensions from Sub-Phase 4D (strictly orthogonal risk dimension)
    master = master.merge(
        df_churn[["AccountObjectCode", "churn_probability", "risk_band"]].rename(
            columns={"risk_band": "churn_risk_band"}
        ),
        on="AccountObjectCode",
        how="left"
    )
    master["churn_probability"] = master["churn_probability"].fillna(-1.0)
    master["churn_risk_band"] = master["churn_risk_band"].fillna("Not Evaluated in 2025")
    
    # Explicit dual snapshot metadata dates (Sub-Phase 3.1 Temporal Alignment)
    master["credit_snapshot_date"] = "2026-07-31"
    master["churn_snapshot_date"] = master["churn_probability"].apply(
        lambda p: "2025-12-31" if p >= 0 else "Not Evaluated in 2025"
    )
    
    # Ratios and Derived Metrics with Denominator Controls
    logger.info("Computing debt ratios and financial exposure metrics...")
    total_system_debt = master["outstanding_debt"].sum()
    master["debt_share"] = master["outstanding_debt"] / total_system_debt
    
    # Flag chronic overdue (> 365 days)
    chronic_cols = [c for c in master.columns if "366-730" in c or "731-1095" in c or "trên 1095" in c]
    master["chronic_overdue_debt"] = master[chronic_cols].sum(axis=1)
    master["is_overdue_gt_365d"] = (master["chronic_overdue_debt"] > 0).astype(int)
    
    # Ratio: Debt to Revenue 365d (handled gracefully)
    master["is_zero_sales_with_debt"] = (master["revenue_365d"] <= 0).astype(int)
    master["has_negative_revenue"] = (master["revenue_365d"] < 0).astype(int)
    
    def safe_debt_to_rev_365(row):
        rev = row["revenue_365d"]
        debt = row["outstanding_debt"]
        if rev <= 0:
            return 10.0  # Capped upper bound for infinite debt burden
        return float(np.clip(debt / rev, 0.0, 10.0))
        
    def safe_debt_to_rev_90(row):
        rev = row["revenue_90d"]
        debt = row["outstanding_debt"]
        if rev <= 0:
            return 10.0  # Capped upper bound
        return float(np.clip(debt / rev, 0.0, 10.0))
        
    master["debt_to_revenue_365d"] = master.apply(safe_debt_to_rev_365, axis=1)
    master["debt_to_revenue_90d"] = master.apply(safe_debt_to_rev_90, axis=1)
    
    # Revenue momentum ratio
    def calc_momentum(row):
        rev30 = row["revenue_30d"]
        rev90 = row["revenue_90d"]
        if rev90 <= 0:
            return 0.0
        return float((rev30 / (rev90 / 3.0)))
        
    master["revenue_momentum_ratio"] = master.apply(calc_momentum, axis=1)
    
    return master


def compute_credit_risk_score(master):
    """
    Computes transparent, configurable 3-pillar B2B Credit Risk Score (0 - 100 points)
    - Pillar 1: Credit Exposure Score (0 - 40 pts)
    - Pillar 2: Debt Burden & Aging Score (0 - 35 pts)
    - Pillar 3: Behavioral Warning Score (0 - 25 pts)
    """
    logger.info("Computing 3-pillar B2B Credit Risk Score...")
    df = master.copy()
    
    # Quantiles of debt for Pillar 1
    p25 = df["outstanding_debt"].quantile(0.25)
    p50 = df["outstanding_debt"].quantile(0.50)
    p75 = df["outstanding_debt"].quantile(0.75)
    p90 = df["outstanding_debt"].quantile(0.90)
    p95 = df["outstanding_debt"].quantile(0.95)
    
    def score_exposure(debt):
        if debt >= p95:
            return 40.0
        elif debt >= p90:
            return 32.0
        elif debt >= p75:
            return 24.0
        elif debt >= p50:
            return 16.0
        elif debt >= p25:
            return 8.0
        else:
            return 4.0
            
    df["exposure_score"] = df["outstanding_debt"].apply(score_exposure)
    
    # Pillar 2: Debt Burden & Aging Score (0 - 35 pts)
    # - overdue_ratio: up to 15 pts
    # - overdue > 90d: 8 pts
    # - overdue > 365d: 7 pts
    # - debt to rev ratio: up to 5 pts
    def score_burden(row):
        pts = 0.0
        # Overdue ratio component
        pts += float(row["overdue_ratio"] * 15.0)
        # Serious aging flags
        if row["is_overdue_gt_90d"] == 1:
            pts += 8.0
        if row["is_overdue_gt_365d"] == 1:
            pts += 7.0
        # Debt to revenue ratio
        d_to_r = row["debt_to_revenue_365d"]
        if d_to_r >= 1.0:
            pts += 5.0
        elif d_to_r >= 0.5:
            pts += 3.0
        elif d_to_r >= 0.25:
            pts += 1.0
        return min(35.0, pts)
        
    df["debt_burden_score"] = df.apply(score_burden, axis=1)
    
    # Pillar 3: Behavioral Warning Score (0 - 25 pts)
    # - Stopped buying in last 90 days with debt: 10 pts
    # - Sharp momentum contraction (momentum < 0.25): 7 pts
    # - Negative revenue / accounting adjustments: 5 pts
    # - Zero revenue in whole 365 days: 3 pts
    def score_behavior(row):
        pts = 0.0
        if row["revenue_90d"] == 0:
            pts += 10.0
        if row["revenue_momentum_ratio"] < 0.25 and row["revenue_90d"] > 0:
            pts += 7.0
        if row["has_negative_revenue"] == 1:
            pts += 5.0
        if row["is_zero_sales_with_debt"] == 1:
            pts += 3.0
        return min(25.0, pts)
        
    df["behavioral_warning_score"] = df.apply(score_behavior, axis=1)
    
    # Composite Credit Exposure Risk Score (Standard Terminology Sub-Phase 3.1)
    df["credit_risk_score"] = (
        df["exposure_score"] + df["debt_burden_score"] + df["behavioral_warning_score"]
    ).round(1)
    df["credit_exposure_risk_score"] = df["credit_risk_score"]
    
    # Stratification into 4 Credit Risk Bands
    def assign_credit_risk_band(row):
        score = row["credit_risk_score"]
        debt = row["outstanding_debt"]
        is_ovd_90 = row["is_overdue_gt_90d"]
        if score >= 70.0 or (debt >= p95 and is_ovd_90 == 1):
            return "Critical Exposure (Score >= 70)"
        elif score >= 50.0:
            return "High Exposure (50 <= Score < 70)"
        elif score >= 30.0:
            return "Moderate Exposure (30 <= Score < 50)"
        else:
            return "Low Exposure (Score < 30)"
            
    df["credit_risk_band"] = df.apply(assign_credit_risk_band, axis=1)
    
    # Assign Dual Credit-Churn Priority Tiers (Sections XVI & XIX)
    def assign_priority(row):
        c_band = row["credit_risk_band"]
        ch_band = str(row["churn_risk_band"])
        
        is_high_credit = ("Critical" in c_band or "High" in c_band)
        is_high_churn = ("Critical" in ch_band or "High" in ch_band)
        
        if is_high_credit and is_high_churn:
            return "Priority 1: Critical Joint Action (Finance & Sales)"
        elif is_high_credit and not is_high_churn:
            return "Priority 2: Credit Terms & Exposure Monitoring"
        elif not is_high_credit and is_high_churn:
            return "Priority 3: Customer Retention & Re-engagement"
        else:
            return "Priority 4: Standard Commercial Monitoring"
            
    df["credit_priority"] = df.apply(assign_priority, axis=1)
    
    return df


def run_credit_anomaly_detection(df):
    """
    Performs unsupervised Anomaly Detection using Isolation Forest (seed=42, contamination=0.05)
    and robust IQR outlier checks.
    Epistemic boundary: Anomaly != Default.
    """
    logger.info("Running Isolation Forest Anomaly Detection (seed=42, contamination=0.05)...")
    feat_cols = ["outstanding_debt", "overdue_ratio", "debt_to_revenue_365d", "revenue_365d"]
    X = df[feat_cols].copy()
    
    # Robust normalization for model input
    medians = X.median()
    iqrs = X.quantile(0.75) - X.quantile(0.25)
    iqrs[iqrs == 0] = 1.0
    X_scaled = (X - medians) / iqrs
    
    iso = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    iso.fit(X_scaled)
    
    # -1 is anomaly, 1 is normal
    preds = iso.predict(X_scaled)
    scores = iso.decision_function(X_scaled)
    
    df["is_credit_anomaly"] = (preds == -1).astype(int)
    df["anomaly_decision_score"] = scores.round(4)
    
    # IQR fence on outstanding debt
    p75 = df["outstanding_debt"].quantile(0.75)
    p25 = df["outstanding_debt"].quantile(0.25)
    iqr = p75 - p25
    extreme_fence = p75 + 3.0 * iqr
    df["is_extreme_debt_outlier"] = (df["outstanding_debt"] > extreme_fence).astype(int)
    
    return df


def calculate_concentration_and_hhi(df):
    """
    Computes concentration metrics: Top 10, Top 20, Top 50 and HHI index
    """
    logger.info("Calculating Debt Concentration and HHI...")
    sorted_df = df.sort_values("outstanding_debt", ascending=False).reset_index(drop=True)
    total_debt = sorted_df["outstanding_debt"].sum()
    
    sorted_df["debt_share"] = sorted_df["outstanding_debt"] / total_debt
    sorted_df["cumulative_debt_share"] = sorted_df["debt_share"].cumsum()
    
    top_10_debt = sorted_df.iloc[:10]["outstanding_debt"].sum()
    top_20_debt = sorted_df.iloc[:20]["outstanding_debt"].sum()
    top_50_debt = sorted_df.iloc[:50]["outstanding_debt"].sum()
    
    top_10_share = (top_10_debt / total_debt) * 100.0
    top_20_share = (top_20_debt / total_debt) * 100.0
    top_50_share = (top_50_debt / total_debt) * 100.0
    
    # HHI calculations
    hhi_decimal = float((sorted_df["debt_share"] ** 2).sum())
    hhi_points = float(hhi_decimal * 10000.0)
    
    concentration_summary = {
        "total_receivable_debt_vnd": float(total_debt),
        "total_credit_customers": int(len(sorted_df)),
        "top_10_debt_vnd": float(top_10_debt),
        "top_10_share_pct": round(top_10_share, 2),
        "top_20_debt_vnd": float(top_20_debt),
        "top_20_share_pct": round(top_20_share, 2),
        "top_50_debt_vnd": float(top_50_debt),
        "top_50_share_pct": round(top_50_share, 2),
        "hhi_decimal": round(hhi_decimal, 6),
        "hhi_points": round(hhi_points, 2),
        "concentration_level": "Moderately Concentrated" if hhi_points >= 1500 else "Unconcentrated"
    }
    
    return sorted_df, concentration_summary


def export_deliverables(master_df, concentration_summary):
    """
    Exports all required artifacts for Sub-Phase 3, Power BI, and documentation
    """
    logger.info("Exporting all official Credit Risk artifacts...")
    
    # 1. Customer Credit Master (CSV and Parquet)
    master_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "customer_credit_master.csv")
    master_parquet_path = os.path.join(CREDIT_OUTPUTS_DIR, "customer_credit_master.parquet")
    master_df.to_csv(master_csv_path, index=False, encoding="utf-8-sig")
    master_df.to_parquet(master_parquet_path, index=False)
    logger.info(f"Saved: {master_csv_path} ({len(master_df)} rows)")
    
    # 2. Top Credit Exposure Customers (Ranked by Outstanding Debt)
    top_customers = master_df.sort_values("outstanding_debt", ascending=False).reset_index(drop=True)
    top_customers["rank"] = range(1, len(top_customers) + 1)
    top_cols = [
        "rank", "AccountObjectCode", "CustomerName", "BranchCode", "customer_segment",
        "credit_snapshot_date", "churn_snapshot_date",
        "outstanding_debt", "current_debt", "overdue_debt", "overdue_ratio",
        "debt_share", "revenue_365d", "debt_to_revenue_365d",
        "credit_risk_score", "credit_exposure_risk_score", "credit_risk_band",
        "churn_probability", "churn_risk_band",
        "credit_priority", "is_credit_anomaly"
    ]
    top_export = top_customers[top_cols]
    top_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "top_credit_exposure_customers.csv")
    top_export.to_csv(top_csv_path, index=False, encoding="utf-8-sig")
    logger.info(f"Saved: {top_csv_path} ({len(top_export)} rows)")
    
    # 3. Credit Exposure Distribution Summary Stats
    debt = master_df["outstanding_debt"]
    summary_stats = pd.DataFrame([{
        "metric": "outstanding_debt",
        "count": len(debt),
        "total_vnd": float(debt.sum()),
        "mean_vnd": float(debt.mean()),
        "std_vnd": float(debt.std()),
        "median_vnd": float(debt.median()),
        "p25_vnd": float(debt.quantile(0.25)),
        "p75_vnd": float(debt.quantile(0.75)),
        "p90_vnd": float(debt.quantile(0.90)),
        "p95_vnd": float(debt.quantile(0.95)),
        "p99_vnd": float(debt.quantile(0.99)),
        "max_vnd": float(debt.max()),
        "skewness": float(debt.skew()),
        "kurtosis": float(debt.kurtosis())
    }])
    stats_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "credit_risk_summary_stats.csv")
    summary_stats.to_csv(stats_csv_path, index=False, encoding="utf-8-sig")
    
    # 4. Concentration & HHI Table
    hhi_df = pd.DataFrame([concentration_summary])
    hhi_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "credit_concentration_hhi.csv")
    hhi_df.to_csv(hhi_csv_path, index=False, encoding="utf-8-sig")
    
    # 5. Customer Segment x Credit Risk Band Cross-Tabulation
    seg_crosstab = master_df.groupby(["customer_segment", "credit_risk_band"], as_index=False).agg(
        customer_count=("AccountObjectCode", "count"),
        total_debt_vnd=("outstanding_debt", "sum"),
        avg_debt_vnd=("outstanding_debt", "mean"),
        total_overdue_vnd=("overdue_debt", "sum"),
        avg_overdue_ratio=("overdue_ratio", "mean"),
        avg_credit_score=("credit_risk_score", "mean")
    )
    seg_crosstab["avg_debt_vnd"] = seg_crosstab["avg_debt_vnd"].round(0)
    seg_crosstab["avg_overdue_ratio"] = seg_crosstab["avg_overdue_ratio"].round(4)
    seg_crosstab["avg_credit_score"] = seg_crosstab["avg_credit_score"].round(1)
    seg_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "credit_segment_crosstab.csv")
    seg_crosstab.to_csv(seg_csv_path, index=False, encoding="utf-8-sig")
    
    # 6. Credit Risk Band x Churn Risk Band Cross-Tabulation
    churn_crosstab = master_df.groupby(["credit_risk_band", "churn_risk_band"], as_index=False).agg(
        customer_count=("AccountObjectCode", "count"),
        total_debt_vnd=("outstanding_debt", "sum"),
        total_overdue_vnd=("overdue_debt", "sum"),
        avg_credit_score=("credit_risk_score", "mean")
    )
    churn_crosstab["avg_credit_score"] = churn_crosstab["avg_credit_score"].round(1)
    churn_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "credit_churn_crosstab.csv")
    churn_crosstab.to_csv(churn_csv_path, index=False, encoding="utf-8-sig")
    
    # 7. Priority Matrix Summary
    priority_summary = master_df.groupby("credit_priority", as_index=False).agg(
        customer_count=("AccountObjectCode", "count"),
        total_debt_vnd=("outstanding_debt", "sum"),
        total_overdue_vnd=("overdue_debt", "sum"),
        avg_credit_score=("credit_risk_score", "mean")
    )
    priority_summary["debt_share_pct"] = (priority_summary["total_debt_vnd"] / master_df["outstanding_debt"].sum() * 100.0).round(2)
    priority_csv_path = os.path.join(CREDIT_OUTPUTS_DIR, "credit_priority_matrix_summary.csv")
    priority_summary.to_csv(priority_csv_path, index=False, encoding="utf-8-sig")
    
    # 8. Clean, Grain-Consistent Power BI Dataset (584 rows)
    powerbi_cols = [
        "AccountObjectCode", "CustomerName", "BranchCode", "customer_segment",
        "snapshot_date", "credit_snapshot_date", "churn_snapshot_date",
        "outstanding_debt", "current_debt", "overdue_debt", "overdue_ratio",
        "debt_share", "debt_to_revenue_365d", "debt_to_revenue_90d",
        "credit_risk_score", "credit_exposure_risk_score", "credit_risk_band", "credit_priority",
        "churn_probability", "churn_risk_band", "is_credit_anomaly"
    ]
    powerbi_df = master_df[powerbi_cols].copy()
    powerbi_csv_path = os.path.join(POWERBI_OUTPUTS_DIR, "credit_risk_customer.csv")
    powerbi_df.to_csv(powerbi_csv_path, index=False, encoding="utf-8-sig")
    logger.info(f"Saved Power BI dataset: {powerbi_csv_path} ({len(powerbi_df)} rows)")
    
    return {
        "master_count": len(master_df),
        "total_debt": float(master_df["outstanding_debt"].sum()),
        "hhi": concentration_summary["hhi_points"],
        "top_10_share": concentration_summary["top_10_share_pct"]
    }


def main():
    logger.info("=== STARTING SOVIGAZ B2B CREDIT RISK ENGINE ===")
    master = build_customer_credit_master()
    master = compute_credit_risk_score(master)
    master = run_credit_anomaly_detection(master)
    master, concentration_summary = calculate_concentration_and_hhi(master)
    res = export_deliverables(master, concentration_summary)
    logger.info(f"=== COMPLETED SUCCESSFULLY: {res} ===")


if __name__ == "__main__":
    main()
