"""
SOVIGAZ Forecasting Baselines
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import numpy as np
import pandas as pd
from typing import List, Union

class NaiveForecaster:
    """
    Naive baseline: y(t) = y(t-1).
    Predicts the most recent known observation.
    """
    def __init__(self):
        self.last_value = None

    def fit(self, y_train: Union[pd.Series, np.ndarray]):
        if isinstance(y_train, pd.Series):
            self.last_value = float(y_train.iloc[-1])
        else:
            self.last_value = float(y_train[-1])
        return self

    def predict(self, horizon: int = 1) -> np.ndarray:
        return np.full(horizon, self.last_value)

    def predict_series(self, y_history: pd.Series, horizon_index: pd.Index) -> np.ndarray:
        """In walk-forward/one-step mode, y_hat[t] = y[t-1]."""
        preds = []
        hist = list(y_history)
        for i in range(len(horizon_index)):
            preds.append(hist[-1])
        return np.array(preds)

class SeasonalNaiveForecaster:
    """
    Seasonal Naive baseline: y(t) = y(t - season_length).
    season_length = 52 for weekly, 12 for monthly.
    """
    def __init__(self, season_length: int = 52):
        self.season_length = season_length
        self.history = None

    def fit(self, y_train: Union[pd.Series, np.ndarray]):
        if isinstance(y_train, pd.Series):
            self.history = list(y_train.values)
        else:
            self.history = list(y_train)
        return self

    def predict(self, horizon: int = 1) -> np.ndarray:
        if self.history is None or len(self.history) == 0:
            raise ValueError("Model must be fitted before predict.")
        preds = []
        for i in range(horizon):
            idx = -self.season_length + (i % self.season_length)
            if abs(idx) <= len(self.history):
                preds.append(float(self.history[idx]))
            else:
                preds.append(float(self.history[-1]))
        return np.array(preds)

    def predict_one_step(self, current_history: List[float]) -> float:
        if len(current_history) >= self.season_length:
            return float(current_history[-self.season_length])
        return float(current_history[-1])

    def predict_series(self, full_series: pd.Series, test_indices: List[int]) -> np.ndarray:
        preds = []
        for idx in test_indices:
            past_idx = idx - self.season_length
            if past_idx >= 0:
                preds.append(float(full_series.iloc[past_idx]))
            else:
                preds.append(float(full_series.iloc[idx - 1]))
        return np.array(preds)

class MovingAverageForecaster:
    """
    Moving Average baseline: y(t) = mean(y[t-window : t]).
    window = 4 for weekly, 3 for monthly.
    """
    def __init__(self, window: int = 4):
        self.window = window
        self.history = None

    def fit(self, y_train: Union[pd.Series, np.ndarray]):
        if isinstance(y_train, pd.Series):
            self.history = list(y_train.values)
        else:
            self.history = list(y_train)
        return self

    def predict(self, horizon: int = 1) -> np.ndarray:
        if self.history is None or len(self.history) == 0:
            raise ValueError("Model must be fitted before predict.")
        val = float(np.mean(self.history[-self.window:]))
        return np.full(horizon, val)

    def predict_series(self, full_series: pd.Series, test_indices: List[int]) -> np.ndarray:
        preds = []
        for idx in test_indices:
            start_idx = max(0, idx - self.window)
            window_vals = full_series.iloc[start_idx:idx]
            preds.append(float(window_vals.mean()))
        return np.array(preds)
