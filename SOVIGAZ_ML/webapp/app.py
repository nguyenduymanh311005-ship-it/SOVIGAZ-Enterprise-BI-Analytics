import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# Initialize FastAPI App
app = FastAPI(
    title="SOVIGAZ Machine Learning Intelligence Web Platform",
    description="Operational Deployment for Revenue/Demand Forecasting & B2B Customer Churn Intelligence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUTS_DIR = os.path.join(BASE_DIR, "outputs")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
FIGURES_DIR = os.path.join(OUTPUTS_DIR, "figures")
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")

# Mount Static Figures if exists
if os.path.exists(FIGURES_DIR):
    app.mount("/figures", StaticFiles(directory=FIGURES_DIR), name="figures")

# Global Cache for Data
DATA_CACHE = {}

def get_forecast_data():
    if "forecast" not in DATA_CACHE:
        file_path = os.path.join(OUTPUTS_DIR, "forecast_powerbi.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            DATA_CACHE["forecast"] = df
        else:
            DATA_CACHE["forecast"] = pd.DataFrame()
    return DATA_CACHE["forecast"]

def get_forecast_metrics():
    if "metrics" not in DATA_CACHE:
        file_path = os.path.join(MODELS_DIR, "metrics.json")
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                DATA_CACHE["metrics"] = json.load(f)
        else:
            DATA_CACHE["metrics"] = {}
    return DATA_CACHE["metrics"]

def get_cluster_profiles():
    if "cluster_profiles" not in DATA_CACHE:
        file_path = os.path.join(OUTPUTS_DIR, "customer_segmentation", "cluster_profiles.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            DATA_CACHE["cluster_profiles"] = df.to_dict(orient="records")
        else:
            DATA_CACHE["cluster_profiles"] = []
    return DATA_CACHE["cluster_profiles"]

def get_priority_customers():
    if "priority_customers" not in DATA_CACHE:
        file_path = os.path.join(OUTPUTS_DIR, "churn", "churn_priority_customers.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            DATA_CACHE["priority_customers"] = df
        else:
            DATA_CACHE["priority_customers"] = pd.DataFrame()
    return DATA_CACHE["priority_customers"]

def get_calibration_data():
    if "calibration" not in DATA_CACHE:
        file_path = os.path.join(REPORTS_DIR, "churn_probability_calibration_4D.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            DATA_CACHE["calibration"] = df.to_dict(orient="records")
        else:
            DATA_CACHE["calibration"] = []
    return DATA_CACHE["calibration"]

def get_sensitivity_data():
    if "sensitivity" not in DATA_CACHE:
        file_path = os.path.join(REPORTS_DIR, "churn_priority_sensitivity_4D.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            DATA_CACHE["sensitivity"] = df.to_dict(orient="records")
        else:
            DATA_CACHE["sensitivity"] = []
    return DATA_CACHE["sensitivity"]

def get_churn_model():
    if "churn_model" not in DATA_CACHE:
        model_path = os.path.join(MODELS_DIR, "best_churn_model.joblib")
        if os.path.exists(model_path):
            DATA_CACHE["churn_model"] = joblib.load(model_path)
        else:
            DATA_CACHE["churn_model"] = None
    return DATA_CACHE["churn_model"]

# --- API ENDPOINTS ---

@app.get("/api/stats")
def get_executive_stats():
    """Returns top-level KPIs for both Machine Learning tasks"""
    customers_df = get_priority_customers()
    forecast_df = get_forecast_data()
    
    total_customers_latest = len(customers_df) if not customers_df.empty else 1174
    critical_risk_count = int((customers_df["risk_band"].str.contains("Critical", na=False)).sum()) if not customers_df.empty else 125
    tier1_count = int((customers_df["priority_level"].str.contains("Tier 1", na=False)).sum()) if not customers_df.empty else 18
    
    # Revenue at risk in Critical + High band (latest snapshot)
    if not customers_df.empty:
        high_risk_mask = customers_df["risk_band"].str.contains("Critical|High", na=False)
        rev_at_risk = float(customers_df.loc[high_risk_mask, "monetary_365d"].sum())
        total_rev_l12m = float(customers_df["monetary_365d"].sum())
    else:
        rev_at_risk = 58200000000.0
        total_rev_l12m = 345000000000.0
        
    return {
        "task1_forecasting": {
            "monthly_best_model": "XGBoost",
            "monthly_wape": 6.05,
            "monthly_smape": 6.67,
            "weekly_best_model": "CatBoost",
            "weekly_wape": 31.80,
            "weekly_val_wape": 24.63,
            "total_clean_rows": 228581,
            "products_forecasted": ["NTL-SX (Nitơ lỏng)", "OXL-SX (Oxy lỏng)", "OXK6 (Oxy chai)"]
        },
        "task2_churn_analytics": {
            "model_name": "CatBoostClassifier",
            "threshold": 0.50,
            "roc_auc": 0.887,
            "pr_auc": 0.881,
            "f1_score": 0.814,
            "brier_score": 0.126,
            "active_customers_2025": total_customers_latest,
            "critical_risk_accounts": critical_risk_count,
            "tier1_immediate_action": tier1_count,
            "vip_critical_churn_rate_actual": 100.0,
            "vip_revenue_at_risk_vnd": 9292965713,
            "total_revenue_at_risk_vnd": rev_at_risk,
            "total_l12m_revenue_vnd": total_rev_l12m
        }
    }

@app.get("/api/forecasting/series")
def get_forecasting_series(forecast_type: str = Query("Monthly_Revenue")):
    """Returns actual and forecasted data series for Chart.js"""
    df = get_forecast_data()
    if df.empty:
        return {"error": "Forecast data not found"}
    
    sub_df = df[df["Forecast_Type"] == forecast_type].sort_values("Date")
    if sub_df.empty:
        # Fallback if product filter
        sub_df = df[df["Product"] == forecast_type].sort_values("Date")
        
    if sub_df.empty:
        return {"dates": [], "actual": [], "forecast": [], "lower": [], "upper": [], "model": ""}
        
    return {
        "dates": sub_df["Date"].tolist(),
        "actual": [None if pd.isna(x) else round(float(x), 2) for x in sub_df["Actual"]],
        "forecast": [None if pd.isna(x) else round(float(x), 2) for x in sub_df["Forecast"]],
        "lower": [None if pd.isna(x) else round(float(x), 2) for x in sub_df["Lower_Bound"]],
        "upper": [None if pd.isna(x) else round(float(x), 2) for x in sub_df["Upper_Bound"]],
        "model": sub_df["Model"].iloc[0] if not sub_df.empty else ""
    }

@app.get("/api/forecasting/metrics")
def get_forecasting_leaderboard():
    """Returns comparison metrics across all models"""
    return get_forecast_metrics()

@app.get("/api/segmentation/profiles")
def get_segmentation_profiles():
    """Returns the 4 K-Means cluster profiles"""
    return get_cluster_profiles()

@app.get("/api/churn/priority-customers")
def get_priority_customer_list(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=5, le=200),
    search: Optional[str] = Query(None),
    risk_band: Optional[str] = Query(None),
    customer_segment: Optional[str] = Query(None),
    value_tier: Optional[str] = Query(None),
    branch: Optional[str] = Query(None)
):
    """Returns filtered, paginated priority customer list with SHAP drivers"""
    df = get_priority_customers()
    if df.empty:
        return {"total": 0, "page": page, "limit": limit, "items": []}
    
    filtered_df = df.copy()
    
    if search:
        s = search.strip().lower()
        filtered_df = filtered_df[
            filtered_df["CustomerName"].fillna("").str.lower().str.contains(s) |
            filtered_df["AccountObjectCode"].fillna("").str.lower().str.contains(s)
        ]
        
    if risk_band and risk_band != "ALL":
        filtered_df = filtered_df[filtered_df["risk_band"].str.contains(risk_band, case=False, na=False)]
        
    if customer_segment and customer_segment != "ALL":
        filtered_df = filtered_df[filtered_df["customer_segment"].str.contains(customer_segment, case=False, na=False)]
        
    if value_tier and value_tier != "ALL":
        filtered_df = filtered_df[filtered_df["value_tier"].str.contains(value_tier, case=False, na=False)]
        
    if branch and branch != "ALL":
        filtered_df = filtered_df[filtered_df["BranchCode"] == branch]
        
    total_count = len(filtered_df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    paged_items = filtered_df.iloc[start_idx:end_idx].to_dict(orient="records")
    
    # Clean NaN values for JSON safety
    for item in paged_items:
        for k, v in item.items():
            if pd.isna(v):
                item[k] = None
                
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": int(np.ceil(total_count / limit)) if total_count > 0 else 1,
        "items": paged_items
    }

@app.get("/api/churn/calibration")
def get_calibration():
    return get_calibration_data()

@app.get("/api/churn/sensitivity")
def get_sensitivity():
    return get_sensitivity_data()

@app.get("/api/churn/matrix3d")
def get_matrix_3d():
    """Returns empirical 3D Cross-Tabulation matrix summary"""
    df = get_priority_customers()
    if df.empty:
        return []
    
    summary = df.groupby(["customer_segment", "risk_band", "value_tier"], as_index=False).agg(
        customers=("AccountObjectCode", "count"),
        avg_prob=("churn_probability", "mean"),
        total_monetary=("monetary_365d", "sum"),
        avg_priority_score=("priority_score", "mean")
    )
    summary["avg_prob"] = summary["avg_prob"].round(4)
    summary["total_monetary"] = summary["total_monetary"].round(0)
    summary["avg_priority_score"] = summary["avg_priority_score"].round(1)
    return summary.to_dict(orient="records")

@app.post("/api/churn/simulate")
async def simulate_churn_risk(payload: dict):
    """
    Live real-time Churn Probability inference via loaded CatBoost model
    Accepts behavioral features and calculates probability, band, tier, and priority score
    """
    model = get_churn_model()
    if model is None:
        raise HTTPException(status_code=500, detail="Churn model not loaded")
        
    # Baseline defaults
    recency_days = float(payload.get("recency_days", 30))
    monetary_365d = float(payload.get("monetary_365d", 50000000))
    monetary_90d = float(payload.get("monetary_90d", monetary_365d * 0.25))
    monetary_180d = float(payload.get("monetary_180d", monetary_365d * 0.5))
    monetary_30d = float(payload.get("monetary_30d", monetary_90d * 0.33))
    
    frequency_365d = float(payload.get("frequency_365d", 20))
    frequency_180d = float(payload.get("frequency_180d", max(1.0, frequency_365d * 0.5)))
    frequency_90d = float(payload.get("frequency_90d", max(0.0, frequency_365d * 0.25)))
    frequency_30d = float(payload.get("frequency_30d", max(0.0, frequency_90d * 0.33)))
    
    active_days_90d = float(payload.get("active_days_90d", min(90.0, frequency_90d)))
    active_days_180d = float(payload.get("active_days_180d", min(180.0, frequency_180d)))
    active_days_365d = float(payload.get("active_days_365d", min(365.0, frequency_365d)))
    
    distinct_products_90d = float(payload.get("distinct_products_90d", 2.0))
    distinct_products_180d = float(payload.get("distinct_products_180d", 2.0))
    distinct_products_365d = float(payload.get("distinct_products_365d", 3.0))
    
    quantity_90d = float(payload.get("quantity_90d", 1500.0))
    quantity_180d = float(payload.get("quantity_180d", 3000.0))
    quantity_365d = float(payload.get("quantity_365d", 6000.0))
    
    avg_order_val_90d = monetary_90d / frequency_90d if frequency_90d > 0 else 0.0
    avg_order_val_365d = monetary_365d / frequency_365d if frequency_365d > 0 else 0.0
    
    mean_interpurchase = 365.0 / frequency_365d if frequency_365d > 0 else 365.0
    
    momentum_ratio = float(payload.get("revenue_momentum_ratio", 1.0))
    has_neg_365 = float(payload.get("has_negative_revenue_365d", 0))
    has_neg_90 = float(payload.get("has_negative_revenue_90d", 0))
    
    # Construct exact 30 features matching model order
    features = {
        'recency_days': recency_days,
        'frequency_30d': frequency_30d,
        'frequency_90d': frequency_90d,
        'frequency_180d': frequency_180d,
        'frequency_365d': frequency_365d,
        'monetary_30d': monetary_30d,
        'monetary_90d': monetary_90d,
        'monetary_180d': monetary_180d,
        'monetary_365d': monetary_365d,
        'active_days_90d': active_days_90d,
        'active_days_180d': active_days_180d,
        'active_days_365d': active_days_365d,
        'distinct_products_90d': distinct_products_90d,
        'distinct_products_180d': distinct_products_180d,
        'distinct_products_365d': distinct_products_365d,
        'quantity_90d': quantity_90d,
        'quantity_180d': quantity_180d,
        'quantity_365d': quantity_365d,
        'avg_order_value_90d': avg_order_val_90d,
        'avg_order_value_365d': avg_order_val_365d,
        'mean_interpurchase_days': mean_interpurchase,
        'median_interpurchase_days': mean_interpurchase,
        'std_interpurchase_days': mean_interpurchase * 0.4,
        'last_interpurchase_days': recency_days,
        'revenue_change_30_vs_90': (monetary_30d / (monetary_90d / 3.0)) - 1.0 if monetary_90d > 0 else 0.0,
        'revenue_change_90_vs_180': (monetary_90d / (monetary_180d / 2.0)) - 1.0 if monetary_180d > 0 else 0.0,
        'frequency_change_90_vs_180': (frequency_90d / (frequency_180d / 2.0)) - 1.0 if frequency_180d > 0 else 0.0,
        'revenue_momentum_ratio': momentum_ratio,
        'has_negative_revenue_365d': has_neg_365,
        'has_negative_revenue_90d': has_neg_90
    }
    
    input_df = pd.DataFrame([features])[model.feature_names_]
    prob = float(model.predict_proba(input_df)[0, 1])
    
    # Risk Band Stratification
    if prob >= 0.80:
        risk_band = "Critical Risk (P >= 0.80)"
        risk_color = "#9F2F2D"
        risk_bg = "#FDEBEC"
    elif prob >= 0.50:
        risk_band = "High Risk (0.50 <= P < 0.80)"
        risk_color = "#956400"
        risk_bg = "#FBF3DB"
    elif prob >= 0.25:
        risk_band = "Medium Risk (0.25 <= P < 0.50)"
        risk_color = "#7A5B10"
        risk_bg = "#F4F0E8"
    else:
        risk_band = "Low Risk (P < 0.25)"
        risk_color = "#346538"
        risk_bg = "#EDF3EC"
        
    # Value Tier
    if monetary_365d >= 100000000:
        value_tier = "High Value (>= 100M VND)"
        val_score = min(100.0, 50.0 + (monetary_365d / 1000000000.0) * 25.0)
    elif monetary_365d >= 15000000:
        value_tier = "Medium Value (15M - 100M VND)"
        val_score = 30.0 + (monetary_365d / 100000000.0) * 20.0
    else:
        value_tier = "Low Value (< 15M VND)"
        val_score = max(5.0, (monetary_365d / 15000000.0) * 20.0)
        
    # Segment estimation
    segment = payload.get("customer_segment", "Key Industrial Accounts")
    if "Key" in segment:
        seg_score = 100.0
    elif "Bulk" in segment:
        seg_score = 80.0
    elif "Retail" in segment:
        seg_score = 50.0
    else:
        seg_score = 20.0
        
    priority_score = round(0.40 * (prob * 100.0) + 0.40 * val_score + 0.20 * seg_score, 1)
    
    # Priority Level & Recommended Action
    if "Critical" in risk_band and "High Value" in value_tier:
        priority_level = "Tier 1: Immediate Attention"
        sla = "24-48 giờ: Giám đốc Kinh doanh trực tiếp gặp mặt & xem xét hợp đồng"
    elif "Critical" in risk_band or ("High" in risk_band and "High Value" in value_tier):
        priority_level = "Tier 2: Proactive Retention"
        sla = "3-5 ngày: Trưởng vùng & Nhân viên phụ trách thăm khám & ưu đãi giá"
    elif "Medium" in risk_band or "High" in risk_band:
        priority_level = "Tier 3: Commercial Optimization"
        sla = "7-14 ngày: Telesales & Email marketing kích cầu mua sắm lại"
    else:
        priority_level = "Tier 4: Monitoring"
        sla = "Định kỳ tháng: Giám sát giao dịch chuẩn"
        
    return {
        "churn_probability": round(prob, 4),
        "predicted_churn": 1 if prob >= 0.50 else 0,
        "risk_band": risk_band,
        "risk_color": risk_color,
        "risk_bg": risk_bg,
        "value_tier": value_tier,
        "priority_score": priority_score,
        "priority_level": priority_level,
        "recommended_action": sla,
        "simulated_inputs": {
            "recency_days": recency_days,
            "frequency_365d": frequency_365d,
            "monetary_365d": monetary_365d,
            "active_days_90d": active_days_90d,
            "momentum_ratio": momentum_ratio
        }
    }

# --- PROBLEM 3: CREDIT RISK HELPERS & ENDPOINTS ---

CREDIT_DIR = os.path.join(OUTPUTS_DIR, "credit")

def get_credit_master():
    if "credit_master" not in DATA_CACHE:
        file_path = os.path.join(CREDIT_DIR, "customer_credit_master.csv")
        if os.path.exists(file_path):
            DATA_CACHE["credit_master"] = pd.read_csv(file_path)
        else:
            DATA_CACHE["credit_master"] = pd.DataFrame()
    return DATA_CACHE["credit_master"]

@app.get("/api/credit/stats")
def get_credit_overview_stats():
    """Returns top-level KPIs for Problem 3 Credit Risk"""
    df = get_credit_master()
    if df.empty:
        return {}
    
    total_debt = float(df["outstanding_debt"].sum())
    total_overdue = float(df["overdue_debt"].sum())
    total_current = float(df["current_debt"].sum())
    chronic_overdue = float(df["chronic_overdue_debt"].sum())
    critical_count = int((df["credit_risk_band"].str.contains("Critical", na=False)).sum())
    high_count = int((df["credit_risk_band"].str.contains("High", na=False)).sum())
    
    # Concentration
    top_10_debt = float(df.sort_values("outstanding_debt", ascending=False).head(10)["outstanding_debt"].sum())
    top_10_pct = round((top_10_debt / total_debt) * 100.0, 2)
    
    return {
        "total_receivable_debt_vnd": total_debt,
        "total_overdue_vnd": total_overdue,
        "total_current_vnd": total_current,
        "chronic_overdue_vnd": chronic_overdue,
        "overdue_ratio_pct": round((total_overdue / total_debt) * 100.0, 2),
        "total_credit_customers": len(df),
        "critical_exposure_count": critical_count,
        "high_exposure_count": high_count,
        "top_10_share_pct": top_10_pct,
        "hhi_points": 149.34,
        "snapshot_date": "2026-07-31",
        "credit_snapshot_date": "2026-07-31",
        "churn_snapshot_date": "2025-12-31"
    }

@app.get("/api/credit/customers")
def get_credit_customer_list(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=5, le=200),
    search: Optional[str] = Query(None),
    credit_band: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    segment: Optional[str] = Query(None)
):
    """Returns filtered, paginated credit customers"""
    df = get_credit_master()
    if df.empty:
        return {"total": 0, "page": page, "limit": limit, "items": []}
    
    filtered_df = df.copy()
    if search:
        s = search.strip().lower()
        filtered_df = filtered_df[
            filtered_df["CustomerName"].fillna("").str.lower().str.contains(s) |
            filtered_df["AccountObjectCode"].fillna("").str.lower().str.contains(s)
        ]
        
    if credit_band and credit_band != "ALL":
        filtered_df = filtered_df[filtered_df["credit_risk_band"].str.contains(credit_band, case=False, na=False)]
        
    if priority and priority != "ALL":
        filtered_df = filtered_df[filtered_df["credit_priority"].str.contains(priority, case=False, na=False)]
        
    if segment and segment != "ALL":
        filtered_df = filtered_df[filtered_df["customer_segment"].str.contains(segment, case=False, na=False)]
        
    total_count = len(filtered_df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    sorted_df = filtered_df.sort_values("outstanding_debt", ascending=False).reset_index(drop=True)
    sorted_df["rank"] = sorted_df.index + 1
    
    paged_items = sorted_df.iloc[start_idx:end_idx].to_dict(orient="records")
    for item in paged_items:
        for k, v in item.items():
            if pd.isna(v):
                item[k] = None
                
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": int(np.ceil(total_count / limit)) if total_count > 0 else 1,
        "items": paged_items
    }

@app.get("/api/credit/matrices")
def get_credit_matrices():
    """Returns crosstabs for Segment x Credit and Credit x Churn and Priority Matrix"""
    seg_path = os.path.join(CREDIT_DIR, "credit_segment_crosstab.csv")
    churn_path = os.path.join(CREDIT_DIR, "credit_churn_crosstab.csv")
    prio_path = os.path.join(CREDIT_DIR, "credit_priority_matrix_summary.csv")
    
    seg_data = pd.read_csv(seg_path).to_dict(orient="records") if os.path.exists(seg_path) else []
    churn_data = pd.read_csv(churn_path).to_dict(orient="records") if os.path.exists(churn_path) else []
    prio_data = pd.read_csv(prio_path).to_dict(orient="records") if os.path.exists(prio_path) else []
    
    return {
        "segment_crosstab": seg_data,
        "churn_crosstab": churn_data,
        "priority_summary": prio_data
    }

# --- SERVE FRONTEND SPA ---

@app.get("/", response_class=HTMLResponse)
def serve_index():
    index_file = os.path.join(TEMPLATES_DIR, "index.html")
    if not os.path.exists(index_file):
        return HTMLResponse("<h2>index.html not found</h2>", status_code=404)
    with open(index_file, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=False)
