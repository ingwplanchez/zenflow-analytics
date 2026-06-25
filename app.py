"""
app.py — ZenFlow Analytics
===========================
Entry point mínimo. Orquesta ui/dashboard.py sin lógica de negocio.

[Especificación]
  Este archivo SÓLO importa y llama render_dashboard().
  Todas las dependencias de datos viven en core/.
  Todas las dependencias de UI viven en ui/.

Ejecución:
  streamlit run app.py
"""

from ui.dashboard import render_dashboard

if __name__ == "__main__" or True:
    render_dashboard()
