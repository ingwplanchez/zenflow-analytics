"""
utils/helpers.py — ZenFlow Analytics
=====================================
[Especificación]
  Módulo de utilidades compartidas: tokens de color, template Plotly,
  formateadores y guard clauses de validación de schema.

[Planificación]
  - PALETTE: dict con colores extraídos del DESIGN.md (1:1 mapping)
  - PLOTLY_THEME: layout Plotly que replica la estética dark del design system
  - Funciones: fmt_hours, fmt_pct, validate_csv_schema, get_priority_color

[Verificación]
  Invariante: PALETTE siempre contiene las claves ['primary', 'secondary',
  'tertiary', 'background', 'surface', 'surface_high', 'text', 'text_dim',
  'outline', 'error']
  >>> all(k in PALETTE for k in ['primary', 'secondary', 'background'])
  True
"""

from __future__ import annotations

from typing import Any

# ─── Design Tokens (from DESIGN.md) ──────────────────────────────────────────

PALETTE: dict[str, str] = {
    "primary":          "#4fdbc8",   # Teal — throughput, active states
    "secondary":        "#c0c1ff",   # Indigo — historical trends
    "tertiary":         "#4edea3",   # Emerald — insights, positive growth
    "background":       "#0b1326",   # Deep Slate — canvas
    "surface":          "#0b1326",   # Surface base
    "surface_low":      "#131b2e",   # Cards / sidebar
    "surface_high":     "#222a3d",   # Elevated elements
    "surface_highest":  "#2d3449",   # Popovers
    "text":             "#dae2fd",   # On-surface readable
    "text_dim":         "#bbcac6",   # On-surface-variant
    "outline":          "#859490",   # Borders neutral
    "outline_variant":  "#3c4947",   # Subtle dividers
    "error":            "#ffb4ab",   # Error state
    "primary_glow":     "rgba(79, 219, 200, 0.08)",   # Card hover glow
}

# Priority → color mapping (aligned with design tokens)
PRIORITY_COLORS: dict[str, str] = {
    "critical":  "#ffb4ab",   # error (red-ish)
    "high":      "#4fdbc8",   # primary teal
    "medium":    "#c0c1ff",   # secondary indigo
    "low":       "#859490",   # outline neutral
}

# Status → color
STATUS_COLORS: dict[str, str] = {
    "completed":   "#4edea3",   # tertiary emerald
    "in_progress": "#4fdbc8",   # primary teal
    "pending":     "#859490",   # neutral
}

# Category display names (shared between core and UI)
CATEGORY_LABELS: dict[str, str] = {
    "deep_work":     "Trabajo Profundo",
    "collaboration": "Colaboración",
    "reactive":      "Admin. Reactiva",
    "strategy":      "Estrategia",
}

# ─── Plotly Dark Theme ────────────────────────────────────────────────────────

PLOTLY_THEME: dict[str, Any] = {
    "layout": {
        "paper_bgcolor":   PALETTE["background"],
        "plot_bgcolor":    PALETTE["background"],
        "font": {
            "family": "Inter, JetBrains Mono, monospace",
            "color":  PALETTE["text"],
            "size":   12,
        },
        "xaxis": {
            "gridcolor":      "rgba(0,0,0,0)",   # no gridlines
            "linecolor":      PALETTE["outline_variant"],
            "tickcolor":      PALETTE["outline_variant"],
            "tickfont":       {"family": "JetBrains Mono, monospace", "size": 11},
            "zerolinecolor":  PALETTE["outline"],
        },
        "yaxis": {
            "gridcolor":      "rgba(0,0,0,0)",
            "linecolor":      PALETTE["outline_variant"],
            "tickcolor":      PALETTE["outline_variant"],
            "tickfont":       {"family": "JetBrains Mono, monospace", "size": 11},
            "zerolinecolor":  PALETTE["outline"],
        },
        "colorway": [
            PALETTE["primary"],
            PALETTE["secondary"],
            PALETTE["tertiary"],
            "#6366f1",   # extra indigo
            "#f59e0b",   # amber accent
        ],
        "legend": {
            "bgcolor":      "rgba(0,0,0,0)",
            "bordercolor":  PALETTE["outline_variant"],
            "font":         {"color": PALETTE["text_dim"]},
        },
        "hoverlabel": {
            "bgcolor":    PALETTE["surface_highest"],
            "bordercolor": PALETTE["primary"],
            "font": {"family": "JetBrains Mono, monospace", "size": 12},
        },
        "margin": {"l": 48, "r": 24, "t": 40, "b": 48},
    }
}

# Heatmap colorscale: slate → teal
HEATMAP_COLORSCALE: list[list] = [
    [0.0,  "#1e293b"],   # Distinct slate gray for 0 tasks
    [0.25, "#0e3a35"],
    [0.5,  "#155e56"],
    [0.75, "#1f9e8a"],
    [1.0,  PALETTE["primary"]],
]

# ─── Formatters ──────────────────────────────────────────────────────────────

def fmt_hours(hours: float, decimals: int = 1) -> str:
    """Format a float as hours string. Handles NaN gracefully.

    Args:
        hours: Raw hour value (may be NaN).
        decimals: Number of decimal places.

    Returns:
        Formatted string e.g. '4.5h' or '--'.
    """
    try:
        if hours != hours:   # NaN check (faster than math.isnan)
            return "--"
        return f"{hours:.{decimals}f}h"
    except (TypeError, ValueError):
        return "--"


def fmt_pct(value: float, decimals: int = 1) -> str:
    """Format a float as a percentage string.

    Args:
        value: Float between 0–1 (or 0–100 already).
        decimals: Decimal places.

    Returns:
        e.g. '87.3%'
    """
    try:
        if value != value:
            return "--"
        v = value * 100 if value <= 1.0 else value
        return f"{v:.{decimals}f}%"
    except (TypeError, ValueError):
        return "--"


def fmt_delta(value: float) -> str:
    """Format a float as a signed delta string.

    Args:
        value: Signed delta (e.g. +0.12 = +12 pp).

    Returns:
        e.g. '+12.0%' or '-5.3%'
    """
    try:
        if value != value:
            return "±0%"
        sign = "+" if value >= 0 else ""
        return f"{sign}{value:.1f}%"
    except (TypeError, ValueError):
        return "±0%"


# ─── Schema Validation ────────────────────────────────────────────────────────

#: Required columns and their expected dtypes (as string for isinstance checks)
REQUIRED_SCHEMA: dict[str, str] = {
    "timestamp":  "datetime64",
    "task_id":    "object",
    "project":    "object",
    "category":   "object",
    "priority":   "object",
    "est_hours":  "float64",
    "real_hours": "float64",
    "difficulty": "int64",
    "status":     "object",
}


def validate_csv_schema(df: "Any", required_cols: list[str] | None = None) -> bool:
    """Guard clause: verify that a DataFrame has all required columns.

    Args:
        df: pandas DataFrame to validate.
        required_cols: Column names that must be present. Defaults to
            all keys of REQUIRED_SCHEMA.

    Returns:
        True if all required columns are present, False otherwise.

    Raises:
        TypeError: If df is not a DataFrame-like object (has no 'columns').
    """
    if not hasattr(df, "columns"):
        raise TypeError(f"Expected a DataFrame, got {type(df).__name__}")

    cols_to_check = required_cols if required_cols is not None else list(REQUIRED_SCHEMA.keys())
    missing = set(cols_to_check) - set(df.columns)

    if missing:
        import warnings
        warnings.warn(
            f"[ZenFlow] validate_csv_schema: missing columns {missing}",
            stacklevel=2,
        )
        return False

    return True


def apply_plotly_theme(fig: "Any") -> "Any":
    """Apply the ZenFlow dark theme to a Plotly figure in-place.

    Args:
        fig: A plotly.graph_objects.Figure instance.

    Returns:
        The same figure with layout updated.
    """
    fig.update_layout(**PLOTLY_THEME["layout"])
    return fig
