"""
ui/dashboard.py — ZenFlow Analytics
=====================================
[Especificación]
  Módulo de presentación Streamlit. ZERO lógica de negocio.
  Toda transformación de datos ocurre en core/data_processor.py.
  Este módulo sólo: recibe DataFrames/dicts, construye widgets Streamlit,
  genera figuras Plotly y las muestra.

[Planificación]
  render_dashboard() → función principal, orquesta:
    _render_global_css()      CSS custom (glassmorphism, fuentes, hover)
    _render_sidebar()         Filtros globales → retorna FilterState
    _render_kpi_header()      4 métricas top con delta
    _render_analytics_tabs()  3 tabs: Eficiencia | Heatmap | Fatiga
    _render_tasks_table()     Registro detallado filtrado
    _render_insights_panel()  Sidebar right — recomendaciones automáticas

[Verificación]
  Invariante: render_dashboard() no importa ni modifica datos directamente.
  Toda interacción con datos ocurre a través del parámetro 'processor' o
  funciones de core/data_processor.py llamadas con DataFrames filtrados.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from core.data_processor import (
    aggregate_by_weekday,
    apply_filters,
    build_hourly_heatmap,
    compute_kpis,
    detect_fatigue_patterns,
    enrich_features,
    load_and_validate,
    compute_daily_throughput,
    compute_optimal_window,
    compute_current_streak,
)
from utils.helpers import (
    CATEGORY_LABELS,
    HEATMAP_COLORSCALE,
    PALETTE,
    PLOTLY_THEME,
    STATUS_COLORS,
    apply_plotly_theme,
    fmt_delta,
    fmt_hours,
    fmt_pct,
)

# ─── Data Path ───────────────────────────────────────────────────────────────

_DATA_PATH = Path(__file__).parent.parent / "data" / "sample_logs.csv"

# ─── Filter State ─────────────────────────────────────────────────────────────


@dataclass
class FilterState:
    date_start:  date
    date_end:    date
    projects:    list[str]
    categories:  list[str]
    priorities:  list[str]
    statuses:    list[str]


# ─── CSS ─────────────────────────────────────────────────────────────────────

_CSS = """
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* ── Global reset ── */
  html, body, [class*="css"] { font-family: 'Inter', sans-serif !important; }
  .main { background: #0b1326 !important; }
  section[data-testid="stSidebar"] {
    background: #060e20 !important;
    border-right: 1px solid #1e293b;
  }

  /* ── KPI Cards ── */
  .kpi-card {
    background: #131b2e;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 20px 24px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .kpi-card:hover {
    border-color: #4fdbc8;
    box-shadow: 0 0 15px rgba(79, 219, 200, 0.08);
  }
  .kpi-label {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #859490;
    margin-bottom: 8px;
  }
  .kpi-value {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 28px;
    font-weight: 600;
    color: #dae2fd;
    line-height: 1;
  }
  .kpi-delta-pos { font-size: 12px; color: #4edea3; margin-top: 4px; }
  .kpi-delta-neg { font-size: 12px; color: #ffb4ab; margin-top: 4px; }
  .kpi-delta-neu { font-size: 12px; color: #859490; margin-top: 4px; }

  /* ── Section headers ── */
  .section-header {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4fdbc8;
    border-left: 3px solid #4fdbc8;
    padding-left: 10px;
    margin: 32px 0 16px 0;
  }

  /* ── Insight cards ── */
  .insight-card {
    background: #131b2e;
    border: 1px solid #1e293b;
    border-left: 3px solid #4fdbc8;
    border-radius: 6px;
    padding: 14px 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  .insight-card:hover { border-left-color: #4edea3; }
  .insight-title {
    font-size: 13px;
    font-weight: 600;
    color: #dae2fd;
    margin-bottom: 4px;
  }
  .insight-desc { font-size: 12px; color: #bbcac6; line-height: 1.5; }
  .insight-cat {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #4fdbc8;
    margin-top: 6px;
  }

  /* ── Status chips ── */
  .chip-completed  { background: rgba(78,222,163,0.12); color: #4edea3;
                     border: 1px solid rgba(78,222,163,0.25); border-radius: 4px;
                     padding: 2px 8px; font-size: 11px; font-weight:600; }
  .chip-in_progress{ background: rgba(79,219,200,0.12); color: #4fdbc8;
                     border: 1px solid rgba(79,219,200,0.25); border-radius: 4px;
                     padding: 2px 8px; font-size: 11px; font-weight:600; }
  .chip-pending    { background: rgba(133,148,144,0.12); color: #859490;
                     border: 1px solid rgba(133,148,144,0.25); border-radius: 4px;
                     padding: 2px 8px; font-size: 11px; font-weight:600; }

  /* ── Streamlit overrides ── */
  div[data-testid="stMetricValue"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 26px !important; color: #dae2fd !important;
  }
  div[data-testid="stMetricLabel"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px !important; text-transform: uppercase !important;
    letter-spacing: 0.05em !important; color: #859490 !important;
  }
  .stTabs [data-baseweb="tab-list"] { background: transparent; gap: 4px; }
  .stTabs [data-baseweb="tab"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
    background: #131b2e; border: 1px solid #1e293b; border-radius: 4px;
    color: #859490; padding: 8px 16px;
  }
  .stTabs [aria-selected="true"] {
    background: #0e3a35 !important; border-color: #4fdbc8 !important;
    color: #4fdbc8 !important;
  }
  div[data-testid="stDataFrame"] { border-radius: 8px; overflow: hidden; }
  .stSelectbox label, .stMultiSelect label, .stDateInput label {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 10px !important; text-transform: uppercase !important;
    letter-spacing: 0.05em !important; color: #859490 !important;
  }
  h1 { font-family: 'Inter', sans-serif !important; font-weight: 700 !important;
       font-size: 28px !important; color: #dae2fd !important; letter-spacing: -0.02em !important; }
  h2, h3 { font-family: 'Inter', sans-serif !important; font-weight: 600 !important;
            color: #dae2fd !important; }
</style>
"""

# ─── Cached Data Loading ─────────────────────────────────────────────────────


@st.cache_data(ttl=300)
def _load_data(path: str) -> pd.DataFrame:
    """Load and enrich the full dataset (cached 5 min)."""
    df = load_and_validate(path)
    df = enrich_features(df)
    return df


# ─── Chart Builders ──────────────────────────────────────────────────────────


def _chart_weekday_efficiency(weekday_df: pd.DataFrame) -> go.Figure:
    """Dual-axis bar chart: efficiency (bars) + throughput (line) × weekday."""
    fig = go.Figure()

    # Efficiency bars
    fig.add_trace(go.Bar(
        x=weekday_df["weekday"],
        y=(weekday_df["avg_eff"] * 100).round(1),
        name="Eficiencia Promedio (%)",
        marker=dict(
            color=weekday_df["avg_eff"],
            colorscale=[[0, PALETTE["surface_high"]], [1, PALETTE["primary"]]],
            showscale=False,
            line=dict(color=PALETTE["outline_variant"], width=0.5),
        ),
        error_y=dict(
            type="data",
            array=(weekday_df["std_eff"] * 100).round(1),
            visible=True,
            color=PALETTE["outline"],
            thickness=1.5,
        ),
        hovertemplate=(
            "<b>%{x}</b><br>Eficiencia: %{y:.1f}%<extra></extra>"
        ),
    ))

    # Throughput line (secondary axis)
    fig.add_trace(go.Scatter(
        x=weekday_df["weekday"],
        y=weekday_df["throughput"].round(2),
        name="Throughput (tasks/h)",
        mode="lines+markers",
        yaxis="y2",
        line=dict(color=PALETTE["secondary"], width=2, dash="dot"),
        marker=dict(size=6, color=PALETTE["secondary"]),
        hovertemplate="<b>%{x}</b><br>Throughput: %{y:.2f} t/h<extra></extra>",
    ))

    apply_plotly_theme(fig)
    fig.update_layout(
        yaxis=dict(title="Eficiencia (%)", ticksuffix="%",
                   gridcolor="rgba(60,73,71,0.3)"),
        yaxis2=dict(title="Throughput (t/h)", overlaying="y", side="right",
                    showgrid=False, tickfont=dict(color=PALETTE["secondary"])),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1.0),
        margin=dict(t=30, b=40),
        bargap=0.25,
        height=325,
    )
    return fig


def _chart_heatmap(pivot: pd.DataFrame) -> go.Figure:
    """Activity density heatmap: 7 days (Y) × 24h (X) — horizontal layout."""
    # Transpose: rows = days (weekday labels), columns = hours (0-23)
    pivot_t = pivot.T  # shape: (7 days) × (24 hours)

    fig = go.Figure(go.Heatmap(
        z=pivot_t.values,
        x=[f"{h:02d}:00" for h in range(24)],   # Horas en el eje X
        y=pivot_t.index.tolist(),                 # Días en el eje Y
        colorscale=HEATMAP_COLORSCALE,
        showscale=True,
        colorbar=dict(
            title=dict(
                text="Tareas",
                font=dict(color=PALETTE["text_dim"], size=11),
            ),
            tickfont=dict(color=PALETTE["text_dim"]),
            thickness=12,
            bgcolor=PALETTE["surface_low"],
            bordercolor=PALETTE["outline_variant"],
        ),
        hovertemplate=(
            "<b>%{y} — %{x}</b><br>Tareas: %{z}<extra></extra>"
        ),
        xgap=2,
        ygap=3,
    ))
    apply_plotly_theme(fig)
    fig.update_layout(
        xaxis=dict(
            title="Hora del día",
            tickfont=dict(family="JetBrains Mono, monospace", size=10),
            tickangle=-45,
        ),
        yaxis=dict(
            autorange="reversed",
            tickfont=dict(family="JetBrains Mono, monospace", size=11),
        ),
        margin=dict(t=30, b=60, l=60, r=20),
        height=380,
    )
    return fig


def _chart_fatigue(fatigue_df: pd.DataFrame) -> go.Figure:
    """Time-series of efficiency with fatigue events highlighted."""
    # Daily aggregation for trend line
    daily = (
        fatigue_df.set_index("timestamp")
        .resample("D")
        .agg(
            avg_eff=("efficiency", "mean"),
            fatigue_events=("is_fatigue", "sum"),
            bottlenecks=("is_bottleneck", "sum"),
        )
        .reset_index()
        .dropna(subset=["avg_eff"])
    )

    fatigue_days  = daily[daily["fatigue_events"] > 0]
    bottleneck_days = daily[daily["bottlenecks"] > 0]

    fig = go.Figure()

    # Gradient fill under efficiency line
    fig.add_trace(go.Scatter(
        x=daily["timestamp"],
        y=(daily["avg_eff"] * 100).round(1),
        name="Eficiencia Diaria",
        mode="lines",
        line=dict(color=PALETTE["secondary"], width=2),
        fill="tozeroy",
        fillcolor="rgba(192,193,255,0.07)",
        hovertemplate="%{x|%d %b}<br>Efic: %{y:.1f}%<extra></extra>",
    ))

    # 7-day rolling average
    if len(daily) >= 7:
        daily["rolling_eff"] = daily["avg_eff"].rolling(7, min_periods=3).mean()
        fig.add_trace(go.Scatter(
            x=daily["timestamp"],
            y=(daily["rolling_eff"] * 100).round(1),
            name="Media Móvil 7d",
            mode="lines",
            line=dict(color=PALETTE["primary"], width=2.5),
            hovertemplate="%{x|%d %b}<br>Media 7d: %{y:.1f}%<extra></extra>",
        ))

    # Fatigue event markers
    if not fatigue_days.empty:
        fig.add_trace(go.Scatter(
            x=fatigue_days["timestamp"],
            y=(fatigue_days["avg_eff"] * 100).round(1),
            name="Evento de Fatiga",
            mode="markers",
            marker=dict(
                symbol="triangle-down",
                size=10,
                color=PALETTE["error"],
                line=dict(color="#690005", width=1),
            ),
            hovertemplate="%{x|%d %b}<br>⚠ Fatiga detectada<extra></extra>",
        ))

    # Bottleneck markers
    if not bottleneck_days.empty:
        fig.add_trace(go.Scatter(
            x=bottleneck_days["timestamp"],
            y=(bottleneck_days["avg_eff"] * 100).round(1),
            name="Cuello de Botella",
            mode="markers",
            marker=dict(
                symbol="x",
                size=9,
                color="#f59e0b",
                line=dict(color="#78350f", width=1),
            ),
            hovertemplate="%{x|%d %b}<br>🔴 Cuello de botella<extra></extra>",
        ))

    # Reference lines
    fig.add_hline(y=100, line=dict(color=PALETTE["outline"], width=1, dash="dash"),
                  annotation_text="100% → On estimate",
                  annotation_font=dict(color=PALETTE["outline"], size=10))
    fig.add_hline(y=70, line=dict(color=PALETTE["error"], width=1, dash="dot"),
                  annotation_text="70% → Umbral fatiga",
                  annotation_font=dict(color=PALETTE["error"], size=10))

    apply_plotly_theme(fig)
    fig.update_layout(
        yaxis=dict(title="Eficiencia (%)", ticksuffix="%",
                   gridcolor="rgba(60,73,71,0.3)"),
        xaxis=dict(title="Fecha"),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1.0),
        margin=dict(t=30, b=40),
        height=420,
    )
    return fig


def _chart_category_breakdown(df: pd.DataFrame) -> go.Figure:
    """Donut chart: task count by category."""
    cat_counts = df["category"].value_counts()
    labels = [CATEGORY_LABELS.get(c, c) for c in cat_counts.index]
    colors = [PALETTE["primary"], PALETTE["secondary"], PALETTE["tertiary"], "#f59e0b"]

    fig = go.Figure(go.Pie(
        labels=labels,
        values=cat_counts.values,
        hole=0.58,
        marker=dict(colors=colors[:len(labels)],
                    line=dict(color=PALETTE["surface_low"], width=2)),
        textfont=dict(family="JetBrains Mono, monospace", size=11, color=PALETTE["text"]),
        hovertemplate="<b>%{label}</b><br>Tareas: %{value}<br>%{percent}<extra></extra>",
    ))
    apply_plotly_theme(fig)
    fig.update_layout(
        title=dict(text="Distribución por Categoría", x=0.0,
                   font=dict(size=13, color=PALETTE["text"])),
        legend=dict(orientation="v", x=1.0),
        height=280,
        margin=dict(l=10, r=10, t=40, b=10),
        showlegend=True,
    )
    return fig


def _chart_project_velocity(df: pd.DataFrame) -> go.Figure:
    """Horizontal bar chart: avg velocity per project."""
    proj_vel = (
        df.groupby("project")["velocity"]
        .mean()
        .sort_values(ascending=True)
        .reset_index()
    )
    proj_vel.columns = ["project", "avg_velocity"]
    proj_vel["pct"] = (proj_vel["avg_velocity"] * 100).round(1)

    colors = [
        PALETTE["primary"] if v >= 0.9 else
        PALETTE["secondary"] if v >= 0.7 else
        PALETTE["error"]
        for v in proj_vel["avg_velocity"]
    ]

    fig = go.Figure(go.Bar(
        x=proj_vel["pct"],
        y=proj_vel["project"],
        orientation="h",
        marker=dict(color=colors, line=dict(color=PALETTE["outline_variant"], width=0.5)),
        hovertemplate="<b>%{y}</b><br>Velocidad: %{x:.1f}%<extra></extra>",
    ))
    fig.add_vline(x=100, line=dict(color=PALETTE["outline"], width=1, dash="dash"))
    apply_plotly_theme(fig)
    fig.update_layout(
        title=dict(text="Velocidad por Proyecto", x=0.0,
                   font=dict(size=13, color=PALETTE["text"])),
        xaxis=dict(title="Velocidad (%)", ticksuffix="%"),
        height=280,
        margin=dict(l=10, r=10, t=40, b=10),
    )
    return fig


# ─── Section Renderers ────────────────────────────────────────────────────────


def _render_global_css() -> None:
    st.markdown(_CSS, unsafe_allow_html=True)


def _render_header() -> None:
    st.markdown("""
    <div style="margin-bottom: 8px;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:11px;
                   font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
                   color:#4fdbc8;">ZENFLOW ANALYTICS</span>
    </div>
    """, unsafe_allow_html=True)
    st.title("Dashboard de Productividad")
    st.markdown(
        '<p style="color:#bbcac6;font-size:14px;margin-top:-12px;">'
        'Inteligencia de rendimiento personal a partir de logs de desarrollo.</p>',
        unsafe_allow_html=True,
    )


def _render_sidebar(df: pd.DataFrame) -> FilterState:
    """Render sidebar filters and return the selected FilterState."""
    with st.sidebar:
        st.markdown("""
        <div style="margin-bottom:24px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:13px;
                      font-weight:600;color:#4fdbc8;margin-bottom:4px;">
            ⬡ ZenFlow
          </div>
          <div style="font-size:11px;color:#859490;">Productivity Intelligence</div>
        </div>
        <hr style="border:none;border-top:1px solid #1e293b;margin-bottom:20px;">
        """, unsafe_allow_html=True)

        st.markdown('<div class="section-header">FILTROS GLOBALES</div>',
                    unsafe_allow_html=True)

        # Date range
        min_date = df["timestamp"].dt.date.min()
        max_date = df["timestamp"].dt.date.max()

        col_a, col_b = st.columns(2)
        with col_a:
            date_start = st.date_input("Desde", value=min_date,
                                       min_value=min_date, max_value=max_date,
                                       key="date_start")
        with col_b:
            date_end = st.date_input("Hasta", value=max_date,
                                     min_value=min_date, max_value=max_date,
                                     key="date_end")

        # Project
        all_projects = sorted(df["project"].unique().tolist())
        projects = st.multiselect(
            "Proyectos",
            options=all_projects,
            default=[],
            placeholder="Todos los proyectos",
            key="filter_projects",
        )

        # Category
        cat_display = {v: k for k, v in CATEGORY_LABELS.items()}
        cat_options  = list(CATEGORY_LABELS.values())
        cat_selected = st.multiselect(
            "Categorías",
            options=cat_options,
            default=[],
            placeholder="Todas las categorías",
            key="filter_categories",
        )
        categories = [cat_display[c] for c in cat_selected] if cat_selected else []

        # Priority
        priorities = st.multiselect(
            "Prioridad",
            options=["critical", "high", "medium", "low"],
            default=[],
            format_func=lambda x: x.capitalize(),
            placeholder="Todas las prioridades",
            key="filter_priority",
        )

        # Status
        statuses = st.multiselect(
            "Estado",
            options=["completed", "in_progress", "pending"],
            default=[],
            format_func=lambda x: x.replace("_", " ").capitalize(),
            placeholder="Todos los estados",
            key="filter_status",
        )

        st.markdown('<hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;">', 
                    unsafe_allow_html=True)

        # Data source info
        st.markdown(
            f'<div style="font-size:11px;color:#3c4947;">'
            f'📁 {len(df):,} registros totales<br>'
            f'📅 {min_date.strftime("%d %b %Y")} → {max_date.strftime("%d %b %Y")}'
            f'</div>',
            unsafe_allow_html=True,
        )

    return FilterState(
        date_start=date_start,
        date_end=date_end,
        projects=projects,
        categories=categories,
        priorities=priorities,
        statuses=statuses,
    )


def _render_kpi_header(df: pd.DataFrame) -> None:
    """Render the 3 top KPI metric cards for the Executive Summary."""
    st.markdown('<div class="section-header">RESUMEN EJECUTIVO</div>',
                unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)

    throughput = compute_daily_throughput(df)
    optimal_window = compute_optimal_window(df)
    streak = compute_current_streak(df)

    with c1:
        st.metric(
            label="📊 Throughput Diario",
            value=f"{throughput:.1f} tareas/día",
            delta="Promedio completado por día activo",
            delta_color="off",
        )
    with c2:
        st.metric(
            label="🌡️ Ventana Óptima",
            value=optimal_window,
            delta="Rango de máxima productividad",
            delta_color="off",
        )
    with c3:
        st.metric(
            label="⚡ Racha Actual",
            value=f"{streak} días",
            delta="Días consecutivos de actividad",
            delta_color="off",
        )


def _render_temporal_analysis(filtered_df: pd.DataFrame) -> None:
    """Render the temporal analysis section (bicolumn: efficiency bars + heatmap)."""
    st.markdown('<div class="section-header">ANÁLISIS TEMPORAL</div>',
                unsafe_allow_html=True)

    col_left, col_right = st.columns(2)

    with col_left:
        weekday_df = aggregate_by_weekday(filtered_df)
        st.markdown('<div style="font-size:14px; font-weight:600; margin-bottom:12px; color:#dae2fd;">Distribución de Eficiencia & Throughput por Día</div>', unsafe_allow_html=True)
        st.plotly_chart(
            _chart_weekday_efficiency(weekday_df),
            width='stretch',
        )

    with col_right:
        pivot = build_hourly_heatmap(filtered_df)
        st.markdown('<div style="font-size:14px; font-weight:600; margin-bottom:12px; color:#dae2fd;">Mapa de Calor de Actividad (Hora × Día)</div>', unsafe_allow_html=True)
        st.plotly_chart(
            _chart_heatmap(pivot),
            width='stretch',
        )


def _render_fatigue_trends(filtered_df: pd.DataFrame) -> None:
    """Render the fatigue and anomaly trends section (full-width)."""
    st.markdown('<div class="section-header">TENDENCIAS E INSIGHTS DE FATIGA</div>',
                unsafe_allow_html=True)

    fatigue_df = detect_fatigue_patterns(filtered_df)
    st.markdown('<div style="font-size:14px; font-weight:600; margin-bottom:12px; color:#dae2fd;">Patrones de Fatiga & Cuellos de Botella</div>', unsafe_allow_html=True)
    st.plotly_chart(
        _chart_fatigue(fatigue_df),
        width='stretch',
    )

    # Fatigue summary stats in columns below the chart
    n_fatigue     = int(fatigue_df["is_fatigue"].sum())
    n_bottleneck  = int(fatigue_df["is_bottleneck"].sum())
    pct_fatigue   = n_fatigue / len(fatigue_df) * 100 if len(fatigue_df) > 0 else 0

    fc1, fc2, fc3 = st.columns(3)
    fc1.metric("Eventos de Fatiga", n_fatigue, f"{pct_fatigue:.1f}% del total")
    fc2.metric("Cuellos de Botella", n_bottleneck)
    fc3.metric("Peor Día", _get_worst_fatigue_day(fatigue_df))


def _get_worst_fatigue_day(fatigue_df: pd.DataFrame) -> str:
    """Return the weekday name with the most fatigue events."""
    if fatigue_df.empty or "is_fatigue" not in fatigue_df.columns:
        return "--"
    worst = (
        fatigue_df[fatigue_df["is_fatigue"]]
        .groupby("weekday")["is_fatigue"]
        .sum()
        .idxmax()
        if fatigue_df["is_fatigue"].any() else None
    )
    return worst or "--"


def _render_breakdown_charts(filtered_df: pd.DataFrame) -> None:
    """Render category donut + project velocity side by side."""
    st.markdown('<div class="section-header">DESGLOSE POR DIMENSIÓN</div>',
                unsafe_allow_html=True)
    col_l, col_r = st.columns(2)
    with col_l:
        st.plotly_chart(_chart_category_breakdown(filtered_df), width='stretch')
    with col_r:
        st.plotly_chart(_chart_project_velocity(filtered_df), width='stretch')


def _render_tasks_table(filtered_df: pd.DataFrame) -> None:
    """Render the detailed task log table."""
    st.markdown('<div class="section-header">REGISTRO DETALLADO DE TAREAS</div>',
                unsafe_allow_html=True)

    display = filtered_df[[
        "timestamp", "task_id", "project", "category", "priority",
        "est_hours", "real_hours", "difficulty", "status", "efficiency",
    ]].copy()

    display["efficiency"] = (display["efficiency"] * 100).round(1)
    display["category"]   = display["category"].map(CATEGORY_LABELS).fillna(display["category"])
    display["timestamp"]  = pd.to_datetime(display["timestamp"]).dt.strftime("%d %b %Y %H:%M")

    display.columns = [
        "Timestamp", "Task ID", "Proyecto", "Categoría", "Prioridad",
        "Est. (h)", "Real (h)", "Dificultad", "Estado", "Efic. (%)",
    ]

    st.dataframe(
        display,
        width='stretch',
        hide_index=True,
        column_config={
            "Efic. (%)": st.column_config.ProgressColumn(
                "Efic. (%)",
                format="%.1f%%",
                min_value=0,
                max_value=200,
            ),
            "Dificultad": st.column_config.NumberColumn(
                "Dificultad",
                format="%d ⭐",
            ),
        },
    )


def _render_insights_panel(fatigue_df: pd.DataFrame, kpis: dict[str, Any]) -> None:
    """Render the auto-generated insights section in 3 columns."""
    st.markdown('<div class="section-header">INSIGHTS AUTOMÁTICOS</div>',
                unsafe_allow_html=True)

    insights = _generate_insights(fatigue_df, kpis)
    if not insights:
        return

    cols = st.columns(3)
    for i, ins in enumerate(insights):
        col_idx = i % 3
        with cols[col_idx]:
            border_color = ins.get("color", PALETTE["primary"])
            st.markdown(f"""
            <div class="insight-card" style="border-left-color:{border_color}; min-height: 120px;">
              <div class="insight-title">{ins["icon"]} {ins["title"]}</div>
              <div class="insight-desc">{ins["description"]}</div>
              <div class="insight-cat">{ins["category"]}</div>
            </div>
            """, unsafe_allow_html=True)


def _generate_insights(
    fatigue_df: pd.DataFrame,
    kpis: dict[str, Any],
) -> list[dict[str, str]]:
    """Generate contextual insights from processed data."""
    insights: list[dict[str, str]] = []

    # Peak productivity day
    if "weekday" in fatigue_df.columns and not fatigue_df.empty:
        peak_day = (
            fatigue_df.groupby("weekday")["efficiency"]
            .mean()
            .idxmax()
        )
        insights.append({
            "icon": "⚡",
            "title": "Bloque de Alto Rendimiento",
            "description": (
                f"Tu pico de eficiencia ocurre los <strong>{peak_day}</strong>. "
                "Reserva ese día para trabajo profundo de alta complejidad."
            ),
            "category": "PRODUCTIVIDAD",
            "color": PALETTE["primary"],
        })

    # Fatigue warning
    fatigue_pct = kpis["fatigue_index"] * 100
    if fatigue_pct > 30:
        insights.append({
            "icon": "🧠",
            "title": "Fatiga Cognitiva Detectada",
            "description": (
                f"El índice de fatiga alcanza <strong>{fatigue_pct:.1f}%</strong>. "
                "Considera bloques de descanso activo y reducir multitarea los viernes."
            ),
            "category": "SALUD COGNITIVA",
            "color": PALETTE["error"],
        })

    # Overrun warning
    overrun_pct = kpis["overrun_rate"] * 100
    if overrun_pct > 40:
        insights.append({
            "icon": "⏱",
            "title": "Subestimación Recurrente",
            "description": (
                f"El <strong>{overrun_pct:.0f}%</strong> de tareas supera la estimación. "
                "Aplica el factor 1.3× a tus estimaciones como buffer de seguridad."
            ),
            "category": "ESTIMACIÓN",
            "color": PALETTE["secondary"],
        })

    # Bottleneck insight
    n_bottleneck = int(fatigue_df["is_bottleneck"].sum()) if "is_bottleneck" in fatigue_df.columns else 0
    if n_bottleneck > 0:
        insights.append({
            "icon": "🔴",
            "title": f"{n_bottleneck} Cuellos de Botella",
            "description": (
                "Se detectaron tareas completadas con tiempo real >2× el estimado. "
                "Revisar dependencias externas o deuda técnica acumulada."
            ),
            "category": "RIESGO",
            "color": "#f59e0b",
        })

    # Positive completion
    comp_pct = kpis["completion_rate"] * 100
    if comp_pct >= 70:
        insights.append({
            "icon": "✅",
            "title": "Alta Tasa de Completado",
            "description": (
                f"El <strong>{comp_pct:.0f}%</strong> de tareas está completado. "
                "Excelente nivel de cierre — mantén el ritmo."
            ),
            "category": "LOGRO",
            "color": PALETTE["tertiary"],
        })

    return insights or [{
        "icon": "ℹ️",
        "title": "Sin datos suficientes",
        "description": "Amplía el rango de fechas o reduce los filtros para ver insights.",
        "category": "INFO",
        "color": PALETTE["outline"],
    }]


# ─── Main Entry Point ─────────────────────────────────────────────────────────


def render_dashboard() -> None:
    """Main orchestrator — renders the full ZenFlow Analytics dashboard.

    [Verificación]
      Invariante: Esta función no modifica datos. Solo consume DataFrames
      inmutables producidos por core/data_processor.py y renderiza UI.
    """
    # ── Page config ───────────────────────────────────────────────────────────
    st.set_page_config(
        page_title="ZenFlow Analytics",
        page_icon="⬡",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    _render_global_css()
    _render_header()

    # ── Data load (cached) ────────────────────────────────────────────────────
    try:
        full_df = _load_data(str(_DATA_PATH))
    except (FileNotFoundError, ValueError, RuntimeError) as exc:
        st.error(f"**Error al cargar datos:** {exc}")
        st.info(
            "💡 Genera el dataset ejecutando: "
            "`python scripts/generate_sample_data.py`"
        )
        st.stop()

    # ── Sidebar filters ───────────────────────────────────────────────────────
    filters = _render_sidebar(full_df)

    # ── Apply filters ─────────────────────────────────────────────────────────
    filtered_df = apply_filters(
        full_df,
        date_start=filters.date_start,
        date_end=filters.date_end,
        projects=filters.projects if filters.projects else None,
        categories=filters.categories if filters.categories else None,
        priorities=filters.priorities if filters.priorities else None,
        statuses=filters.statuses if filters.statuses else None,
    )

    if filtered_df.empty:
        st.warning("⚠ No hay datos para los filtros seleccionados. Amplía el rango.")
        st.stop()

    # ── Compute KPIs ──────────────────────────────────────────────────────────
    kpis = compute_kpis(filtered_df)

    # ── Render sections ───────────────────────────────────────────────────────
    _render_kpi_header(filtered_df)
    st.markdown('<hr style="border:none;border-top:1px solid #1e293b;margin:32px 0;">', 
                unsafe_allow_html=True)

    _render_temporal_analysis(filtered_df)
    st.markdown('<hr style="border:none;border-top:1px solid #1e293b;margin:32px 0;">', 
                unsafe_allow_html=True)

    _render_breakdown_charts(filtered_df)
    st.markdown('<hr style="border:none;border-top:1px solid #1e293b;margin:32px 0;">', 
                unsafe_allow_html=True)

    # Panel de insights
    fatigue_df = detect_fatigue_patterns(filtered_df)
    _render_insights_panel(fatigue_df, kpis)
