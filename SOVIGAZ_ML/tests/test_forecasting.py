"""
SOVIGAZ Forecasting Pipeline Unit Tests (Phase 3)
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""
import sys
from pathlib import Path
import unittest
import numpy as np
import pandas as pd

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.evaluation.forecast_evaluator import compute_forecast_metrics, analyze_residuals
from src.models.baseline_forecaster import NaiveForecaster, SeasonalNaiveForecaster, MovingAverageForecaster
from src.features.holiday_features import add_tet_features_weekly, add_tet_features_monthly
from config.config import OUTPUTS_DIR, MODELS_DIR

class TestForecastingPipeline(unittest.TestCase):

    def test_metrics_calculation(self):
        y_true = np.array([100.0, 200.0, 300.0, 400.0])
        y_pred = np.array([110.0, 190.0, 300.0, 420.0])
        
        metrics = compute_forecast_metrics(y_true, y_pred)
        self.assertEqual(metrics["MAE"], 10.0)
        self.assertAlmostEqual(metrics["RMSE"], np.sqrt((100 + 100 + 0 + 400) / 4), places=2)
        # WAPE = sum(|y_true - y_pred|) / sum(y_true) = 40 / 1000 = 0.04 (4%)
        self.assertTrue(np.isclose(metrics["WAPE"], 0.04))
        self.assertGreater(metrics["sMAPE"], 0)

    def test_baseline_forecasters(self):
        # Naive Forecaster: y(t) = y(t-1)
        naive = NaiveForecaster()
        train_y = np.array([10, 20, 30, 40, 50])
        naive.fit(train_y)
        preds = naive.predict(horizon=3)
        self.assertEqual(len(preds), 3)
        self.assertTrue(np.all(preds == 50))

        # Seasonal Naive: y(t) = y(t-s)
        s_naive = SeasonalNaiveForecaster(season_length=4)
        train_s = np.array([1, 2, 3, 4, 5, 6, 7, 8])
        s_naive.fit(train_s)
        preds_s = s_naive.predict(horizon=4)
        np.testing.assert_array_equal(preds_s, np.array([5, 6, 7, 8]))

        # Moving Average: mean of last k
        ma = MovingAverageForecaster(window=3)
        ma.fit(np.array([10, 20, 30, 40, 50]))
        preds_ma = ma.predict(horizon=2)
        self.assertTrue(np.all(preds_ma == (30 + 40 + 50) / 3))

    def test_tet_holiday_feature(self):
        dates = pd.to_datetime(["2024-02-10", "2024-02-17", "2024-06-01"])
        df = pd.DataFrame({"Date": dates})
        df_tet = add_tet_features_weekly(df, "Date")
        
        self.assertIn("is_tet_holiday", df_tet.columns)
        self.assertIn("weeks_to_tet", df_tet.columns)
        # 2024-02-10 is Mùng 1 Tết Giáp Thìn -> is_tet_holiday == 1
        self.assertEqual(df_tet.loc[0, "is_tet_holiday"], 1)
        self.assertEqual(df_tet.loc[2, "is_tet_holiday"], 0)

    def test_forecasting_artifacts_exist(self):
        out_dir = OUTPUTS_DIR / "forecasting"
        fig_dir = OUTPUTS_DIR / "figures"
        model_dir = MODELS_DIR

        self.assertTrue((out_dir / "weekly_revenue_forecast.csv").exists())
        self.assertTrue((out_dir / "monthly_revenue_forecast.csv").exists())
        self.assertTrue((out_dir / "product_demand_forecast.csv").exists())
        self.assertTrue((out_dir / "forecast_powerbi.csv").exists())

        # Check 9 figures
        expected_figures = [
            "01_actual_vs_forecast_revenue_weekly.png",
            "02_actual_vs_forecast_revenue_monthly.png",
            "03_actual_vs_forecast_oxl_sx.png",
            "04_actual_vs_forecast_ntl_sx.png",
            "05_actual_vs_forecast_oxk6.png",
            "06_weekly_revenue_residuals_over_time.png",
            "07_weekly_model_comparison_wape.png",
            "08_monthly_seasonality.png",
            "09_weekly_error_distribution.png"
        ]
        for fig in expected_figures:
            self.assertTrue((fig_dir / fig).exists(), f"Missing figure: {fig}")

        # Check models and parameters
        self.assertTrue((model_dir / "metrics.json").exists())
        self.assertTrue((model_dir / "model_params.json").exists())
        self.assertTrue((model_dir / "best_weekly_revenue_model.joblib").exists())
        self.assertTrue((model_dir / "best_monthly_revenue_model.joblib").exists())

if __name__ == "__main__":
    unittest.main(verbosity=2)
