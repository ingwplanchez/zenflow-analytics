"""
scripts/generate_sample_data.py — ZenFlow Analytics
=====================================================
Generates a realistic synthetic development log CSV (~500 records, 6 months).

Behavioral patterns encoded:
  - Peak productivity: Tuesday/Wednesday 09:00–12:00
  - Afternoon dip: 14:00–15:30 daily
  - Friday fatigue: efficiency drops systematically after 16:00
  - Deep work sessions: longer est_hours, higher difficulty, lower overrun
  - Context-switching overhead: reactive tasks show higher overrun rates

Run: python scripts/generate_sample_data.py
Output: data/sample_logs.csv
"""

from __future__ import annotations

import random
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 42
rng  = np.random.default_rng(SEED)
random.seed(SEED)

# ─── Config ──────────────────────────────────────────────────────────────────

N_RECORDS   = 520
START_DATE  = pd.Timestamp("2025-01-06")   # ISO week 2 start
END_DATE    = pd.Timestamp("2025-06-27")

PROJECTS = [
    "Aether Core Engine",
    "ZenFlow Mobile v3",
    "Project Chronos",
    "Lumina Analytics UI",
    "Neural Nexus AI",
    "Legacy Cloud Migration",
]

CATEGORIES = ["deep_work", "collaboration", "reactive", "strategy"]

PRIORITIES = ["critical", "high", "medium", "low"]

STATUSES = ["completed", "in_progress", "pending"]

TASK_PREFIXES = {
    "Aether Core Engine":      "ACE",
    "ZenFlow Mobile v3":       "ZEN",
    "Project Chronos":         "CHR",
    "Lumina Analytics UI":     "LUM",
    "Neural Nexus AI":         "NNA",
    "Legacy Cloud Migration":  "LCM",
}

# Category → est_hours range, difficulty range, base overrun probability
CATEGORY_PARAMS: dict[str, dict] = {
    "deep_work":     {"est_range": (3.0, 8.0), "diff_range": (3, 5), "overrun_p": 0.25},
    "collaboration": {"est_range": (0.5, 2.5), "diff_range": (1, 3), "overrun_p": 0.35},
    "reactive":      {"est_range": (0.5, 2.0), "diff_range": (1, 2), "overrun_p": 0.55},
    "strategy":      {"est_range": (1.0, 4.0), "diff_range": (2, 4), "overrun_p": 0.20},
}

# Weekday × hour productivity multiplier matrix
# Rows: weekday 0=Mon…6=Sun, Cols: hour buckets [0-8, 9-11, 12-13, 14-15, 16-20, 21-23]
# Values > 1 → more tasks, values < 1 → less
PRODUCTIVITY_WEIGHTS: dict[int, list[float]] = {
    0: [0.1, 1.2, 0.8, 0.7, 0.9, 0.1],   # Monday
    1: [0.1, 1.5, 0.9, 0.8, 1.0, 0.1],   # Tuesday   ← peak
    2: [0.1, 1.4, 0.9, 0.9, 1.1, 0.1],   # Wednesday ← peak
    3: [0.1, 1.1, 0.8, 0.7, 0.8, 0.1],   # Thursday
    4: [0.1, 1.0, 0.6, 0.4, 0.3, 0.0],   # Friday    ← fatigue
    5: [0.0, 0.3, 0.2, 0.1, 0.1, 0.0],   # Saturday
    6: [0.0, 0.1, 0.1, 0.0, 0.0, 0.0],   # Sunday
}


def _hour_bucket(hour: int) -> int:
    """Map hour (0–23) to PRODUCTIVITY_WEIGHTS column index."""
    if hour < 9:   return 0
    if hour < 12:  return 1
    if hour < 14:  return 2
    if hour < 16:  return 3
    if hour < 21:  return 4
    return 5


def _simulate_real_hours(
    est: float,
    category: str,
    weekday: int,
    hour: int,
    priority: str,
) -> tuple[float, str]:
    """Simulate real hours and status given contextual factors."""
    params = CATEGORY_PARAMS[category]
    base_overrun_p = params["overrun_p"]

    # Friday afternoon fatigue boost
    if weekday == 4 and hour >= 16:
        base_overrun_p = min(base_overrun_p + 0.30, 0.90)

    # Productivity multiplier (low prod → more overrun)
    prod_mult = PRODUCTIVITY_WEIGHTS[weekday][_hour_bucket(hour)]
    if prod_mult < 0.5:
        base_overrun_p = min(base_overrun_p + 0.20, 0.90)

    # Critical priority → more likely completed (less pending)
    if priority == "critical":
        status_weights = [0.70, 0.25, 0.05]
    elif priority == "low":
        status_weights = [0.45, 0.30, 0.25]
    else:
        status_weights = [0.60, 0.28, 0.12]

    status = rng.choice(STATUSES, p=status_weights)

    # Real hours
    if status == "pending":
        real = 0.0
    elif rng.random() < base_overrun_p:
        # Overrun: real = est × multiplier
        overrun_factor = rng.uniform(1.1, 2.2)
        real = round(float(est * overrun_factor), 1)
    else:
        # Under/on-estimate
        factor = rng.uniform(0.6, 1.05)
        real = round(float(est * factor), 1)

    return real, status


def generate() -> pd.DataFrame:
    """Generate the synthetic log DataFrame."""
    date_range = pd.date_range(START_DATE, END_DATE, freq="D")

    records: list[dict] = []
    task_counters: dict[str, int] = {p: 100 for p in PROJECTS}

    # Sample N_RECORDS timestamps weighted by productivity pattern
    all_timestamps: list[pd.Timestamp] = []
    for _ in range(N_RECORDS * 3):   # oversample, then slice
        day  = pd.Timestamp(rng.choice(date_range))
        hour = int(rng.integers(7, 21))
        wd   = day.dayofweek
        weight = PRODUCTIVITY_WEIGHTS[wd][_hour_bucket(hour)]
        if rng.random() < weight:
            minute = rng.integers(0, 60)
            all_timestamps.append(
                pd.Timestamp(day.year, day.month, day.day, hour, minute)
            )
        if len(all_timestamps) >= N_RECORDS:
            break

    all_timestamps = all_timestamps[:N_RECORDS]
    all_timestamps.sort()

    for ts in all_timestamps:
        project   = rng.choice(PROJECTS)
        category  = rng.choice(
            CATEGORIES,
            p=[0.45, 0.25, 0.20, 0.10],   # deep_work most common
        )
        priority  = rng.choice(
            PRIORITIES,
            p=[0.15, 0.30, 0.40, 0.15],
        )
        params    = CATEGORY_PARAMS[category]
        est_hours = round(
            float(rng.uniform(*params["est_range"])), 1
        )
        difficulty = int(rng.integers(*params["diff_range"], endpoint=True))

        real_hours, status = _simulate_real_hours(
            est=est_hours,
            category=category,
            weekday=ts.dayofweek,
            hour=ts.hour,
            priority=priority,
        )

        prefix = TASK_PREFIXES[project]
        task_counters[project] += 1
        task_id = f"{prefix}-{task_counters[project]}"

        records.append({
            "timestamp":  ts,
            "task_id":    task_id,
            "project":    project,
            "category":   category,
            "priority":   priority,
            "est_hours":  est_hours,
            "real_hours": real_hours,
            "difficulty": difficulty,
            "status":     status,
        })

    df = pd.DataFrame(records)
    df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S")
    return df


if __name__ == "__main__":
    out_path = Path(__file__).parent.parent / "data" / "sample_logs.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    df = generate()
    df.to_csv(out_path, index=False)
    print(f"[ZenFlow] Generated {len(df)} records -> {out_path}")
    print(df.head(5).to_string())
