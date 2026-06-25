import React from 'react';
import { INSIGHTS_LIST } from '../data';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Lightbulb, 
  Timer, 
  Moon, 
  Wand2,
  Zap,
  Activity
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  // Generate deterministic heatmap data
  const heatmapCells = Array.from({ length: 49 }, (_, i) => {
    const val = (Math.sin(i * 0.4) + Math.cos(i * 0.7) + 2) / 4; // 0 to 1
    return val;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Row 1: Executive Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-primary/50 transition-all">
          <div>
            <p className="font-label text-[11px] uppercase font-bold text-outline tracking-wider mb-2">
              Throughput Diario
            </p>
            <div className="flex items-baseline gap-2.5">
              <h4 className="font-label text-4xl font-bold text-primary">8.4</h4>
              <p className="text-sm text-on-surface-variant font-medium">tareas/día</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-tertiary text-xs font-label font-bold">
            <TrendingUp className="size-4" />
            <span>+12.5% vs semana pasada</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-secondary/50 transition-all">
          <div>
            <p className="font-label text-[11px] uppercase font-bold text-outline tracking-wider mb-2">
              Ventana Óptima
            </p>
            <h4 className="font-label text-2xl font-bold text-secondary mb-1 whitespace-nowrap">
              10:00 AM - 12:00 PM
            </h4>
            <p className="text-xs text-on-surface-variant">Pico de enfoque profundo detectado</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-secondary text-xs font-label font-bold">
            <Clock className="size-4" />
            <span>Basado en 28 días móviles</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-surface-container via-surface-container to-surface-container-high hover:border-tertiary/50 transition-all">
          <div>
            <p className="font-label text-[11px] uppercase font-bold text-outline tracking-wider mb-2">
              Racha Actual
            </p>
            <div className="flex items-baseline gap-2">
              <h4 className="font-label text-4xl font-bold text-tertiary">12</h4>
              <span className="text-sm font-semibold text-on-surface-variant tracking-wider">DÍAS</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">Récord personal: 18 días</p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full w-2/3 rounded-full shadow-[0_0_10px_#4edea3]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Main Focal Point & Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Center */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <Calendar className="size-5 text-primary" />
              <h3 className="font-label text-xs uppercase tracking-widest text-on-surface font-bold">
                Análisis Temporal Cognitivo
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-surface-variant text-[10px] text-outline font-label font-bold tracking-wider">
              DÍA VS HORA
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-2">
            <div className="grid grid-cols-7 gap-2">
              {/* Labels */}
              <div className="col-span-7 flex justify-between px-4 text-[10px] text-outline font-label font-bold mb-3">
                <span>LUN</span>
                <span>MAR</span>
                <span>MIÉ</span>
                <span>JUE</span>
                <span>VIE</span>
                <span>SÁB</span>
                <span>DOM</span>
              </div>
              {/* Heatmap Grid */}
              {heatmapCells.map((val, idx) => {
                let colorClass = 'bg-surface-container-highest/60';
                if (val > 0.75) colorClass = 'bg-primary shadow-[0_0_12px_rgba(79,219,200,0.4)]';
                else if (val > 0.5) colorClass = 'bg-primary/70';
                else if (val > 0.25) colorClass = 'bg-primary/35';

                return (
                  <div
                    key={idx}
                    title={`Intensidad: ${(val * 100).toFixed(0)}%`}
                    className={`aspect-square ${colorClass} rounded-md hover:scale-105 transition-all cursor-pointer`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/40 flex justify-between text-[11px] text-outline font-label">
            <span>Zona de baja latencia</span>
            <span className="text-primary font-bold">● Pico de productividad máximo detectado</span>
          </div>
        </div>

        {/* Vertical Stack Right */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Tendencias Graph Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col flex-1 justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4.5 text-secondary" />
                <h3 className="font-label text-xs uppercase font-bold text-on-surface tracking-wider">
                  Tendencias
                </h3>
              </div>
              <span className="bg-error-container/40 border border-error/40 px-2 py-0.5 rounded text-[10px] text-error font-semibold flex items-center gap-1">
                <AlertTriangle className="size-3" /> Anomalía
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative h-28 w-full my-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#c0c1ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 80 Q 20 65 40 45 T 65 35 T 85 55 T 100 20 L 100 100 L 0 100 Z" fill="url(#grad-indigo)" />
                <path d="M 0 80 Q 20 65 40 45 T 65 35 T 85 55 T 100 20" fill="none" stroke="#c0c1ff" strokeWidth="2.5" />
                <circle cx="65" cy="35" r="4.5" fill="#ffb4ab" className="animate-ping" />
                <circle cx="65" cy="35" r="3" fill="#ffb4ab" />
              </svg>
            </div>

            <div className="pt-3 border-t border-outline-variant/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-on-surface-variant font-medium">Media Móvil (7d)</span>
                <span className="font-label text-lg font-bold text-primary">7.8</span>
              </div>
              <p className="text-[10px] text-outline italic">Rendimiento +8% sistemático los martes</p>
            </div>
          </div>

          {/* Distribución Semanal Bars Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <p className="font-label text-[11px] uppercase font-bold text-outline tracking-wider mb-4">
              Distribución Semanal
            </p>
            <div className="flex items-end justify-between h-20 gap-2 px-1">
              {[40, 65, 85, 55, 95, 30, 15].map((h, i) => (
                <div key={i} className="w-full bg-primary/15 rounded-t-md h-full flex items-end relative group">
                  <div
                    style={{ height: `${h}%` }}
                    className={`w-full rounded-t-md transition-all ${
                      h > 80 ? 'bg-primary shadow-[0_0_8px_#4fdbc8]' : 'bg-primary/70'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Insights Recomendados */}
      <div className="pt-2">
        <div className="flex items-center gap-2.5 mb-4">
          <Lightbulb className="size-5 text-tertiary" />
          <h3 className="font-label text-xs uppercase tracking-widest text-on-surface font-bold">
            Insights Recomendados
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INSIGHTS_LIST.map((ins, i) => {
            const iconsMap: Record<string, React.ReactNode> = {
              Timer: <Timer className="size-5 text-primary" />,
              Moon: <Moon className="size-5 text-secondary" />,
              Wand2: <Wand2 className="size-5 text-tertiary" />,
            };
            return (
              <div
                key={ins.id}
                className={`glass-card p-5 rounded-2xl border-l-4 flex items-start gap-4 hover:translate-y-[-2px] transition-all ${ins.colorClass}`}
              >
                <div className="p-2.5 rounded-xl bg-surface-container-high shrink-0 shadow-sm">
                  {iconsMap[ins.icon] || <Zap className="size-5 text-primary" />}
                </div>
                <div>
                  <span className="text-[10px] font-label font-bold text-outline uppercase tracking-wider block mb-1">
                    {ins.category}
                  </span>
                  <h5 className="font-headline text-base font-bold text-on-surface mb-1">{ins.title}</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{ins.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
