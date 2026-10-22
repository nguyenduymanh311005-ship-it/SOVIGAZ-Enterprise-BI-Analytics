"""
SOVIGAZ Forecasting Evaluation & Residual Diagnostics
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import numpy as np
import pandas as pd
from typing import Dict, Union

def compute_forecast_metrics(
    y_true: Union[pd.Series, np.ndarray], 
    y_pred: Union[pd.Series, np.ndarray],
    eps: float = 1e-8
) -> Dict[str, float]:
    """
    Computes rigorous forecasting metrics: MAE, RMSE, WAPE, sMAPE.
    Handles zero values and division by zero safely.
    """
    y_t = np.asarray(y_true, dtype=float)
    y_p = np.asarray(y_pred, dtype=float)

    if len(y_t) == 0:
        return {"MAE": 0.0, "RMSE": 0.0, "WAPE": 0.0, "sMAPE": 0.0}

    # Absolute errors
    abs_errors = np.abs(y_t - y_p)
    squared_errors = (y_t - y_p) ** 2

    mae = float(np.mean(abs_errors))
    rmse = float(np.sqrt(np.mean(squared_errors)))

    # WAPE = sum(|actual - pred|) / sum(|actual|)
    sum_actual = float(np.sum(np.abs(y_t)))
    if sum_actual > 0:
        wape = float(np.sum(abs_errors) / sum_actual)
    else:
        wape = 0.0

    # sMAPE = mean( 2 * |actual - pred| / (|actual| + |pred| + eps) ) * 100
    denom = np.abs(y_t) + np.abs(y_p)
    # where both are 0, error is 0
    zero_mask = (denom < eps)
    smape_terms = np.where(zero_mask, 0.0, 2.0 * abs_errors / (denom + eps))
    smape = float(np.mean(smape_terms) * 100.0)

    return {
        "MAE": round(mae, 2),
        "RMSE": round(rmse, 2),
        "WAPE": round(wape, 4),
        "sMAPE": round(smape, 2)
    }

def analyze_residuals(
    y_true: Union[pd.Series, np.ndarray], 
    y_pred: Union[pd.Series, np.ndarray],
    dates: pd.Series
) -> Dict:
    """
    Performs in-depth residual diagnostics (PHẦN 13):
    - residual mean, std, skewness
    - autocorrelation at lag 1 (Durbin-Watson proxy)
    - underforecasting vs overforecasting periods
    """
    y_t = np.asarray(y_true, dtype=float)
    y_p = np.asarray(y_pred, dtype=float)
    residuals = y_t - y_p

    res_mean = float(np.mean(residuals))
    res_std = float(np.std(residuals))
    
    # Skewness
    if res_std > 0:
        res_skew = float(np.mean(((residuals - res_mean) / res_std) ** 3))
    else:
        res_skew = 0.0

    # Lag 1 autocorrelation of residuals
    if len(residuals) > 2:
        r_t = residuals[1:]
        r_t_1 = residuals[:-1]
        denom_ac = np.std(r_t) * np.std(r_t_1)
        if denom_ac > 0:
            autocorr_lag1 = float(np.mean((r_t - np.mean(r_t)) * (r_t_1 - np.mean(r_t_1))) / denom_ac)
        else:
            autocorr_lag1 = 0.0
    else:
        autocorr_lag1 = 0.0

    under_count = int(np.sum(residuals > 0)) # Actual > Forecast (Underforecasting)
    over_count = int(np.sum(residuals < 0))  # Actual < Forecast (Overforecasting)
    exact_count = int(np.sum(residuals == 0))

    # Bias assessment
    if abs(res_mean) < (0.05 * (np.mean(y_t) if np.mean(y_t) != 0 else 1)):
        bias_verdict = "Low Bias (Well centered around 0)"
    elif res_mean > 0:
        bias_verdict = "Underforecasting Bias (Model systematically underpredicts actual demand)"
    else:
        bias_verdict = "Overforecasting Bias (Model systematically overpredicts actual demand)"

    return {
        "residual_mean": round(res_mean, 2),
        "residual_std": round(res_std, 2),
        "residual_skewness": round(res_skew, 2),
        "autocorrelation_lag1": round(autocorr_lag1, 3),
        "underforecasting_periods": under_count,
        "overforecasting_periods": over_count,
        "exact_periods": exact_count,
        "bias_verdict": bias_verdict,
        "residuals": residuals
    }
