"""
SOVIGAZ Scientific Visualization Module for Forecasting
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns
import pandas as pd
import numpy as np

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from config.config import OUTPUTS_DIR

# Set global scientific plotting style
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Segoe UI", "DejaVu Sans", "Arial"],
    "axes.edgecolor": "#CCCCCC",
    "axes.linewidth": 0.8,
    "grid.color": "#E5E5E5",
    "grid.linestyle": "--",
    "grid.alpha": 0.7,
    "figure.dpi": 300,
    "axes.titlesize": 12,
    "axes.titleweight": "bold",
    "axes.labelsize": 10,
    "xtick.labelsize": 9,
    "ytick.labelsize": 9,
    "legend.fontsize": 9,
    "legend.frameon": True
})

FIGURES_DIR = OUTPUTS_DIR / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

def plot_actual_vs_forecast(
    df_eval: pd.DataFrame, 
    date_col: str, 
    actual_col: str, 
    pred_col: str, 
    title: str, 
    unit: str, 
    filename: str,
    train_df: Optional[pd.DataFrame] = None,
    train_actual_col: Optional[str] = None
):
    """
    Plots Actual vs Forecast across historical train (optional) and evaluation periods.
    """
    fig, ax = plt.subplots(figsize=(11, 4.8), dpi=300)

    if train_df is not None and not train_df.empty:
        col_to_plot = train_actual_col
        if col_to_plot is None:
            if actual_col in train_df.columns:
                col_to_plot = actual_col
            elif "Actual" in train_df.columns:
                col_to_plot = "Actual"
            elif "Revenue" in train_df.columns:
                col_to_plot = "Revenue"
            elif "MainQuantity" in train_df.columns:
                col_to_plot = "MainQuantity"
            else:
                num_cols = train_df.select_dtypes(include=[np.number]).columns
                col_to_plot = num_cols[0] if len(num_cols) > 0 else None

        if col_to_plot and col_to_plot in train_df.columns:
            ax.plot(
                pd.to_datetime(train_df[date_col]), 
                train_df[col_to_plot], 
                label="Historical Train Actual", 
                color="#888888", 
                linewidth=1.2, 
                alpha=0.6
            )

    # Actual Test
    ax.plot(
        pd.to_datetime(df_eval[date_col]), 
        df_eval[actual_col], 
        label="Actual Ground Truth", 
        color="#1F497D", 
        linewidth=2.0, 
        marker="o", 
        markersize=4
    )

    # Forecast Test
    ax.plot(
        pd.to_datetime(df_eval[date_col]), 
        df_eval[pred_col], 
        label="Model Forecast", 
        color="#D9534F", 
        linewidth=2.0, 
        linestyle="--", 
        marker="s", 
        markersize=4
    )

    ax.set_title(title, pad=12)
    ax.set_xlabel("Timeline")
    ax.set_ylabel(f"Value ({unit})")
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, loc: f"{x:,.0f}"))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
    ax.legend(loc="upper left")
    plt.tight_layout()

    out_path = FIGURES_DIR / filename
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path

def plot_residuals_over_time(
    dates: pd.Series, 
    residuals: np.ndarray, 
    title: str, 
    unit: str, 
    filename: str
):
    """
    Plots residual time series with 0-line and ±1 standard deviation band.
    """
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=300)
    dts = pd.to_datetime(dates)
    res = np.asarray(residuals)
    res_mean = np.mean(res)
    res_std = np.std(res)

    ax.bar(dts, res, color=np.where(res >= 0, "#2E7D32", "#C62828"), alpha=0.7, width=5, label="Residual (Actual - Forecast)")
    ax.axhline(0, color="black", linestyle="-", linewidth=1.0)
    ax.axhline(res_mean, color="#1F497D", linestyle="--", linewidth=1.2, label=f"Mean Residual ({res_mean:,.0f})")
    ax.fill_between(dts, res_mean - res_std, res_mean + res_std, color="#1F497D", alpha=0.1, label=f"±1 Std Dev Band ({res_std:,.0f})")

    ax.set_title(title, pad=12)
    ax.set_xlabel("Date")
    ax.set_ylabel(f"Residual ({unit})")
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, loc: f"{x:,.0f}"))
    ax.legend(loc="upper right")
    plt.tight_layout()

    out_path = FIGURES_DIR / filename
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path

def plot_model_comparison(
    metrics_df: pd.DataFrame, 
    metric_name: str, 
    title: str, 
    filename: str
):
    """
    Plots horizontal bar chart comparing models on a specified metric (e.g. WAPE, RMSE).
    """
    fig, ax = plt.subplots(figsize=(8.5, 4.0), dpi=300)
    df_sorted = metrics_df.sort_values(by=metric_name, ascending=True)

    colors = ["#1F497D" if "Baseline" not in str(m) else "#888888" for m in df_sorted["Model"]]
    bars = ax.barh(df_sorted["Model"], df_sorted[metric_name], color=colors, height=0.55)

    for bar in bars:
        w = bar.get_width()
        val_str = f"{w:.2f}%" if "WAPE" in metric_name or "sMAPE" in metric_name else f"{w:,.0f}"
        ax.text(w + (max(df_sorted[metric_name]) * 0.01), bar.get_y() + bar.get_height()/2, val_str, va="center", ha="left", fontsize=9)

    ax.set_title(title, pad=12)
    ax.set_xlabel(metric_name)
    ax.set_xlim(0, max(df_sorted[metric_name]) * 1.18)
    plt.tight_layout()

    out_path = FIGURES_DIR / filename
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path

def plot_monthly_seasonality(
    monthly_sales: pd.DataFrame, 
    title: str, 
    filename: str
):
    """
    Plots YoY Monthly Seasonality lines across 2023, 2024, 2025, 2026.
    """
    fig, ax = plt.subplots(figsize=(9, 4.5), dpi=300)
    df = monthly_sales.copy()
    df["Date"] = pd.to_datetime(df["Date"])
    df["Year"] = df["Date"].dt.year
    df["Month"] = df["Date"].dt.month

    palette = {2023: "#888888", 2024: "#2E7D32", 2025: "#1F497D", 2026: "#D9534F"}
    for yr, grp in df.groupby("Year"):
        if yr in palette:
            ax.plot(
                grp["Month"], 
                grp["Revenue"] / 1e9, 
                label=f"Năm {yr}", 
                color=palette[yr], 
                linewidth=2.2 if yr in [2025, 2026] else 1.4, 
                marker="o", 
                markersize=5
            )

    ax.set_title(title, pad=12)
    ax.set_xlabel("Tháng trong năm (Month of Year)")
    ax.set_ylabel("Doanh thu thuần (Tỷ VND)")
    ax.set_xticks(range(1, 13))
    ax.set_xticklabels([f"T{m}" for m in range(1, 13)])
    ax.axvspan(1.5, 2.5, color="#FFF3E0", alpha=0.6, label="Kỳ nghỉ Tết Nguyên Đán (Tháng 1-2)")
    ax.legend(loc="upper right")
    plt.tight_layout()

    out_path = FIGURES_DIR / filename
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path

def plot_error_distribution(
    residuals: np.ndarray, 
    title: str, 
    filename: str
):
    """
    Plots residual histogram with KDE and normal reference curve.
    """
    fig, ax = plt.subplots(figsize=(7.5, 4.0), dpi=300)
    res = np.asarray(residuals)

    sns.histplot(res, kde=True, color="#1F497D", stat="density", ax=ax, bins=15, alpha=0.5)
    ax.axvline(0, color="black", linestyle="--", linewidth=1.0, label="Zero Error Line")
    ax.axvline(np.mean(res), color="#D9534F", linestyle="-", linewidth=1.2, label=f"Mean Error: {np.mean(res):,.0f}")

    ax.set_title(title, pad=12)
    ax.set_xlabel("Forecast Error (Residual = Actual - Forecast)")
    ax.set_ylabel("Density")
    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, loc: f"{x:,.0f}"))
    ax.legend(loc="upper right")
    plt.tight_layout()

    out_path = FIGURES_DIR / filename
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path
