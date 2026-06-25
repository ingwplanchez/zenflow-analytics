# ZenFlow Analytics — Plan de Implementación

Plataforma analítica de productividad personal basada en logs de desarrollo históricos. Motor ETL en Pandas, interfaz reactiva en Streamlit, análisis estadístico avanzado (distribución de eficiencia, mapas de calor de actividad, detección de fatiga). El sistema aprovecha el design system de `DESIGN.md` y la paleta de tokens del `front_template` existente en el repositorio.

---

## Identidades del Sistema

### Nombres Comerciales / Técnicos
| # | Nombre | Tagline |
|---|--------|---------|
| 1 | **ZenFlow Analytics** *(existente — confirmar)* | *Personal Dev Intelligence, Mastered.* |
| 2 | **Chronos Dev Intelligence** | *Measure. Understand. Optimize.* |
| 3 | **Aether Productivity Engine** | *From raw logs to strategic clarity.* |

### Nomenclatura de Repositorio Git
| # | Slug |
|---|------|
| 1 | `zenflow-analytics` *(existente — mantener)* |
| 2 | `chronos-devint` |
| 3 | `aether-prod-engine` |

> [!IMPORTANT]
> El repositorio ya existe en `zenflow-analytics`. La implementación se realizará directamente en ese directorio, coexistiendo con `front_template/` (prototipo visual React/Vite).

---

## Arquitectura de la Solución

```
zenflow-analytics/
├── core/
│   └── data_processor.py      # ETL puro en Pandas — sin dependencias de UI
├── ui/
│   └── dashboard.py           # Layout Streamlit — sin lógica de negocio
├── utils/
│   └── helpers.py             # Configuración, colores, typing helpers
├── data/
│   └── sample_logs.csv        # Dataset sintético de desarrollo (generado)
├── .streamlit/
│   └── config.toml            # Theming Streamlit → paleta DESIGN.md
├── app.py                     # Entry point — orquesta ui/dashboard.py
├── AGENT.md                   # Directrices de contexto para agentes IA
├── requirements.txt           # pandas, streamlit, plotly, numpy
└── README.md                  # Documentación actualizada
```

---

## Proposed Changes

### Core — Motor ETL

#### [NEW] [data_processor.py](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/core/data_processor.py)

Módulo de procesamiento puro con las siguientes funciones vectorizadas (sin `.apply()` con lambdas):

- `load_and_validate(path: str) -> pd.DataFrame` — Ingesta, validación de schema, coerción de tipos `datetime64[ns]`
- `compute_kpis(df: pd.DataFrame) -> dict[str, Any]` — Velocidad promedio, eficiencia (real/estimado), throughput
- `aggregate_by_weekday(df: pd.DataFrame) -> pd.DataFrame` — Distribución eficiencia/throughput × día semana
- `build_hourly_heatmap(df: pd.DataFrame) -> pd.DataFrame` — Matriz `(hora × día_semana)` de densidad de actividad
- `detect_fatigue_patterns(df: pd.DataFrame) -> pd.DataFrame` — Cuellos de botella via z-score sobre ventanas temporales

**Invariantes documentados:** Todos los DataFrames de salida tienen schema fijo (columnas, dtypes) especificado en docstring antes de cada función.

---

### Utils — Helpers y Configuración

#### [NEW] [helpers.py](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/utils/helpers.py)

- `PALETTE: dict[str, str]` — Tokens de color extraídos de `DESIGN.md` (primary `#4fdbc8`, secondary `#c0c1ff`, tertiary `#4edea3`, background `#0b1326`)
- `PLOTLY_THEME: dict` — Template Plotly custom: dark, sin gridlines, fuente JetBrains Mono en ejes de datos
- `fmt_hours(h: float) -> str` — Formateador de horas con precisión configurable
- `validate_csv_schema(df: pd.DataFrame, required_cols: list[str]) -> bool` — Guard clause para archivos corruptos

---

### Data — Dataset Sintético

#### [NEW] [sample_logs.csv](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/data/sample_logs.csv)

Generado mediante script Python (no hardcoded). Columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `timestamp` | `datetime64[ns]` | Momento de inicio de la tarea |
| `task_id` | `str` | Ej: `ZEN-104`, `JRA-229` |
| `project` | `str` | Nombre del proyecto |
| `category` | `str` | deep_work, collaboration, reactive, strategy |
| `priority` | `str` | critical, high, medium, low |
| `est_hours` | `float` | Horas estimadas |
| `real_hours` | `float` | Horas reales |
| `difficulty` | `int` | 1–5 |
| `status` | `str` | completed, in_progress, pending |

~500 registros cubriendo 6 meses de actividad simulada con patrones realistas (fatiga de viernes, picos martes/miércoles).

---

### UI — Dashboard Streamlit

#### [NEW] [dashboard.py](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/ui/dashboard.py)

5 secciones — totalmente desacopladas de `core/`:

1. **Sidebar de Filtros** — Rango de fechas, proyecto, categoría, prioridad
2. **KPI Header Row** — 4 métricas (Velocidad Promedio, Eficiencia Global, Throughput Total, Índice de Fatiga)
3. **Vista Analytics** — Tabs: *Eficiencia por Día* | *Mapa de Calor de Actividad* | *Patrones de Fatiga*
4. **Tabla de Tareas** — Registro detallado con st.dataframe y colores condicionales
5. **Insights Automáticos** — Panel lateral con recomendaciones generadas desde `detect_fatigue_patterns()`

**Theming:** `.streamlit/config.toml` aplicará la paleta del `DESIGN.md`:
- `primaryColor = "#4fdbc8"`
- `backgroundColor = "#0b1326"`
- `secondaryBackgroundColor = "#131b2e"`
- `textColor = "#dae2fd"`

**CSS Custom** inyectado via `st.markdown()`: glassmorphism cards, fuentes Inter + JetBrains Mono desde Google Fonts, efectos hover con glow teal.

---

### Streamlit Config

#### [NEW] [config.toml](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/.streamlit/config.toml)

Mapeo 1:1 con tokens del `DESIGN.md`.

---

### Entry Point

#### [NEW] [app.py](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/app.py)

Orquestador mínimo: importa `ui/dashboard.py` y llama `render_dashboard()`.

---

### Agent Configuration

#### [NEW] [AGENT.md](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/AGENT.md)

Archivo de directrices para agentes IA (Antigravity / Claude Code). Incluye:
- Invariantes de módulo por archivo
- Reglas de refactor (no romper contratos de schema)
- Comandos de verificación (`streamlit run app.py`, `python -m pytest`)
- Mapa de dependencias (qué puede importar qué)

---

### Dependencies

#### [NEW] [requirements.txt](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/requirements.txt)

```
streamlit>=1.35.0
pandas>=2.2.0
plotly>=5.22.0
numpy>=1.26.0
```

---

## Open Questions

> [!IMPORTANT]
> **¿Fuente de datos real o sintética?** El plan asume un dataset sintético de ~500 registros generado programáticamente. Si tienes logs reales (CSV/JSON), podemos adaptarlos. ¿Los tenemos?

> [!NOTE]
> **¿Upload dinámico?** ¿Quieres que el dashboard permita subir un CSV propio via `st.file_uploader`, o solo cargar desde `data/sample_logs.csv`?

> [!NOTE]
> **¿Autenticación?** El `front_template` tiene un `AuthView`. ¿La versión Streamlit necesita login (st-authenticator), o es un dashboard local sin auth?

---

## Verification Plan

### Automated
```powershell
# Instalar dependencias
pip install -r requirements.txt

# Verificar imports y tipos
python -c "from core.data_processor import load_and_validate, compute_kpis; print('OK')"

# Lanzar app
streamlit run app.py
```

### Manual
- Verificar que los 4 KPIs se renderizan correctamente
- Confirmar que el mapa de calor `(24h × 7 días)` se despliega en la tab Analytics
- Validar que los filtros del sidebar reactualizan todos los gráficos
- Comprobar paleta de colores: teal primario, fondo oscuro `#0b1326`
