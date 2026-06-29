# ZenFlow Analytics

> **Personal Dev Intelligence, Mastered.**  
> Plataforma analítica de productividad personal basada en logs de desarrollo históricos.

[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.35+-ff4b4b?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Pandas](https://img.shields.io/badge/Pandas-2.2+-150458?logo=pandas&logoColor=white)](https://pandas.pydata.org)
[![Plotly](https://img.shields.io/badge/Plotly-5.22+-3f4f75?logo=plotly&logoColor=white)](https://plotly.com)

---

## Descripción

ZenFlow Analytics transforma logs de proyectos de software en inteligencia accionable de productividad personal. El sistema procesa series temporales de actividad de desarrollo y expone KPIs, análisis estadístico avanzado y detección de patrones de fatiga a través de una interfaz Streamlit de alta densidad visual.

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Carga Dinámica** | Ingesta de archivos CSV personalizados vía `st.file_uploader` con validación de esquema |
| **ETL Engine** | Ingesta, validación y normalización de CSV de logs con tipado estricto |
| **KPI Dashboard** | Eficiencia global, velocidad, tasa de completado, índice de fatiga |
| **Eficiencia por Día** | Distribución dual-eje: eficiencia (barras) + throughput (línea) × día semana |
| **Mapa de Calor** | Densidad de actividad `24h × 7 días` — ventanas de máxima productividad |
| **Detección de Fatiga** | Z-score rolling sobre eficiencia, cuellos de botella (real > 2× est) |
| **Insights Automáticos** | Recomendaciones contextuales generadas desde los datos procesados |
| **Filtros Reactivos** | Sidebar: fecha, proyecto, categoría, prioridad, estado |

## Guía de Análisis de Métricas

Para interpretar correctamente el Dashboard, ZenFlow utiliza los siguientes conceptos:

### 📊 Distribución de Eficiencia & Rendimiento
Combina la calidad de la planificación con la densidad del trabajo:
- **Eficiencia (Barras)**: $\text{Real} / \text{Estimado}$. 
    - $100\%$ = Estimación perfecta. 
    - $>100\%$ = Subestimación o imprevistos (Overrun).
    - $<100\%$ = Tarea finalizada antes de lo previsto.
- **Rendimiento (Línea)**: $\text{Tareas} / \text{Horas Reales}$.
    - **Alto**: Muchas tareas pequeñas cerradas (Día de limpieza de backlog).
    - **Bajo**: Pocas tareas que requieren mucho tiempo (Día de *Deep Work*).

### 🌡️ Mapa de Calor de Actividad
Representa la densidad de inicio de tareas en una matriz de $24\text{h} \times 7\text{ días}$.
- **Zonas Intensas**: Ventanas de máxima productividad y enfoque.
- **Zonas Vacías**: Periodos de inactividad o descanso.
- **Uso**: Ayuda a identificar el "ritmo circadiano" de productividad para programar las tareas más complejas en las horas de mayor densidad.

## Estructura del Repositorio

```
zenflow-analytics/
├── core/
│   └── data_processor.py      # ETL puro Pandas — O(N) vectorizado
├── ui/
│   └── dashboard.py           # Layout Streamlit — desacoplado de datos
├── utils/
│   └── helpers.py             # Tokens DESIGN.md, Plotly theme, formatters
├── tests/
│   └── test_data_processor.py  # Suite de pruebas unitarias para el motor ETL
├── data/
│   └── sample_logs.csv        # Dataset sintético (~500 registros, 6 meses)
├── scripts/
│   └── generate_sample_data.py# Generador de datos con patrones realistas
├── front_template/            # Prototipo visual React/Vite (referencia)
├── .streamlit/
│   └── config.toml            # Theming Streamlit (paleta DESIGN.md)
├── AGENT.md                   # Directrices para agentes IA (Antigravity/Claude)
├── DESIGN.md                  # Sistema de diseño y tokens visuales
├── app.py                     # Entry point
└── requirements.txt
```

## Inicio Rápido

```powershell
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Generar dataset de ejemplo
python scripts/generate_sample_data.py

# 3. Ejecutar suite de pruebas (Validación del Motor ETL)
python -m pytest tests/test_data_processor.py

# 4. Lanzar aplicación
streamlit run app.py
```

La aplicación estará disponible en `http://localhost:8501`.

## Calidad y Pruebas

El núcleo de procesamiento de datos (`core/data_processor.py`) está respaldado por una suite de pruebas unitarias implementada con `pytest` que garantiza:
- **Integridad del Esquema**: Validación de columnas requeridas y coerción de tipos.
- **Precisión de KPIs**: Verificación de cálculos de eficiencia y velocidad.
- **Robustez**: Manejo de valores nulos, archivos vacíos y divisiones por cero.
- **Detección de Patrones**: Validación de la lógica de detección de fatiga y cuellos de botella.

## Arquitectura

El sistema sigue el pipeline `[Especificación] → [Planificación] → [Verificación]`:

```
CSV Logs
   │
   ▼
core/data_processor.py          ← ETL puro, sin UI
   │  load_and_validate()
   │  enrich_features()
   │  compute_kpis()
   │  aggregate_by_weekday()
   │  build_hourly_heatmap()
   │  detect_fatigue_patterns()
   │  apply_filters()
   │
   ▼
ui/dashboard.py                 ← UI pura, sin lógica de datos
   │  render_dashboard()
   │    _render_sidebar()       → FilterState
   │    _render_kpi_header()
   │    _render_analytics_tabs()
   │    _render_breakdown_charts()
   │    _render_tasks_table()
   │    _render_insights_panel()
   │
   ▼
app.py                          ← Entry point mínimo
```

## Paleta de Diseño

Extraída del `DESIGN.md`:

| Token | Hex | Uso |
|-------|-----|-----|
| Primary (Teal) | `#4fdbc8` | Throughput, estados activos, CTAs |
| Secondary (Indigo) | `#c0c1ff` | Tendencias históricas |
| Tertiary (Emerald) | `#4edea3` | Insights positivos, completados |
| Background | `#0b1326` | Canvas — Deep Slate |
| Surface Low | `#131b2e` | Cards, sidebar |
| Text | `#dae2fd` | Texto principal |

## Para Agentes IA

Ver [`AGENT.md`](AGENT.md) para:
- Mapa de dependencias estricto
- Contratos de schema de cada función
- Reglas de refactor y nombrado
- Comandos de verificación

---

*Generado con Antigravity IDE — ZenFlow Analytics v1.0.0*
