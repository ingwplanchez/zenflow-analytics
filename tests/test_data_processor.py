import pytest
import pandas as pd
import numpy as np
from core.data_processor import (
    validate_and_clean_df,
    enrich_features,
    compute_kpis,
    aggregate_by_weekday,
    build_hourly_heatmap,
    detect_fatigue_patterns,
    apply_filters
)

@pytest.fixture
def raw_df():
    """Basic valid dataset for testing."""
    return pd.DataFrame({
        "timestamp": ["2024-01-01 09:00", "2024-01-01 10:00", "2024-01-02 09:00"],
        "task_id": ["T1", "T2", "T3"],
        "project": ["P1", "P1", "P2"],
        "category": ["deep_work", "collaboration", "strategy"],
        "priority": ["high", "medium", "low"],
        "est_hours": [2.0, 1.0, 4.0],
        "real_hours": [2.5, 0.5, 9.0], # T3 is a bottleneck
        "difficulty": [3, 2, 4],
        "status": ["completed", "completed", "completed"]
    })

@pytest.fixture
def enriched_df(raw_df):
    """Pre-processed and enriched dataset."""
    df = validate_and_clean_df(raw_df)
    return enrich_features(df)

def test_validate_and_clean_df_success(raw_df):
    """Test that valid data is processed correctly."""
    df = validate_and_clean_df(raw_df)
    assert len(df) == 3
    assert pd.api.types.is_datetime64_any_dtype(df["timestamp"])
    assert df["difficulty"].dtype == "int64"

def test_validate_and_clean_df_missing_cols():
    """Test that missing required columns raise ValueError."""
    df = pd.DataFrame({"timestamp": ["2024-01-01"], "task_id": ["T1"]})
    with pytest.raises(ValueError, match="Missing required columns"):
        validate_and_clean_df(df)

def test_validate_and_clean_df_drops_nulls():
    """Test that rows with critical nulls are removed."""
    df = pd.DataFrame({
        "timestamp": ["2024-01-01", None],
        "task_id": ["T1", "T2"],
        "project": ["P1", "P1"],
        "category": ["deep_work", "deep_work"],
        "priority": ["high", "high"],
        "est_hours": [1.0, 1.0],
        "real_hours": [1.0, 1.0],
        "difficulty": [3, 3],
        "status": ["completed", "completed"]
    })
    cleaned = validate_and_clean_df(df)
    assert len(cleaned) == 1

def test_enrich_features(raw_df):
    """Test feature engineering logic."""
    df = validate_and_clean_df(raw_df)
    enriched = enrich_features(df)

    assert "efficiency" in enriched.columns
    assert "velocity" in enriched.columns
    assert "weekday" in enriched.columns

    # T1: est=2, real=2.5 -> efficiency = 1.25, velocity = 0.8
    assert enriched.loc[0, "efficiency"] == 1.25
    assert enriched.loc[0, "velocity"] == 0.8

def test_compute_kpis(enriched_df):
    """Test KPI aggregation."""
    kpis = compute_kpis(enriched_df)

    assert kpis["total_tasks"] == 3
    assert kpis["completed_tasks"] == 3
    assert kpis["completion_rate"] == 1.0
    assert "fatigue_index" in kpis

def test_aggregate_by_weekday(enriched_df):
    """Test weekday distribution always returns 7 rows."""
    result = aggregate_by_weekday(enriched_df)
    assert len(result) == 7
    assert list(result["weekday_num"]) == list(range(7))

def test_build_hourly_heatmap(enriched_df):
    """Test heatmap dimensions."""
    heatmap = build_hourly_heatmap(enriched_df)
    assert heatmap.shape == (24, 7)

def test_detect_fatigue_patterns(enriched_df):
    """Test bottleneck detection."""
    annotated = detect_fatigue_patterns(enriched_df)
    # T3: real=8, est=4 -> real > 2*est AND completed -> is_bottleneck = True
    assert annotated.loc[2, "is_bottleneck"] == True
    assert "eff_zscore" in annotated.columns

def test_apply_filters(enriched_df):
    """Test data filtering."""
    # Filter by project P2
    filtered = apply_filters(enriched_df, projects=["P2"])
    assert len(filtered) == 1
    assert filtered.iloc[0]["project"] == "P2"

    # Filter by category deep_work
    filtered = apply_filters(enriched_df, categories=["deep_work"])
    assert len(filtered) == 1
    assert filtered.iloc[0]["category"] == "deep_work"
