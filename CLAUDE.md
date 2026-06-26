# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup and Run
- **Install dependencies**: `pip install -r requirements.txt`
- **Generate sample dataset**: `python scripts/generate_sample_data.py`
- **Run application**: `streamlit run app.py`

### Verification
- **Verify Core imports**: `python -c "from core.data_processor import load_and_validate, compute_kpis, enrich_features; print('core OK')"`
- **Verify Utils imports**: `python -c "from utils.helpers import PALETTE, PLOTLY_THEME, validate_csv_schema; print('utils OK')"`

## Architecture

ZenFlow Analytics follows a strict layered architecture to ensure separation of concerns between data processing and visualization.

### Layered Dependency Map (STRICT)
`app.py` $\rightarrow$ `ui/dashboard.py` $\rightarrow$ `core/data_processor.py` $\rightarrow$ `utils/helpers.py`

- **`utils/helpers.py`**: Bottom layer. Contains design tokens, Plotly themes, and basic schema validators. Must NOT import from `core/` or `ui/`.
- **`core/data_processor.py`**: Pure ETL engine. Handles data ingestion, cleaning, feature engineering, and KPI computation using vectorized Pandas/NumPy operations. Must NOT import from `ui/` or `streamlit`.
- **`ui/dashboard.py`**: Pure UI layer. Manages Streamlit layout and Plotly figure instantiation. Must NOT perform direct data transformations; it delegates all logic to `core/`.
- **`app.py`**: Entry point. Minimal logic, only calls the main dashboard render function.

### Core ETL Pipeline
`CSV Logs` $\rightarrow$ `load_and_validate()` $\rightarrow$ `enrich_features()` $\rightarrow$ `(compute_kpis | aggregate_by_weekday | build_hourly_heatmap | detect_fatigue_patterns)` $\rightarrow$ `UI`

## Coding Standards

### Data Processing (`core/`)
- **Performance**: All transformations must be $O(N)$ vectorized. Avoid `.apply(lambda row: ...)` on large DataFrames.
- **Naming Convention**:
    - `load_*`: I/O operations.
    - `enrich_*`: Feature engineering.
    - `compute_*`: Scalar aggregations/KPIs.
    - `aggregate_*`: GroupBy operations.
    - `build_*`: Matrix/Pivot table construction.
    - `detect_*`: Pattern analysis (e.g., fatigue).
    - `apply_*`: Filtering and modifications.
- **Error Handling**: Use guards with specific `ValueError` messages: `if df.empty: raise ValueError("[ZenFlow] <func> received empty DataFrame.")`.

### UI Development (`ui/`)
- **Naming Convention**:
    - `_render_*`: Private functions for UI layout sections.
    - `_chart_*`: Functions returning Plotly `go.Figure` objects.
- **Styling**: Never hardcode hex colors. Always use the `PALETTE` dictionary from `utils/helpers.py` and apply `apply_plotly_theme(fig)` to all charts.
- **Caching**: Use `@st.cache_data` for all data loading functions to prevent reprocessing on every interaction.
