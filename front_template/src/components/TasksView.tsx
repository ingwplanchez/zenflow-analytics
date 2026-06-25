import React, { useState } from 'react';
import { INITIAL_TASKS } from '../data';
import { 
  Plus, 
  GitCommit, 
  Zap, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FilterX,
  SlidersHorizontal
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const [tasksList] = useState(INITIAL_TASKS);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTasks = tasksList.filter(t => {
    if (selectedFilter === 'crit') return t.priority === 'CRÍTICO';
    if (selectedFilter === 'prog') return t.status === 'En Progreso';
    return true;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRÍTICO': return 'bg-error-container text-on-error-container';
      case 'MEDIO': return 'bg-secondary-container text-on-secondary-container';
      case 'ALTO': return 'bg-primary-container/40 text-primary border border-primary/40';
      default: return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none flex flex-col min-h-[calc(100vh-120px)]">
      {/* Title & Filters Bar */}
      <section className="border-b border-outline-variant/60 pb-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-on-surface font-headline tracking-tight">Registro Detallado de Tareas</h1>
          <button className="bg-primary hover:brightness-110 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer">
            <Plus className="size-4.5" /> Nueva Tarea
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`flex h-10 items-center justify-center gap-x-2 rounded-xl px-4 text-xs font-semibold border transition-all cursor-pointer ${
              selectedFilter === 'all' ? 'bg-primary/15 border-primary text-primary' : 'bg-surface-container-high border-outline-variant text-on-surface'
            }`}
          >
            <span>Fuente: Todas</span>
          </button>
          <button 
            onClick={() => setSelectedFilter('crit')}
            className={`flex h-10 items-center justify-center gap-x-2 rounded-xl px-4 text-xs font-semibold border transition-all cursor-pointer ${
              selectedFilter === 'crit' ? 'bg-error/15 border-error text-error' : 'bg-surface-container-high border-outline-variant text-on-surface'
            }`}
          >
            <span>Prioridad: Crítica</span>
          </button>
          <button 
            onClick={() => setSelectedFilter('prog')}
            className={`flex h-10 items-center justify-center gap-x-2 rounded-xl px-4 text-xs font-semibold border transition-all cursor-pointer ${
              selectedFilter === 'prog' ? 'bg-tertiary/15 border-tertiary text-tertiary' : 'bg-surface-container-high border-outline-variant text-on-surface'
            }`}
          >
            <span>Estado: En Progreso</span>
          </button>
          <button 
            onClick={() => setSelectedFilter('all')}
            className="flex h-10 items-center px-4 text-primary text-xs font-bold gap-1.5 hover:underline cursor-pointer ml-auto"
          >
            <FilterX className="size-4" /> Restablecer filtros
          </button>
        </div>
      </section>

      {/* Metrics Overview Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-label font-bold uppercase tracking-wider">Rendimiento Promedio</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1 font-label">4.2 <span className="text-xs font-normal text-outline">tareas/día</span></h3>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-primary rounded-full shadow-[0_0_8px_#4fdbc8]" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-label font-bold uppercase tracking-wider">Precisión de Estimación</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1 font-label">88% <span className="text-xs font-normal text-tertiary">↑ 2%</span></h3>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-tertiary rounded-full shadow-[0_0_8px_#4edea3]" style={{ width: '88%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-label font-bold uppercase tracking-wider">Consistencia de Flujo</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1 font-label">0.92 <span className="text-xs font-normal text-outline">estabilidad</span></h3>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-label font-bold uppercase tracking-wider">Cuellos Botella Activos</p>
            <h3 className="text-2xl font-bold text-error mt-1 font-label">3 <span className="text-xs font-normal text-outline">bloqueos</span></h3>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-error rounded-full shadow-[0_0_8px_#ffb4ab]" style={{ width: '30%' }}></div>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse font-body">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high text-[11px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="p-4 pl-6">Fuente</th>
                <th className="p-4">Título de Tarea</th>
                <th className="p-4 text-center">Prioridad</th>
                <th className="p-4">Dificultad</th>
                <th className="p-4">Est vs Real</th>
                <th className="p-4">Métricas Flujo</th>
                <th className="p-4 pr-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 text-sm">
              {filteredTasks.map((t) => {
                const isOverEst = t.realHours > t.estHours;
                return (
                  <tr key={t.id} className="hover:bg-surface-container-highest/40 transition-colors">
                    <td className="p-4 pl-6 whitespace-nowrap font-label">
                      <div className="flex items-center gap-2.5">
                        {t.id.includes('ZEN') ? (
                          <GitCommit className="size-4 text-primary" />
                        ) : t.id.includes('JRA') ? (
                          <Zap className="size-4 text-secondary" />
                        ) : (
                          <CheckCircle2 className="size-4 text-outline" />
                        )}
                        <span className="text-xs font-semibold text-on-surface-variant">{t.code}</span>
                      </div>
                    </td>
                    <td className="p-4 min-w-[220px]">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{t.title}</span>
                        <span className="text-xs text-outline mt-0.5">{t.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-label font-bold tracking-wider uppercase ${getPriorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`size-2 rounded-full ${
                              i < t.difficulty
                                ? t.priority === 'CRÍTICO' ? 'bg-error shadow-[0_0_6px_#ffb4ab]' : 'bg-primary shadow-[0_0_6px_#4fdbc8]'
                                : 'bg-outline-variant/60'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 w-28">
                        <div className="flex justify-between text-[11px] text-outline font-label font-medium">
                          <span>{t.estHours}h</span>
                          <span className={isOverEst ? 'text-error font-bold' : 'text-tertiary font-bold'}>{t.realHours}h</span>
                        </div>
                        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, (t.realHours / (t.estHours || 1)) * 100)}%` }}
                            className={`h-full rounded-full ${isOverEst ? 'bg-error' : 'bg-tertiary'}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-label">
                      <div className="flex items-center gap-5">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-outline">Velocidad</span>
                          <span className="text-xs font-bold text-on-surface">{t.velocity}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-outline">Contexto</span>
                          <span className="text-xs font-bold text-on-surface">{t.context}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 pr-6 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-xs font-bold">
                        <span className={`size-2 rounded-full ${
                          t.status === 'En Progreso' ? 'bg-tertiary animate-pulse shadow-[0_0_8px_#4edea3]' : t.status === 'Completado' ? 'bg-outline' : 'bg-secondary'
                        }`} />
                        <span className={t.status === 'En Progreso' ? 'text-tertiary' : 'text-on-surface-variant'}>
                          {t.status}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 px-6 border-t border-outline-variant/40 flex items-center justify-between bg-surface-container-low/60 font-label text-xs">
          <span className="text-on-surface-variant font-medium">Mostrando 1-{filteredTasks.length} de 42 tareas registradas</span>
          <div className="flex gap-2">
            <button disabled className="size-8 rounded-lg border border-outline-variant flex items-center justify-center opacity-40 cursor-not-allowed">
              <ChevronLeft className="size-4" />
            </button>
            <button className="size-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-high text-on-surface cursor-pointer">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Detail Pane Bottom */}
      <footer className="p-6 rounded-2xl border border-outline-variant bg-surface-container mt-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold font-label text-outline uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-primary" /> Análisis de Enfoque Profundo
              </h4>
              <span className="text-[10px] font-label text-primary font-bold flex items-center gap-1.5">
                Zona de Trabajo Profundo <span className="size-2 rounded-full bg-primary animate-ping"></span>
              </span>
            </div>
            <div className="h-36 w-full rounded-xl bg-surface-container-low border border-outline-variant/60 relative overflow-hidden flex items-end px-4 pb-2 gap-2">
              {[35, 55, 40, 75, 95, 60, 45, 25].map((val, idx) => (
                <div key={idx} className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-md relative group" style={{ height: `${val}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface px-2 py-0.5 rounded text-[10px] font-label text-primary font-bold shadow">
                    {val}m
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-72 shrink-0">
            <h4 className="text-xs font-bold font-label text-outline uppercase tracking-widest mb-4">Tendencia Semanal</h4>
            <div className="space-y-3 font-body">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-medium">Lunes</span>
                <span className="text-on-surface font-label font-bold">12 tareas</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-medium">Martes</span>
                <span className="text-on-surface font-label font-bold">8 tareas</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-medium">Miércoles</span>
                <span className="text-tertiary font-bold font-label">15 tareas</span>
              </div>
              <div className="pt-3 border-t border-outline-variant/40">
                <p className="text-xs text-outline leading-tight italic">
                  🚀 Tu productividad quirúrgica ha subido un 12% esta semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
