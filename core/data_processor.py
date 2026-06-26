"""
core/data_processor.py — ZenFlow Analytics
============================================
[Especificación]
  Motor ETL puro basado en Pandas. Sin dependencias de Streamlit ni Plotly.
  Responsabilidades:
    1. Ingesta y validación de CSV de logs de desarrollo
    2. Normalización de tipos (datetime64[ns], categoricals)
    3. Cálculo de KPIs agregados
    4. Análisis estadístico avanzado: distribución por día de semana,
       mapa de calor horario, detección de fatiga vía z-score

[Planificación]
  Pipeline: load_and_validate → enrich_features → (compute_kpis |
  aggregate_by_weekday | build_hourly_heatmap | detect_fatigue_patterns)

  Contratos de schema documentados en cada función.
  Complejidad temporal objetivo: O(N) por transformación vectorizada.
  No se usa .apply(lambda) — sólo operaciones nativas pandas/numpy.

[Verificación]
  Invariante global: todas las funciones públicas reciben y devuelven
  DataFrames con schema explícito (columnas y dtypes definidos en docstring).
  El módulo NO produce efectos secundarios (sin prints, sin I/O excepto load).
"""

from __future__ import annotations

import warnings
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from utils.helpers import CATEGORY_LABELS, REQUIRED_SCHEMA, validate_csv_schema

# ─── Constants ────────────────────────────────────────────────────────────────

#: Ordered weekday labels (locale-neutral, Spanish)
WEEKDAY_LABELS: list[str] = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

#: Z-score threshold above which a session is flagged as bottleneck/fatigue
FATIGUE_ZSCORE_THRESHOLD: float = 1.5

# ─── 1. Ingesta y Validación ──────────────────────────────────────────────────


def validate_and_clean_df(df: pd.DataFrame) -> pd.DataFrame:
    """Validate schema and coerce types on an already‑loaded DataFrame.

    [Especificación]
      Input:  Raw DataFrame from a CSV read.
      Output: Cleaned, typed DataFrame (same contract as load_and_validate).

    Raises:
        ValueError: If required columns are missing.
        RuntimeError: If the DataFrame is empty after cleaning.
    """
    # ── Schema guard ──────────────────────────────────────────────────────────
    if not validate_csv_schema(df):
        raise ValueError(
            f"[ZenFlow] Missing required columns. Expected: {list(REQUIRED_SCHEMA.keys())}"
        )

    # ── Type coercions ────────────────────────────────────────────────────────
    # Timestamp — ensure datetime64[ns], coerce bad rows to NaT then drop
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=False)

    # Numeric — coerce to float, clip negative values
    df["est_hours"]  = pd.to_numeric(df["est_hours"],  errors="coerce").clip(lower=0.0)
    df["real_hours"] = pd.to_numeric(df["real_hours"], errors="coerce").clip(lower=0.0)
    df["difficulty"] = pd.to_numeric(df["difficulty"], errors="coerce").clip(1, 5).astype("Int64")

    # Drop rows with critical nulls
    critical_cols = ["timestamp", "task_id", "project", "category", "status"]
    before = len(df)
    df = df.dropna(subset=critical_cols).reset_index(drop=True)
    dropped = before - len(df)
    if dropped > 0:
        warnings.warn(
            f"[ZenFlow] Dropped {dropped} rows with null critical fields.",
            stacklevel=2,
        )

    if df.empty:
        raise RuntimeError("[ZenFlow] DataFrame is empty after cleaning. Check the source CSV.")

    # Normalize string columns (lowercase, strip whitespace)
    for col in ["category", "priority", "status"]:
        df[col] = df[col].str.strip().str.lower()

    # Final int cast for difficulty (after dropna)
    df["difficulty"] = df["difficulty"].astype("int64")

    return df


def load_and_validate(path: str | Path) -> pd.DataFrame:
    """Load a development log CSV and validate/coerce its schema.

    [Especificación]
      Input:  CSV file with headers matching REQUIRED_SCHEMA.
      Output: DataFrame with guaranteed dtypes — no nullable columns remain
              ambiguous after this function returns.

    Output schema:
      timestamp   datetime64[ns]
      task_id     object (str)
      project     object (str)
      category    object (str, one of deep_work/collaboration/reactive/strategy)
      priority    object (str, one of critical/high/medium/low)
      est_hours   float64
      real_hours  float64
      difficulty  int64  (1–5)
      status      object (str, one of completed/in_progress/pending)

    Args:
        path: Absolute or relative path to the CSV file.

    Returns:
        Cleaned, typed DataFrame ready for downstream transforms.

    Raises:
        FileNotFoundError: If path does not exist.
        ValueError: If required columns are missing after load.
        RuntimeError: If the file is empty after cleaning.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"[ZenFlow] Log file not found: {path}")

    # ── Read with explicit dtypes where possible ──────────────────────────────
    try:
        df = pd.read_csv(
            path,
            parse_dates=["timestamp"],
            dtype={
                "task_id":    "string",
                "project":    "string",
                "category":   "string",
                "priority":   "string",
                "status":     "string",
            },
        )
    except Exception as exc:
        raise ValueError(f"[ZenFlow] Failed to parse CSV: {exc}") from exc

    return validate_and_clean_df(df)


# ─── 2. Feature Engineering ───────────────────────────────────────────────────


def enrich_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived time/efficiency columns used by all downstream aggregations.

    [Especificación]
      Input:  DataFrame from load_and_validate (validated schema).
      Output: Same DataFrame + computed columns (no rows are removed).

    Added columns:
      date         date            Calendar date of the entry
      weekday_num  int64           0=Monday … 6=Sunday
      weekday      str             'Lun', 'Mar', …, 'Dom'
      hour         int64           Hour of day 0–23
      week_iso     int64           ISO calendar week number
      efficiency   float64         real_hours / est_hours (NaN if est=0)
      overrun      bool            True if real_hours > est_hours
      velocity     float64         est_hours / real_hours (inverse of efficiency)

    Args:
        df: Validated DataFrame from load_and_validate.

    Returns:
        Enriched DataFrame with additional feature columns.
    """
    df = df.copy()

    # Time decomposition (all vectorized)
    dt = df["timestamp"].dt
    df["date"]        = dt.date
    df["weekday_num"] = dt.dayofweek                        # 0=Mon, 6=Sun
    df["weekday"]     = dt.dayofweek.map(
        dict(enumerate(WEEKDAY_LABELS))
    )
    df["hour"]        = dt.hour
    df["week_iso"]    = dt.isocalendar().week.astype("int64")

    # Efficiency = real / est (handle zero division via numpy)
    df["efficiency"] = np.where(
        df["est_hours"] > 0,
        df["real_hours"] / df["est_hours"],
        np.nan,
    )

    # Overrun flag
    df["overrun"] = df["real_hours"] > df["est_hours"]

    # Velocity = est / real (inverse) — how much was delivered vs planned
    df["velocity"] = np.where(
        df["real_hours"] > 0,
        df["est_hours"] / df["real_hours"],
        np.nan,
    )

    return df


# ─── 3. KPI Aggregation ───────────────────────────────────────────────────────


def compute_kpis(df: pd.DataFrame) -> dict[str, Any]:
    """Compute top-level KPI metrics from an enriched DataFrame.

    [Especificación]
      Input:  Enriched DataFrame (must contain 'efficiency', 'real_hours',
              'est_hours', 'velocity', 'status', 'overrun').
      Output: dict with keys:
        total_tasks       int     Total number of log entries
        completed_tasks   int     Tasks with status='completed'
        completion_rate   float   Ratio completed/total (0–1)
        avg_efficiency    float   Mean efficiency (real/est, excl. NaN)
        avg_velocity      float   Mean velocity (est/real, excl. NaN)
        total_real_hours  float   Sum of real hours invested
        total_est_hours   float   Sum of estimated hours
        overrun_rate      float   Fraction of tasks where real > est
        fatigue_index     float   Composite 0–1 score (high = more fatigue risk)

    Args:
        df: Enriched DataFrame (output of enrich_features).

    Returns:
        Dictionary of scalar KPI values.

    Raises:
        ValueError: If the DataFrame is empty.
    """
    if df.empty:
        raise ValueError("[ZenFlow] compute_kpis received an empty DataFrame.")

    # Ensure enrichment (idempotent guard)
    if "efficiency" not in df.columns:
        df = enrich_features(df)

    completed_mask  = df["status"] == "completed"
    total           = len(df)
    completed       = int(completed_mask.sum())
    real_sum        = float(df["real_hours"].sum())
    est_sum         = float(df["est_hours"].sum())
    avg_eff         = float(df["efficiency"].mean())     # NaN-safe
    avg_vel         = float(df["velocity"].mean())
    overrun_rate    = float(df["overrun"].mean())

    # Fatigue Index: weighted composite of overrun rate + low velocity sessions
    # Range 0–1. Higher = more fatigue signals in the period.
    low_vel_mask    = df["velocity"].lt(0.7)             # below 70% velocity
    fatigue_index   = float(
        0.6 * overrun_rate + 0.4 * low_vel_mask.mean()
    )

    return {
        "total_tasks":      total,
        "completed_tasks":  completed,
        "completion_rate":  completed / total if total > 0 else 0.0,
        "avg_efficiency":   avg_eff,
        "avg_velocity":     avg_vel,
        "total_real_hours": real_sum,
        "total_est_hours":  est_sum,
        "overrun_rate":     overrun_rate,
        "fatigue_index":    fatigue_index,
    }


# ─── 4. Weekday Distribution ──────────────────────────────────────────────────


def aggregate_by_weekday(df: pd.DataFrame) -> pd.DataFrame:
    """Compute efficiency and throughput aggregated by day of week.

    [Especificación]
      Input:  Enriched DataFrame.
      Output: DataFrame indexed 0–6 (Mon–Sun) with columns:
        weekday       str     Day label ('Lun', …, 'Dom')
        weekday_num   int     0–6
        task_count    int     Total tasks on that weekday
        avg_eff       float   Mean efficiency
        std_eff       float   Std dev of efficiency
        total_hours   float   Sum of real hours
        throughput    float   Tasks per real hour (density)
        completion_r  float   Fraction of tasks completed

    Args:
        df: Enriched DataFrame (must have 'weekday_num', 'efficiency', etc.)

    Returns:
        7-row DataFrame ordered Mon→Sun.
    """
    if "efficiency" not in df.columns:
        df = enrich_features(df)

    completed_mask = (df["status"] == "completed").astype(int)

    agg = (
        df.assign(is_completed=completed_mask)
        .groupby("weekday_num", sort=True)
        .agg(
            weekday       = ("weekday",       "first"),
            task_count    = ("task_id",       "count"),
            avg_eff       = ("efficiency",    "mean"),
            std_eff       = ("efficiency",    "std"),
            total_hours   = ("real_hours",    "sum"),
            completion_r  = ("is_completed",  "mean"),
        )
        .reset_index()
    )

    # Throughput = tasks per real hour (avoid /0)
    agg["throughput"] = np.where(
        agg["total_hours"] > 0,
        agg["task_count"] / agg["total_hours"],
        0.0,
    )

    # Reorder to full week (fill missing days with zeros)
    full_week = pd.DataFrame({"weekday_num": range(7), "weekday": WEEKDAY_LABELS})
    result = full_week.merge(agg, on=["weekday_num", "weekday"], how="left")
    result[["task_count", "total_hours", "throughput"]] = (
        result[["task_count", "total_hours", "throughput"]].fillna(0.0)
    )
    result[["avg_eff", "std_eff", "completion_r"]] = (
        result[["avg_eff", "std_eff", "completion_r"]].fillna(0.0)
    )

    return result


# ─── 5. Hourly Activity Heatmap ───────────────────────────────────────────────


def build_hourly_heatmap(df: pd.DataFrame) -> pd.DataFrame:
    """Build a (24 × 7) pivot matrix of task density by hour × weekday.

    [Especificación]
      Input:  Enriched DataFrame.
      Output: Pivot DataFrame.
        Index:   hour (0–23, int)
        Columns: weekday_num (0–6, int) aliased to WEEKDAY_LABELS
        Values:  task_count  (int, count of tasks starting in that slot)
        Cells with no activity = 0.

    Args:
        df: Enriched DataFrame.

    Returns:
        24 × 7 DataFrame of task density counts.
    """
    if "hour" not in df.columns:
        df = enrich_features(df)

    pivot = (
        df.groupby(["hour", "weekday_num"])
        .size()
        .unstack(fill_value=0)
        .reindex(index=range(24), columns=range(7), fill_value=0)
    )

    # Rename columns to day labels for readability in UI
    pivot.columns = pd.Index(WEEKDAY_LABELS, name="weekday")
    pivot.index.name = "hour"

    return pivot


# ─── 6. Fatigue & Bottleneck Detection ───────────────────────────────────────


def detect_fatigue_patterns(df: pd.DataFrame) -> pd.DataFrame:
    """Identify bottleneck sessions and fatigue patterns via z-score analysis.

    Algorithm:
      1. Compute per-session z-score of efficiency within a rolling 7-day window.
      2. Flag sessions with z-score < -FATIGUE_ZSCORE_THRESHOLD as
         potential fatigue events (abnormally low efficiency).
      3. Compute session-level overrun and velocity drop indicators.

    [Especificación]
      Input:  Enriched DataFrame sorted by timestamp.
      Output: Original DataFrame + extra columns:
        eff_zscore    float   Z-score of efficiency in 7-day rolling window
        is_fatigue    bool    True if z-score < -FATIGUE_ZSCORE_THRESHOLD
        is_bottleneck bool    True if real_hours > 2× est_hours AND completed

    Args:
        df: Enriched DataFrame.

    Returns:
        Annotated DataFrame with fatigue and bottleneck flags.
    """
    if "efficiency" not in df.columns:
        df = enrich_features(df)

    df = df.copy().sort_values("timestamp").reset_index(drop=True)

    # ── Rolling z-score (7-day window, vectorized via transform) ─────────────
    # Group by ISO week for the rolling window approximation (O(N))
    # Using expanding mean/std for a robust baseline
    eff = df["efficiency"].fillna(df["efficiency"].median())

    rolling_mean = eff.expanding(min_periods=5).mean()
    rolling_std  = eff.expanding(min_periods=5).std().replace(0, np.nan)

    df["eff_zscore"]    = (eff - rolling_mean) / rolling_std
    df["is_fatigue"]    = df["eff_zscore"].lt(-FATIGUE_ZSCORE_THRESHOLD)
    df["is_bottleneck"] = (
        df["real_hours"].gt(df["est_hours"] * 2.0)
        & df["status"].eq("completed")
    )

    return df


# ─── 7. Filter Helper ─────────────────────────────────────────────────────────


def apply_filters(
    df: pd.DataFrame,
    *,
    date_start: "pd.Timestamp | None" = None,
    date_end:   "pd.Timestamp | None" = None,
    projects:   list[str] | None = None,
    categories: list[str] | None = None,
    priorities: list[str] | None = None,
    statuses:   list[str] | None = None,
) -> pd.DataFrame:
    """Apply sidebar filter selections to the main DataFrame.

    All filters are optional (None = no filter applied for that dimension).

    Args:
        df: Enriched DataFrame.
        date_start: Inclusive start date filter.
        date_end: Inclusive end date filter.
        projects: List of project names to include (None = all).
        categories: List of category values to include.
        priorities: List of priority values to include.
        statuses: List of status values to include.

    Returns:
        Filtered DataFrame (view, not copy — caller should .copy() if needed).
    """
    mask = pd.Series(True, index=df.index)

    if date_start is not None:
        mask &= df["timestamp"] >= pd.Timestamp(date_start)
    if date_end is not None:
        mask &= df["timestamp"] <= pd.Timestamp(date_end) + pd.Timedelta(days=1)
    if projects is not None and len(projects) > 0:
        mask &= df["project"].isin(projects)
    if categories is not None and len(categories) > 0:
        mask &= df["category"].isin(categories)
    if priorities is not None and len(priorities) > 0:
        mask &= df["priority"].isin(priorities)
    if statuses is not None and len(statuses) > 0:
        mask &= df["status"].isin(statuses)

    return df.loc[mask]


# ─── 8. Métricas Simplificadas del Canvas ─────────────────────────────────────


def compute_daily_throughput(df: pd.DataFrame) -> float:
    """Calculate the average number of completed tasks per active day.

    Args:
        df: Enriched DataFrame.

    Returns:
        Average completed tasks per active day (float).
    """
    completed_df = df[df["status"] == "completed"]
    if completed_df.empty:
        return 0.0
    active_days = completed_df["date"].nunique()
    if active_days == 0:
        return 0.0
    return float(len(completed_df) / active_days)


def compute_optimal_window(df: pd.DataFrame) -> str:
    """Find the 2-hour window with the highest density of completed tasks.

    Args:
        df: Enriched DataFrame.

    Returns:
        String representing the optimal hours window e.g., "10:00 - 12:00".
    """
    completed_df = df[df["status"] == "completed"]
    if completed_df.empty:
        return "N/A"

    hourly_counts = completed_df["hour"].value_counts().reindex(range(24), fill_value=0)

    max_sum = -1
    best_start = 9
    for h in range(23):
        current_sum = hourly_counts[h] + hourly_counts[h+1]
        if current_sum > max_sum:
            max_sum = current_sum
            best_start = h

    return f"{best_start:02d}:00 - {best_start+2:02d}:00"


def compute_current_streak(df: pd.DataFrame) -> int:
    """Calculate the current consecutive days streak of completed tasks.

    Calculates backwards from the most recent active date with a completed task.

    Args:
        df: Enriched DataFrame.

    Returns:
        Streak count in days (int).
    """
    completed_df = df[df["status"] == "completed"]
    if completed_df.empty:
        return 0

    active_dates = sorted(completed_df["date"].unique())
    if not active_dates:
        return 0

    streak = 1
    for i in range(len(active_dates) - 1, 0, -1):
        diff = (active_dates[i] - active_dates[i-1]).days
        if diff == 1:
            streak += 1
        elif diff > 1:
            break
    return streak
