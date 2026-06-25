# AGENT.md — ZenFlow Analytics
# Directrices de Contexto para Agentes IA (Antigravity / Claude Code)
# =====================================================================
# Versión: 1.0.0 | Fecha: 2025-06-25
# ─────────────────────────────────────────────────────────────────────

## Identidad del Proyecto

**Nombre:** ZenFlow Analytics  
**Propósito:** Plataforma analítica de productividad personal basada en logs de desarrollo.  
**Stack:** Python 3.11+ | Pandas 2.2+ | Streamlit 1.35+ | Plotly 5.22+ | NumPy 1.26+

---

## Mapa de Dependencias (STRICT — No violar)

```
app.py
  └─ ui/dashboard.py
       ├─ core/data_processor.py
       │    └─ utils/helpers.py
       └─ utils/helpers.py

utils/helpers.py        ← NO importa core/ ni ui/
core/data_processor.py  ← NO importa ui/ ni streamlit
ui/dashboard.py         ← NO transforma datos directamente
app.py                  ← NO contiene lógica de negocio
```

**Regla de oro:** Si un agente necesita añadir lógica de transformación de datos, la implementa en `core/data_processor.py`. Si necesita un nuevo componente visual, va en `ui/dashboard.py`. Nunca cruzar las fronteras del diagrama anterior.

---

## Contratos de Schema (Invariantes — No romper sin bumping de versión)

### `load_and_validate()` → DataFrame
| Columna     | Dtype           | Nullable |
|-------------|-----------------|----------|
| timestamp   | datetime64[ns]  | No       |
| task_id     | object (str)    | No       |
| project     | object (str)    | No       |
| category    | object (str)    | No       |
| priority    | object (str)    | No       |
| est_hours   | float64         | Sí       |
| real_hours  | float64         | Sí       |
| difficulty  | int64           | No       |
| status      | object (str)    | No       |

### `enrich_features()` → DataFrame (+ columnas adicionales)
| Columna     | Dtype   |
|-------------|---------|
| date        | date    |
| weekday_num | int64   |
| weekday     | str     |
| hour        | int64   |
| week_iso    | int64   |
| efficiency  | float64 |
| overrun     | bool    |
| velocity    | float64 |

### `compute_kpis()` → dict
```python
{
  "total_tasks":      int,
  "completed_tasks":  int,
  "completion_rate":  float,   # 0–1
  "avg_efficiency":   float,   # real/est ratio
  "avg_velocity":     float,   # est/real ratio
  "total_real_hours": float,
  "total_est_hours":  float,
  "overrun_rate":     float,   # 0–1
  "fatigue_index":    float,   # 0–1 composite
}
```

### `aggregate_by_weekday()` → DataFrame (7 filas, Mon–Sun)
Columnas: `weekday_num, weekday, task_count, avg_eff, std_eff, total_hours, throughput, completion_r`

### `build_hourly_heatmap()` → DataFrame (24 × 7 pivot)
Index: `hour` (0–23) | Columns: `WEEKDAY_LABELS` | Values: task count (int)

### `detect_fatigue_patterns()` → DataFrame (+ fatigue flags)
Columnas adicionales: `eff_zscore (float), is_fatigue (bool), is_bottleneck (bool)`

---

## Reglas de Refactor para Agentes

### 1. Añadir una nueva transformación de datos
```python
# ✅ CORRECTO — añadir en core/data_processor.py
def new_analysis(df: pd.DataFrame) -> pd.DataFrame:
    """Docstring con [Especificación], [Planificación], [Verificación]."""
    ...

# ❌ INCORRECTO — jamás en ui/dashboard.py o app.py
```

### 2. Añadir un nuevo gráfico o sección UI
```python
# ✅ CORRECTO — añadir _chart_xxx() en ui/dashboard.py
def _chart_new_view(df: pd.DataFrame) -> go.Figure:
    fig = go.Figure(...)
    apply_plotly_theme(fig)   # siempre aplicar el theme
    return fig

# ❌ INCORRECTO — no instanciar go.Figure en core/
```

### 3. Añadir un nuevo color o token visual
```python
# ✅ CORRECTO — añadir en utils/helpers.py → PALETTE dict
PALETTE["new_accent"] = "#rrggbb"

# ❌ INCORRECTO — hardcodear hex en dashboard.py
```

### 4. Optimización de rendimiento
- Toda transformación O(N²) debe reemplazarse por equivalente vectorizada.
- Prohibido: `.apply(lambda row: ...)` sobre DataFrames grandes (>1k filas).
- Permitido: `.apply()` con funciones nombradas sobre Series simples si numpy no tiene equivalente.
- Usar `@st.cache_data(ttl=300)` para todas las cargas de datos en dashboard.py.

### 5. Manejo de errores
```python
# Patrón estándar para guards en data_processor
if df.empty:
    raise ValueError("[ZenFlow] <function_name> received empty DataFrame.")
if "required_col" not in df.columns:
    raise ValueError("[ZenFlow] Missing column 'required_col'.")
```

---

## Comandos de Verificación

```powershell
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Generar dataset sintético
python scripts/generate_sample_data.py

# 3. Verificar imports del core
python -c "from core.data_processor import load_and_validate, compute_kpis, enrich_features; print('core OK')"

# 4. Verificar imports del utils
python -c "from utils.helpers import PALETTE, PLOTLY_THEME, validate_csv_schema; print('utils OK')"

# 5. Lanzar aplicación
streamlit run app.py
```

---

## Nomenclatura de Funciones

| Prefijo     | Ámbito      | Ejemplo                        |
|-------------|-------------|--------------------------------|
| `load_`     | I/O         | `load_and_validate()`          |
| `enrich_`   | Features    | `enrich_features()`            |
| `compute_`  | Aggregation | `compute_kpis()`               |
| `aggregate_`| GroupBy     | `aggregate_by_weekday()`       |
| `build_`    | Matrix/Pivot| `build_hourly_heatmap()`       |
| `detect_`   | Analysis    | `detect_fatigue_patterns()`    |
| `apply_`    | Filter/Mod  | `apply_filters()`              |
| `_render_`  | UI (private)| `_render_kpi_header()`         |
| `_chart_`   | Plotly figs | `_chart_weekday_efficiency()`  |

---

## Historial de Versiones del Schema

| Versión | Fecha       | Cambio                                      |
|---------|-------------|---------------------------------------------|
| 1.0.0   | 2025-06-25  | Schema inicial con 9 columnas base          |
