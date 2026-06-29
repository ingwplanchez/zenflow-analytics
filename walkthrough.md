# Walkthrough — ZenFlow Analytics

Documentación de la verificación y ejecución de la plataforma de productividad personal **ZenFlow Analytics**.

## Cambios y Ajustes en Caliente

Durante la fase de verificación y ejecución se detectaron y corrigieron los siguientes inconvenientes en [dashboard.py](file:///c:/Users/USER/Documents/wplanchez/Portafolio/Repositorios/Streamlit/zenflow-analytics/ui/dashboard.py):

1. **Conflicto de Argumentos Duplicados en Plotly (`yaxis`)**:
   - *Problema*: Al configurar el layout de los gráficos desempaquetando `**PLOTLY_THEME["layout"]` dentro de `fig.update_layout()` junto con los parámetros explícitos `yaxis=...` o `xaxis=...`, Python arrojaba un `TypeError: multiple values for keyword argument 'yaxis'`.
   - *Solución*: Se modificó el flujo para aplicar primero la plantilla usando la función auxiliar `apply_plotly_theme(fig)` y posteriormente realizar las actualizaciones específicas con `fig.update_layout(...)`.

2. **Propiedad Obsoleta en ColorBar (`titlefont`)**:
   - *Problema*: Plotly 6.x arrojaba un `ValueError: Invalid property specified for object of type ColorBar: 'titlefont'`.
   - *Solución*: Se actualizó la barra de color del mapa de calor de actividad para usar la especificación anidada moderna compatible: `title=dict(text="Tareas", font=dict(color=PALETTE["text_dim"], size=11))`.

---

## Verificación de Ejecución

### 1. Servidor de Streamlit Activo
El servidor se está ejecutando exitosamente sobre el entorno virtual local en el puerto **8501**:
- **Comando utilizado**: `.venv\Scripts\streamlit.exe run app.py`
- **URL local**: `http://localhost:8501`

### 2. Estabilidad de Consola
Los logs del servidor confirman que la aplicación se ejecuta con total estabilidad y sin fallos críticos de ejecución (tracebacks).

---

## Tareas del Backlog Completadas

Una vez confirmada la estabilidad de la interfaz inicial y del motor ETL, se han implementado las siguientes funcionalidades:
- [x] Añadir el cargador de archivos dinámico en la UI sidebar (`st.file_uploader`).
- [x] Diseñar e implementar pruebas de regresión / unitarias para el motor ETL en `core/data_processor.py`.

## Próximos Pasos Sugeridos
- Implementar soporte para la columna `module_task` en la tabla de tareas para mostrar la descripción detallada de cada actividad.
- Explorar la integración de exportadores automáticos desde herramientas externas (Jira/GitHub).
