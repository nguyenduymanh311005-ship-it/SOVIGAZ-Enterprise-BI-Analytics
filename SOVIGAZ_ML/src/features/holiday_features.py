"""
SOVIGAZ Holiday & Lunar New Year (Tết) Feature Engineering
Author: Senior ML Engineer & Data Scientist
Date: 2026-10-03
"""

import pandas as pd
import numpy as np

# Official Lunar New Year (Tết Nguyên Đán) Dates in Vietnam (2023 - 2026)
# Format: Dict mapping year to (mung_1_tet, holiday_start, holiday_end)
TET_CALENDAR = {
    2023: {
        "mung_1": pd.Timestamp("2023-01-22"),
        "holiday_start": pd.Timestamp("2023-01-20"),
        "holiday_end": pd.Timestamp("2023-01-26")
    },
    2024: {
        "mung_1": pd.Timestamp("2024-02-10"),
        "holiday_start": pd.Timestamp("2024-02-08"),
        "holiday_end": pd.Timestamp("2024-02-14")
    },
    2025: {
        "mung_1": pd.Timestamp("2025-01-29"),
        "holiday_start": pd.Timestamp("2025-01-25"),
        "holiday_end": pd.Timestamp("2025-02-02")
    },
    2026: {
        "mung_1": pd.Timestamp("2026-02-17"),
        "holiday_start": pd.Timestamp("2026-02-15"),
        "holiday_end": pd.Timestamp("2026-02-22")
    }
}

def add_tet_features_weekly(df: pd.DataFrame, date_col: str = "Date") -> pd.DataFrame:
    """
    Adds explicit Tết holiday features for weekly time-series.
    - is_tet_week: 1 if the week contains or directly neighbors Tết
    - weeks_to_tet: integer distance (weeks) to the nearest upcoming Tết
    - weeks_after_tet: integer distance (weeks) since the most recent Tết
    """
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])

    is_tet_week = []
    weeks_to_tet = []
    weeks_after_tet = []

    for dt in df[date_col]:
        year = dt.year
        # Find nearest upcoming and past Tết
        upcoming_tets = [v["mung_1"] for y, v in TET_CALENDAR.items() if v["mung_1"] >= dt]
        past_tets = [v["mung_1"] for y, v in TET_CALENDAR.items() if v["mung_1"] < dt]

        # Is current week within holiday period
        in_holiday = any(
            v["holiday_start"] <= (dt + pd.Timedelta(days=6)) and v["holiday_end"] >= dt
            for v in TET_CALENDAR.values()
        )
        is_tet_week.append(1 if in_holiday else 0)

        # Distance to next Tết in weeks
        if upcoming_tets:
            days_to = (min(upcoming_tets) - dt).days
            w_to = max(0, int(days_to // 7))
        else:
            w_to = 52
        weeks_to_tet.append(w_to)

        # Distance after previous Tết in weeks
        if past_tets:
            days_after = (dt - max(past_tets)).days
            w_after = max(0, int(days_after // 7))
        else:
            w_after = 52
        weeks_after_tet.append(w_after)

    df["is_tet_holiday"] = is_tet_week
    df["weeks_to_tet"] = weeks_to_tet
    df["weeks_after_tet"] = weeks_after_tet
    return df

def add_tet_features_monthly(df: pd.DataFrame, date_col: str = "Date") -> pd.DataFrame:
    """
    Adds explicit Tết holiday features for monthly time-series.
    - is_tet_month: 1 if Tết falls within this month (Jan 2023, Feb 2024, Jan 2025, Feb 2026)
    - months_to_tet: integer distance in months to next Tết
    """
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])

    is_tet_month = []
    months_to_tet = []

    for dt in df[date_col]:
        # Check if any Tết falls in year and month
        tet_in_month = any(
            v["mung_1"].year == dt.year and v["mung_1"].month == dt.month
            for v in TET_CALENDAR.values()
        )
        is_tet_month.append(1 if tet_in_month else 0)

        # Distance in months to next Tết
        upcoming_tets = [v["mung_1"] for y, v in TET_CALENDAR.items() if v["mung_1"] >= dt]
        if upcoming_tets:
            next_tet = min(upcoming_tets)
            m_dist = (next_tet.year - dt.year) * 12 + (next_tet.month - dt.month)
        else:
            m_dist = 12
        months_to_tet.append(max(0, m_dist))

    df["is_tet_holiday"] = is_tet_month
    df["months_to_tet"] = months_to_tet
    return df
