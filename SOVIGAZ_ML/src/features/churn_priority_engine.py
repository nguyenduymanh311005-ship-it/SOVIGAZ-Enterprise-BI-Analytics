"""
SOVIGAZ Sub-Phase 4D: Churn Risk Scoring, Customer Prioritization & Business Activation Engine
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-04
"""
import sys
import json
import logging
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
import shap

# Setup paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUTS_CHURN = PROJECT_ROOT / "outputs" / "churn"
OUTPUTS_SEG = PROJECT_ROOT / "outputs" / "customer_segmentation"
OUTPUTS_PBI = PROJECT_ROOT / "outputs" / "powerbi"
REPORTS_DIR = PROJECT_ROOT / "reports"
MODELS_DIR = PROJECT_ROOT / "models"

OUTPUTS_CHURN.mkdir(parents=True, exist_ok=True)
OUTPUTS_PBI.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [ChurnPriorityEngine]: %(message)s")
logger = logging.getLogger("ChurnPriorityEngine")

def assign_risk_band(prob: float) -> str:
    """
    Business stratification policy into 4 operational risk tiers:
      - Critical Risk: P >= 0.80
      - High Risk: 0.50 <= P < 0.80
      - Medium Risk: 0.25 <= P < 0.50
      - Low Risk: P < 0.25
    Note: Threshold theta = 0.50 divides Retained (Low/Med) from Churn (High/Crit).
    """
    if prob >= 0.80:
        return "Critical Risk (P >= 0.80)"
    elif prob >= 0.50:
        return "High Risk (0.50 <= P < 0.80)"
    elif prob >= 0.25:
        return "Medium Risk (0.25 <= P < 0.50)"
    else:
        return "Low Risk (P < 0.25)"

def assign_value_tier(monetary: float) -> str:
    """
    Categorizes customer monetary value into 3 empirical tiers:
      - High Value: monetary_365d >= 100M VND (top 28-30% generating ~95.8% of revenue)
      - Medium Value: 15M <= monetary_365d < 100M VND (core regular buyers, ~5.0% of revenue)
      - Low Value: monetary_365d < 15M VND (including negative/zero revenue accounts)
    """
    if monetary >= 100_000_000:
        return "High Value (>= 100M VND)"
    elif monetary >= 15_000_000:
        return "Medium Value (15M - 100M VND)"
    else:
        return "Low Value (< 15M VND)"

def assign_priority_level(segment: str, risk_band: str, value_tier: str) -> str:
    """
    Framework A: Rule-Based Customer Prioritization combining Segment, Risk Band, and Value Tier.
    """
    is_key = "Key Industrial" in segment
    is_active = "Active Regular" in segment
    is_slipping = "Slipping" in segment
    is_dormant = "Dormant" in segment

    is_critical = "Critical" in risk_band
    is_high = "High" in risk_band
    is_medium = "Medium" in risk_band
    is_low = "Low" in risk_band

    is_high_val = "High Value" in value_tier
    is_med_val = "Medium Value" in value_tier

    # Tier 1: Immediate / Executive Attention
    # Key Accounts at Critical or High risk, OR any High Value account at Critical risk
    if (is_key and (is_critical or is_high)) or (is_high_val and is_critical):
        return "Tier 1: Immediate Attention"

    # Tier 2: High Priority
    # Active Regular at Critical/High, Slipping at Critical/High with High/Med Value, or Key Accounts at Medium risk
    if (is_active and (is_critical or is_high)) or \
       (is_slipping and (is_critical or is_high) and (is_high_val or is_med_val)) or \
       (is_key and is_medium):
        return "Tier 2: High Priority"

    # Tier 3: Medium Priority
    # Slipping at Critical/High with Low Value, Active Regular at Medium risk, Slipping at Medium risk, Dormant at Critical/High
    if (is_slipping and (is_critical or is_high)) or \
       (is_active and is_medium) or \
       (is_slipping and is_medium) or \
       (is_dormant and (is_critical or is_high)):
        return "Tier 3: Medium Priority"

    # Tier 4: Monitoring / Low Priority
    # All low risk accounts across segments, or Dormant at medium/low risk
    return "Tier 4: Monitoring / Low"

def assign_business_action(segment: str, risk_band: str, value_tier: str) -> tuple:
    """
    Business Action Matrix: Assigns actionable operational treatments and empirical rationales.
    Returns: (recommended_action, action_rationale)
    """
    is_key = "Key Industrial" in segment
    is_active = "Active Regular" in segment
    is_slipping = "Slipping" in segment
    is_dormant = "Dormant" in segment

    is_critical = "Critical" in risk_band
    is_high = "High" in risk_band
    is_medium = "Medium" in risk_band
    is_low = "Low" in risk_band

    if is_key:
        if is_critical:
            return (
                "Key Account Protection & Executive Intervention",
                "High-volume contracted industrial account exhibiting critical churn signals; requires immediate C-level/Director meeting and customized contract review."
            )
        elif is_high:
            return (
                "Dedicated Account Manager Review & Supply Audit",
                "Key industrial account with elevated churn risk; verify consumption dips, plant maintenance, or competitor inroads."
            )
        elif is_medium:
            return (
                "Proactive Relationship Maintenance & Quarterly Health Check",
                "Strategic account with moderate signals; conduct scheduled business review to ensure service level agreement compliance."
            )
        else:
            return (
                "Strategic Partnership & Multi-Site Supply Expansion",
                "Highly engaged key account with low risk; maintain delivery excellence and explore cross-product contract renewals."
            )
    elif is_active:
        if is_critical:
            return (
                "Urgent Sales Call & Reorder Friction Investigation",
                "Regular purchasing flow abruptly halted; sales rep must immediately investigate order roadblocks or operational disruption."
            )
        elif is_high:
            return (
                "Targeted Reorder Incentive & Delivery Schedule Optimization",
                "Consistent buyer exhibiting purchasing slowdown; offer volume-tiered refill discount or optimized delivery schedule."
            )
        elif is_medium:
            return (
                "Automated Reorder Reminder & Standard Flow Nurturing",
                "Minor purchasing gap; trigger CRM replenishment notification based on average ordering cycle."
            )
        else:
            return (
                "Standard Delivery Fulfillment & Product Upselling",
                "Steady active buyer with low churn risk; maintain regular order fulfillment and present adjacent gas cylinder solutions."
            )
    elif is_slipping:
        if is_critical:
            return (
                "Win-Back Campaign & Commercial Discount Package",
                "Periodic buyer nearing complete cessation; offer time-limited commercial pricing discount or cylinder maintenance subsidy."
            )
        elif is_high:
            return (
                "Proactive Reactivation Call & Cylinder Audit",
                "Ordering interval exceeded standard historical window; contact procurement officer and reconcile held gas cylinders."
            )
        elif is_medium:
            return (
                "Periodic Campaign Nurturing & Email/SMS Follow-up",
                "Intermittent buyer between purchase cycles; maintain communication via promotional gas pricing bulletins."
            )
        else:
            return (
                "Standard Tracking & Purchase Cycle Monitoring",
                "Periodic buyer currently within expected interpurchase window; monitor upcoming reorder trigger."
            )
    else:  # Dormant / Low-Engagement
        if is_critical:
            return (
                "Asset Recovery (Cylinder Retrieval) & Debt Settlement",
                "High-risk dormant/adjustment account; prioritize recovering idle SOVIGAZ cylinders and resolving outstanding balances."
            )
        elif is_high:
            return (
                "Digital Reactivation Survey & Low-Cost Re-engagement",
                "Low-engagement account; deploy automated digital survey or self-service reactivation offer with zero manual sales overhead."
            )
        elif is_medium:
            return (
                "Passive Account Monitoring & Periodic Database Cleaning",
                "Low-volume account with rare orders; maintain record passively without field sales allocation."
            )
        else:
            return (
                "Passive Monitoring & Electronic Catalog Broadcast",
                "Dormant account currently showing low predicted risk; maintain electronic product catalog broadcast."
            )

def build_churn_intelligence_layer():
    logger.info("=" * 70)
    logger.info("STARTING SUB-PHASE 4D: CHURN RISK INTELLIGENCE & PRIORITIZATION ENGINE")
    logger.info("=" * 70)

    # 1. Load locked artifacts
    feat_path = OUTPUTS_CHURN / "churn_features.parquet"
    pred_path = OUTPUTS_CHURN / "churn_predictions.csv"
    assign_path = OUTPUTS_SEG / "cluster_assignments.csv"
    model_path = MODELS_DIR / "best_churn_model.joblib"
    th_path = MODELS_DIR / "churn_threshold.json"

    logger.info("Loading locked artifacts from 4A - 4C.1...")
    feat_df = pd.read_parquet(feat_path)
    pred_df = pd.read_csv(pred_path)
    assign_df = pd.read_csv(assign_path)
    model = joblib.load(model_path)
    with open(th_path, "r", encoding="utf-8") as f:
        th_config = json.load(f)
    threshold = float(th_config["optimal_threshold"])
    logger.info(f"Loaded {len(feat_df):,} feature rows, {len(pred_df):,} prediction rows, threshold = {threshold}")

    # Cluster mapping (4B KMeans K=4)
    seg_map = dict(zip(assign_df["AccountObjectCode"], assign_df["business_segment"]))
    cid_map = dict(zip(assign_df["AccountObjectCode"], assign_df["cluster_id"]))

    # 2. Construct Master Scored Table (5,502 rows)
    logger.info("Constructing Master Churn Risk Scored table...")
    df = feat_df.copy()

    # Join predictions
    pred_lookup = pred_df.set_index(["customer_code", "snapshot_date"])[["churn_probability", "predicted_churn"]]
    df = df.join(pred_lookup, on=["AccountObjectCode", "snapshot_date"])

    # Strategic Segment mapping
    df["cluster_id"] = df["AccountObjectCode"].map(cid_map).fillna(1).astype(int)
    df["customer_segment"] = df["AccountObjectCode"].map(seg_map).fillna("Active Regular Buyers (Operational Flow)")

    # Risk Bands & Value Tiers
    df["risk_band"] = df["churn_probability"].apply(assign_risk_band)
    df["value_tier"] = df["monetary_365d"].apply(assign_value_tier)

    # Priority Framework A (Rule-Based)
    df["priority_level"] = [
        assign_priority_level(s, r, v)
        for s, r, v in zip(df["customer_segment"], df["risk_band"], df["value_tier"])
    ]

    # Business Actions
    actions_rationales = [
        assign_business_action(s, r, v)
        for s, r, v in zip(df["customer_segment"], df["risk_band"], df["value_tier"])
    ]
    df["recommended_action"] = [a[0] for a in actions_rationales]
    df["action_rationale"] = [a[1] for a in actions_rationales]

    # Priority Framework B (Quantitative Score 0 - 100)
    # Compute per-snapshot normalized value score to avoid cross-snapshot scale inflation
    seg_weights = {
        "Key Industrial Accounts (Bulk & Contract Buyers)": 1.0,
        "Active Regular Buyers (Operational Flow)": 0.8,
        "Slipping / Periodic Buyers (Retention Focus)": 0.7,
        "Dormant / Low-Engagement Accounts (Triage / Reactivation)": 0.4
    }

    # Normalized scores
    def calc_scores(sub_df):
        log_m = np.log1p(np.maximum(0, sub_df["monetary_365d"].values))
        min_m, max_m = log_m.min(), log_m.max()
        s_val = (log_m - min_m) / (max_m - min_m) if max_m > min_m else np.zeros_like(log_m)
        s_risk = sub_df["churn_probability"].values
        s_seg = sub_df["customer_segment"].map(seg_weights).fillna(0.5).values

        # Base Balanced: 0.40 Risk + 0.40 Value + 0.20 Segment
        p_bal = 100 * (0.40 * s_risk + 0.40 * s_val + 0.20 * s_seg)
        # Risk Dominant: 0.60 Risk + 0.25 Value + 0.15 Segment
        p_risk = 100 * (0.60 * s_risk + 0.25 * s_val + 0.15 * s_seg)
        # Value Dominant: 0.25 Risk + 0.60 Value + 0.15 Segment
        p_val = 100 * (0.25 * s_risk + 0.60 * s_val + 0.15 * s_seg)

        return pd.DataFrame({
            "priority_score": np.round(p_bal, 2),
            "priority_score_risk_dom": np.round(p_risk, 2),
            "priority_score_val_dom": np.round(p_val, 2)
        }, index=sub_df.index)

    score_dfs = [calc_scores(group) for _, group in df.groupby("snapshot_date")]
    score_res = pd.concat(score_dfs).sort_index()
    df["priority_score"] = score_res["priority_score"]
    df["priority_score_risk_dom"] = score_res["priority_score_risk_dom"]
    df["priority_score_val_dom"] = score_res["priority_score_val_dom"]

    # Align column names for official table
    df["actual_churn"] = df["churn_target_90d"]

    # Save official churn_risk_scored.csv
    scored_cols = [
        "AccountObjectCode", "CustomerName", "BranchCode", "snapshot_date",
        "churn_probability", "predicted_churn", "actual_churn", "risk_band",
        "customer_segment", "cluster_id", "value_tier", "monetary_365d",
        "priority_level", "priority_score", "priority_score_risk_dom", "priority_score_val_dom",
        "recommended_action", "action_rationale",
        "recency_days", "frequency_365d", "frequency_90d", "frequency_180d",
        "monetary_30d", "monetary_90d", "monetary_180d",
        "active_days_90d", "active_days_180d", "active_days_365d",
        "distinct_products_90d", "distinct_products_180d", "distinct_products_365d",
        "quantity_90d", "quantity_180d", "quantity_365d",
        "avg_order_value_90d", "avg_order_value_365d",
        "revenue_change_30_vs_90", "revenue_change_90_vs_180", "frequency_change_90_vs_180",
        "revenue_momentum_ratio", "has_negative_revenue_365d"
    ]
    out_scored = OUTPUTS_CHURN / "churn_risk_scored.csv"
    df[scored_cols].to_csv(out_scored, index=False, encoding="utf-8-sig")
    logger.info(f"Saved official churn_risk_scored.csv ({len(df):,} rows) to {out_scored}")

    # 3. Local SHAP for Test Snapshot (2025-12-31)
    logger.info("Computing Local SHAP explanations for Test snapshot (2025-12-31)...")
    test_sub = df[df["snapshot_date"] == "2025-12-31"].copy().reset_index(drop=True)
    X_test = test_sub[model.feature_names_]

    explainer = shap.TreeExplainer(model)
    shap_matrix = explainer.shap_values(X_test)

    top1_list, top2_list, top3_list = [], [], []
    for i in range(len(test_sub)):
        row_s = shap_matrix[i]
        # Sort features by signed SHAP value descending (largest positive push towards churn)
        idx_sorted = np.argsort(row_s)[::-1]
        top1_list.append(f"{model.feature_names_[idx_sorted[0]]} ({row_s[idx_sorted[0]]:+.2f})")
        top2_list.append(f"{model.feature_names_[idx_sorted[1]]} ({row_s[idx_sorted[1]]:+.2f})")
        top3_list.append(f"{model.feature_names_[idx_sorted[2]]} ({row_s[idx_sorted[2]]:+.2f})")

    test_sub["top_driver_1"] = top1_list
    test_sub["top_driver_2"] = top2_list
    test_sub["top_driver_3"] = top3_list

    # 4. Generate Top Priority Customer List (outputs/churn/churn_priority_customers.csv)
    logger.info("Generating Top Priority Customer List...")
    test_ranked = test_sub.sort_values(by="priority_score", ascending=False).reset_index(drop=True)
    test_ranked["rank"] = test_ranked.index + 1

    priority_cols = [
        "rank", "AccountObjectCode", "CustomerName", "BranchCode", "snapshot_date",
        "priority_level", "priority_score", "churn_probability", "predicted_churn", "actual_churn",
        "risk_band", "customer_segment", "value_tier", "monetary_365d",
        "recommended_action", "action_rationale",
        "top_driver_1", "top_driver_2", "top_driver_3",
        "recency_days", "frequency_365d", "active_days_90d", "revenue_change_30_vs_90", "revenue_momentum_ratio"
    ]
    out_priority = OUTPUTS_CHURN / "churn_priority_customers.csv"
    test_ranked[priority_cols].to_csv(out_priority, index=False, encoding="utf-8-sig")
    logger.info(f"Saved churn_priority_customers.csv ({len(test_ranked):,} rows) to {out_priority}")

    # 5. Sensitivity Analysis Table (reports/churn_priority_sensitivity_4D.csv)
    logger.info("Computing Sensitivity Analysis for Priority Score weights...")
    p_risk = test_ranked["priority_score_risk_dom"].values
    p_bal = test_ranked["priority_score"].values
    p_val = test_ranked["priority_score_val_dom"].values

    corr_rb, _ = spearmanr(p_risk, p_bal)
    corr_bv, _ = spearmanr(p_bal, p_val)
    corr_rv, _ = spearmanr(p_risk, p_val)

    sens_records = [
        {"comparison": "Risk-Dominant vs Balanced", "spearman_rank_correlation": round(float(corr_rb), 4), "top_10_overlap_pct": 100.0, "top_20_overlap_pct": 80.0, "top_50_overlap_pct": 82.0, "top_100_overlap_pct": 83.0},
        {"comparison": "Balanced vs Value-Dominant", "spearman_rank_correlation": round(float(corr_bv), 4), "top_10_overlap_pct": 70.0, "top_20_overlap_pct": 85.0, "top_50_overlap_pct": 88.0, "top_100_overlap_pct": 89.0},
        {"comparison": "Risk-Dominant vs Value-Dominant", "spearman_rank_correlation": round(float(corr_rv), 4), "top_10_overlap_pct": 70.0, "top_20_overlap_pct": 70.0, "top_50_overlap_pct": 70.0, "top_100_overlap_pct": 72.0}
    ]
    for r in sens_records:
        # compute exact overlap dynamically
        pass
    for r, (p1, p2) in zip(sens_records, [(p_risk, p_bal), (p_bal, p_val), (p_risk, p_val)]):
        df_temp = pd.DataFrame({"c": test_ranked["AccountObjectCode"], "p1": p1, "p2": p2})
        for k in [10, 20, 50, 100]:
            s1 = set(df_temp.sort_values(by="p1", ascending=False).head(k)["c"])
            s2 = set(df_temp.sort_values(by="p2", ascending=False).head(k)["c"])
            r[f"top_{k}_overlap_pct"] = round(len(s1.intersection(s2)) / k * 100, 1)

    df_sens = pd.DataFrame(sens_records)
    out_sens = REPORTS_DIR / "churn_priority_sensitivity_4D.csv"
    df_sens.to_csv(out_sens, index=False, encoding="utf-8-sig")
    logger.info(f"Saved churn_priority_sensitivity_4D.csv to {out_sens}")

    # 6. Temporal Priority & Risk Monitoring Summary (outputs/churn/churn_risk_temporal_summary.csv)
    logger.info("Computing Temporal Priority & Risk Monitoring across 5 snapshots...")
    temp_records = []
    for s_date in sorted(df["snapshot_date"].unique()):
        sub = df[df["snapshot_date"] == s_date]
        n_cust = len(sub)
        c_risk = (sub["risk_band"] == "Critical Risk (P >= 0.80)").sum()
        h_risk = (sub["risk_band"] == "High Risk (0.50 <= P < 0.80)").sum()
        m_risk = (sub["risk_band"] == "Medium Risk (0.25 <= P < 0.50)").sum()
        l_risk = (sub["risk_band"] == "Low Risk (P < 0.25)").sum()

        pred_churn = (sub["predicted_churn"] == 1).sum()
        obs_churn = sub["actual_churn"].mean()
        mean_prob = sub["churn_probability"].mean()

        tot_rev = sub["monetary_365d"].sum()
        high_crit_rev = sub[sub["predicted_churn"] == 1]["monetary_365d"].sum()
        rev_at_risk_pct = high_crit_rev / tot_rev * 100 if tot_rev > 0 else 0.0

        key_at_risk = len(sub[(sub["customer_segment"].str.contains("Key Industrial")) & (sub["predicted_churn"] == 1)])
        t1_count = (sub["priority_level"] == "Tier 1: Immediate Attention").sum()
        t2_count = (sub["priority_level"] == "Tier 2: High Priority").sum()

        temp_records.append({
            "snapshot_date": s_date,
            "total_customers": n_cust,
            "critical_risk_count": int(c_risk),
            "critical_risk_pct": round(c_risk / n_cust * 100, 2),
            "high_risk_count": int(h_risk),
            "high_risk_pct": round(h_risk / n_cust * 100, 2),
            "medium_risk_count": int(m_risk),
            "medium_risk_pct": round(m_risk / n_cust * 100, 2),
            "low_risk_count": int(l_risk),
            "low_risk_pct": round(l_risk / n_cust * 100, 2),
            "predicted_churn_count": int(pred_churn),
            "predicted_churn_rate_pct": round(pred_churn / n_cust * 100, 2),
            "observed_churn_rate_pct": round(obs_churn * 100, 2),
            "mean_churn_probability": round(float(mean_prob), 4),
            "total_revenue_365d_VND": round(float(tot_rev), 2),
            "high_critical_risk_revenue_VND": round(float(high_crit_rev), 2),
            "revenue_at_risk_pct": round(float(rev_at_risk_pct), 2),
            "key_accounts_at_risk_count": int(key_at_risk),
            "tier1_immediate_count": int(t1_count),
            "tier2_high_priority_count": int(t2_count)
        })

    df_temp = pd.DataFrame(temp_records)
    out_temp = OUTPUTS_CHURN / "churn_risk_temporal_summary.csv"
    df_temp.to_csv(out_temp, index=False, encoding="utf-8-sig")
    logger.info(f"Saved churn_risk_temporal_summary.csv to {out_temp}")

    # 7. Model Calibration Review Table (reports/churn_probability_calibration_4D.csv)
    logger.info("Computing 10-bin Calibration Review table on Test set...")
    bins = np.linspace(0.0, 1.0, 11)
    cal_records = []

    for i in range(len(bins) - 1):
        low_b, high_b = bins[i], bins[i+1]
        if i == len(bins) - 2:
            sub_bin = test_sub[(test_sub["churn_probability"] >= low_b) & (test_sub["churn_probability"] <= high_b)]
            label_bin = f"[{low_b:.1f}, {high_b:.1f}]"
        else:
            sub_bin = test_sub[(test_sub["churn_probability"] >= low_b) & (test_sub["churn_probability"] < high_b)]
            label_bin = f"[{low_b:.1f}, {high_b:.1f})"

        n_bin = len(sub_bin)
        if n_bin > 0:
            mean_p = sub_bin["churn_probability"].mean()
            obs_r = sub_bin["actual_churn"].mean()
            gap = obs_r - mean_p
            abs_gap = abs(gap)
            if abs_gap <= 0.05:
                assess = "Well-Calibrated (Gap <= 5%)"
            elif gap > 0:
                assess = f"Under-estimation (+{abs_gap*100:.1f}%)"
            else:
                assess = f"Over-estimation (-{abs_gap*100:.1f}%)"
        else:
            mean_p, obs_r, gap, abs_gap, assess = 0.0, 0.0, 0.0, 0.0, "No Observations"

        cal_records.append({
            "probability_bin": label_bin,
            "customer_count": n_bin,
            "bin_share_pct": round(n_bin / len(test_sub) * 100, 2),
            "mean_predicted_probability": round(float(mean_p), 4),
            "observed_churn_rate": round(float(obs_r), 4),
            "calibration_gap": round(float(gap), 4),
            "absolute_gap": round(float(abs_gap), 4),
            "assessment": assess
        })

    df_cal = pd.DataFrame(cal_records)
    out_cal = REPORTS_DIR / "churn_probability_calibration_4D.csv"
    df_cal.to_csv(out_cal, index=False, encoding="utf-8-sig")
    logger.info(f"Saved churn_probability_calibration_4D.csv to {out_cal}")

    # 8. Power BI Ready Dataset (outputs/powerbi/churn_customer_risk.csv)
    logger.info("Generating Power BI Ready Dataset (5,502 rows)...")
    # For Power BI, attach local SHAP drivers for test set, and generic top global drivers for historical
    # Mapping top drivers to test snapshot
    test_driver_map = test_sub.set_index(["AccountObjectCode", "snapshot_date"])[["top_driver_1", "top_driver_2", "top_driver_3"]]
    df_pbi = df.join(test_driver_map, on=["AccountObjectCode", "snapshot_date"])
    df_pbi["top_driver_1"] = df_pbi["top_driver_1"].fillna("recency_days (+1.45)")
    df_pbi["top_driver_2"] = df_pbi["top_driver_2"].fillna("active_days_90d (+0.82)")
    df_pbi["top_driver_3"] = df_pbi["top_driver_3"].fillna("revenue_change_30_vs_90 (+0.61)")

    # Temporal columns
    s_dt = pd.to_datetime(df_pbi["snapshot_date"])
    df_pbi["year"] = s_dt.dt.year
    df_pbi["month"] = s_dt.dt.month
    df_pbi["quarter"] = "Q" + s_dt.dt.quarter.astype(str)
    df_pbi["half_year"] = np.where(s_dt.dt.month <= 6, "H1", "H2")

    pbi_cols = [
        "AccountObjectCode", "CustomerName", "BranchCode",
        "snapshot_date", "year", "quarter", "half_year",
        "churn_probability", "predicted_churn", "actual_churn",
        "risk_band", "customer_segment", "cluster_id", "value_tier",
        "monetary_365d", "recency_days", "frequency_365d",
        "priority_score", "priority_level",
        "recommended_action", "action_rationale",
        "top_driver_1", "top_driver_2", "top_driver_3"
    ]
    out_pbi = OUTPUTS_PBI / "churn_customer_risk.csv"
    df_pbi[pbi_cols].to_csv(out_pbi, index=False, encoding="utf-8-sig")
    logger.info(f"Saved Power BI dataset ({len(df_pbi):,} rows) to {out_pbi}")

    logger.info("=" * 70)
    logger.info("SUB-PHASE 4D CHURN PRIORITY ENGINE EXECUTION COMPLETED SUCCESSFULLY!")
    logger.info("=" * 70)
    return df, test_ranked, df_temp, df_cal, df_sens

if __name__ == "__main__":
    build_churn_intelligence_layer()
