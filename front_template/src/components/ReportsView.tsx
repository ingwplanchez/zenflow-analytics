import React, { useState } from 'react';
import { 
  Tune, 
  FileText, 
  Database, 
  Table, 
  Calendar, 
  CalendarRange, 
  Check, 
  Wand2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Activity, 
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'cust'>('7d');
  const [metrics, setMetrics] = useState({
    rend: true,
    velo: true,
    riesgo: true,
    flujo: false,
    enfoque: false,
  });
  const [isAuto, setIsAuto] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const toggleMetric = (key: keyof typeof metrics) => {
    setMetrics({ ...metrics, [key]: !metrics[key] });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadDone(false);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3500);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300 select-none">
      {/* Left Column: Controls */}
      <div className="lg:col-span-5 space-y-6">
        {/* Report Config Card */}
        <section className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/40">
            <Activity className="size-5 text-primary" />
            <h3 className="font-headline text-lg font-bold text-on-surface">Configuración del Reporte</h3>
          </div>

          {/* Formato de Salida */}
          <div>
            <label className="font-label text-[11px] font-bold text-on-surface-variant block mb-3 uppercase tracking-wider">
              Formato de Salida
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'PDF', icon: FileText },
                { id: 'CSV', icon: Table },
                { id: 'JSON', icon: Database },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const active = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer border ${
                      active
                        ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface-container-high border-outline-variant/60 text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <Icon className="size-7 mb-2" />
                    <span className="text-xs font-label">{fmt.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rango de Fechas */}
          <div>
            <label className="font-label text-[11px] font-bold text-on-surface-variant block mb-3 uppercase tracking-wider">
              Rango de Fechas
            </label>
            <div className="space-y-2.5">
              {[
                { id: '7d', label: 'Últimos 7 días', icon: Calendar },
                { id: '30d', label: 'Últimos 30 días', icon: CalendarRange },
                { id: 'cust', label: 'Personalizado', icon: Calendar },
              ].map((rg) => {
                const Icon = rg.icon;
                const active = dateRange === rg.id;
                return (
                  <label
                    key={rg.id}
                    onClick={() => setDateRange(rg.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                      active
                        ? 'bg-surface-container border-primary shadow-sm text-on-surface font-bold'
                        : 'bg-surface-container-low border-outline-variant/40 hover:border-outline text-on-surface-variant'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`size-4.5 ${active ? 'text-primary' : 'text-outline'}`} />
                      <span className="text-sm">{rg.label}</span>
                    </div>
                    <input
                      type="radio"
                      checked={active}
                      onChange={() => {}}
                      className="size-4 text-primary focus:ring-primary accent-primary"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Métricas Incluidas */}
          <div>
            <label className="font-label text-[11px] font-bold text-on-surface-variant block mb-3 uppercase tracking-wider">
              Métricas Incluidas
            </label>
            <div className="space-y-3 font-body text-sm">
              {[
                { key: 'rend', label: 'Rendimiento (Productividad)' },
                { key: 'velo', label: 'Velocidad (Entrega de código)' },
                { key: 'riesgo', label: 'Nivel de Riesgo Predictivo' },
                { key: 'flujo', label: 'Consistencia de Flujo (Deep Work)' },
                { key: 'enfoque', label: 'Análisis de Enfoque Cognitivo' },
              ].map((m) => {
                const checked = metrics[m.key as keyof typeof metrics];
                return (
                  <label key={m.key} onClick={() => toggleMetric(m.key as any)} className="flex items-center justify-between p-1 cursor-pointer group">
                    <span className={`transition-colors ${checked ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                      {m.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="size-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container-highest border-outline-variant"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* Automatización Section */}
        <section className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="size-5 text-secondary" />
              <h3 className="font-headline text-lg font-bold text-on-surface">Automatización</h3>
            </div>
            <button
              onClick={() => setIsAuto(!isAuto)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 duration-200 cursor-pointer ${
                isAuto ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
              }`}
            >
              <span className="size-4.5 rounded-full bg-surface shadow-md"></span>
            </button>
          </div>

          <div className={`space-y-4 transition-all duration-300 ${isAuto ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div>
              <label className="font-label text-[10px] font-bold text-on-surface-variant block mb-1.5 uppercase tracking-wider">
                Frecuencia de Envío
              </label>
              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-secondary outline-none font-body">
                <option>Diario</option>
                <option selected>Semanal (Lunes 8:00 AM)</option>
                <option>Mensual (Día 1)</option>
              </select>
            </div>
            <div>
              <label className="font-label text-[10px] font-bold text-on-surface-variant block mb-1.5 uppercase tracking-wider">
                Destinatarios
              </label>
              <input
                type="text"
                defaultValue="ejemplo@empresa.com, cto@zenflow.io"
                placeholder="correos separados por coma..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-secondary outline-none font-label"
              />
              <p className="text-[10px] text-outline mt-1.5 italic">Separar múltiples correos institucionales con comas.</p>
            </div>
          </div>
        </section>

        {/* Generate Download CTA */}
        <button
          disabled={isDownloading}
          onClick={handleDownload}
          className="w-full py-4 bg-primary hover:brightness-110 text-on-primary font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/25 transition-all active:scale-[0.98] cursor-pointer text-base disabled:opacity-75"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2 animate-pulse">
              <Download className="size-5 animate-bounce" /> Generando telemetría...
            </span>
          ) : (
            <>
              <Download className="size-5" />
              <span>Generar y Descargar Reporte ({format})</span>
            </>
          )}
        </button>

        {downloadDone && (
          <div className="p-4 bg-tertiary/20 border border-tertiary rounded-xl text-tertiary font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom">
            <CheckCircle2 className="size-5" />
            <span>Reporte_Rendimiento_Ejecutivo.{format.toLowerCase()} exportado con éxito.</span>
          </div>
        )}
      </div>

      {/* Right Column: Live Mock Preview */}
      <div className="lg:col-span-7">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4.5 text-on-surface-variant" />
              <span className="font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                Vista Previa Interactiva del Documento
              </span>
            </div>
            <div className="flex gap-1 p-1 bg-surface-container-high rounded-lg text-outline">
              <button className="p-1.5 hover:text-primary transition-colors rounded"><ZoomIn className="size-4" /></button>
              <button className="p-1.5 hover:text-primary transition-colors rounded"><ZoomOut className="size-4" /></button>
              <button className="p-1.5 hover:text-primary transition-colors rounded"><Maximize2 className="size-4" /></button>
            </div>
          </div>

          {/* Mock Document Container */}
          <div className="bg-surface-container-highest rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden aspect-[1/1.38] flex flex-col group border border-outline-variant">
            {/* Outer Dark Padding Frame */}
            <div className="absolute inset-0 border-[18px] border-surface-container-lowest/60 pointer-events-none rounded-2xl"></div>

            {/* Document Sheet */}
            <div className="bg-white text-slate-900 h-full w-full p-8 sm:p-10 rounded-lg overflow-y-auto flex flex-col shadow-inner select-text">
              {/* Sheet Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-6 bg-[#14b8a6] rounded flex items-center justify-center text-white font-bold text-xs">
                      ZF
                    </div>
                    <span className="text-xs font-bold tracking-tight uppercase text-slate-800 font-label">ZenFlow Analytics</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Reporte de Rendimiento</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Periodo: 24 May 2024 - 31 May 2024</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase font-label">ID de Exportación</p>
                  <p className="text-xs font-label font-bold text-slate-700">ZF-992-B8X</p>
                </div>
              </div>

              {/* Sheet KPIs Grid */}
              <div className="grid grid-cols-2 gap-5 mb-6">
                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/70">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-label">Puntuación Rendimiento</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-label">92.4%</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded">+4.2%</span>
                  </div>
                </div>
                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/70">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-label">Sesiones de Enfoque</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-label">48h</span>
                    <span className="text-[10px] font-bold text-slate-400">Meta Alcanzada</span>
                  </div>
                </div>
              </div>

              {/* Sheet Chart Placeholder */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 font-label">Tendencias de Velocidad</p>
                <div className="w-full h-36 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center relative px-6">
                  <div className="absolute inset-x-8 bottom-6 flex items-end gap-2 h-20">
                    {[45, 60, 85, 55, 70, 95, 50].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t transition-all ${h > 80 ? 'bg-[#14b8a6]' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Summary */}
              <div className="mb-6 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-label">Insights y Evaluación</p>
                <div className="flex gap-3 text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-700 shrink-0">✔ Optimización:</span>
                  <span>La consistencia del flujo mejoró un 12% tras bloques de trabajo profundo matutinos.</span>
                </div>
                <div className="flex gap-3 text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-700 shrink-0">⚠ Advertencia:</span>
                  <span>El cambio de contexto alcanzó un pico el miércoles correlacionado con una baja del 15%.</span>
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest font-label">
                <span>Confidencial - ZenFlow Analytics OS</span>
                <span>Página 01 de 12</span>
              </div>
            </div>

            {/* Hover Realtime Overlay */}
            <div className="absolute inset-0 bg-surface/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl">
              <div className="bg-surface rounded-full px-6 py-2.5 border border-primary text-primary font-bold text-xs shadow-2xl animate-bounce">
                ⚡ Sincronización en tiempo real activa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
