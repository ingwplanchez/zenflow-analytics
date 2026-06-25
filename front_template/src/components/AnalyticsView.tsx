import React, { useState } from 'react';
import { COGNITIVE_TASK_TYPES } from '../data';
import { 
  Calendar, 
  Zap, 
  FolderOpen, 
  GitBranch, 
  Download, 
  FilterX, 
  CheckCircle2, 
  X, 
  Code, 
  Users, 
  Mail, 
  Compass, 
  BarChart2,
  SlidersHorizontal
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState('24H');
  const [threshold, setThreshold] = useState(85);
  const [activeProjects, setActiveProjects] = useState(['Neural Nexus AI', 'Core Engine Optimization', 'Market Analytics v2']);
  const [taskTypes, setTaskTypes] = useState(COGNITIVE_TASK_TYPES);
  const [filterChips, setFilterChips] = useState([
    { id: 'period', label: 'Periodo:', val: '24H' },
    { id: 'intensity', label: 'Intensidad:', val: '>85%' },
    { id: 'projects', label: 'Proyectos:', val: '3 Selecc.' },
    { id: 'tasks', label: 'Tarea:', val: 'Estrategia +2' },
  ]);

  const projectsCluster = [
    { name: 'Neural Nexus AI', tag: 'Activo', tagClass: 'bg-tertiary/15 text-tertiary border-tertiary/30' },
    { name: 'Core Engine Optimization', tag: 'Sprint', tagClass: 'bg-secondary/15 text-secondary border-secondary/30' },
    { name: 'Legacy Migration', tag: 'Pausado', tagClass: 'bg-surface-container-highest text-on-surface-variant border-outline-variant' },
    { name: 'Market Analytics v2', tag: 'Activo', tagClass: 'bg-tertiary/15 text-tertiary border-tertiary/30' },
  ];

  const handleToggleProject = (projName: string) => {
    if (activeProjects.includes(projName)) {
      setActiveProjects(activeProjects.filter(p => p !== projName));
    } else {
      setActiveProjects([...activeProjects, projName]);
    }
  };

  const handleToggleTaskType = (idx: number) => {
    const updated = [...taskTypes];
    updated[idx].active = !updated[idx].active;
    setTaskTypes(updated);
  };

  const handleClearFilters = () => {
    setThreshold(50);
    setActiveProjects([]);
    setFilterChips([]);
    const cleared = taskTypes.map(t => ({ ...t, active: false }));
    setTaskTypes(cleared);
  };

  const removeChip = (id: string) => {
    setFilterChips(filterChips.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Header & Filter Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Filtros de Inteligencia</h1>
          <p className="text-sm text-on-surface-variant mt-1.5">
            Refine sus conjuntos de datos de productividad con precisión quirúrgica.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
            <Download className="size-4 mr-2 text-outline" />
            <span>Exportar Reporte</span>
          </button>
          <button 
            onClick={handleClearFilters}
            className="flex items-center px-4 py-2.5 bg-error-container text-on-error-container rounded-xl text-sm font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            <FilterX className="size-4 mr-2" />
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>

      {/* Rejilla Bento Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Ventana Temporal */}
        <section className="md:col-span-8 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <span className="text-xs font-label font-bold text-on-surface uppercase tracking-widest">
                Ventana Temporal
              </span>
            </div>
            <div className="flex gap-1.5 p-1 bg-surface-container-highest/50 rounded-lg">
              {['24H', '7D', '30D', 'TRIMESTRE'].map((tw) => (
                <button
                  key={tw}
                  onClick={() => setTimeWindow(tw)}
                  className={`px-3 py-1 text-[11px] font-label font-bold rounded-md transition-all cursor-pointer ${
                    timeWindow === tw
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {tw}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-label font-bold text-outline uppercase ml-1 block">
                Fecha de Inicio
              </label>
              <input
                type="date"
                defaultValue="2023-10-24"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-sm text-on-surface focus:border-primary outline-none font-label"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-label font-bold text-outline uppercase ml-1 block">
                Fecha de Fin
              </label>
              <input
                type="date"
                defaultValue="2023-10-25"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-sm text-on-surface focus:border-primary outline-none font-label"
              />
            </div>
          </div>
        </section>

        {/* Umbral de Flow Slider */}
        <section className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="size-5 text-tertiary" />
              <span className="text-xs font-label font-bold text-on-surface uppercase tracking-widest">
                Umbral de Flow
              </span>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs font-label text-on-surface-variant font-medium">Intensidad Mínima</span>
                <span className="text-2xl text-tertiary font-label font-bold">{threshold}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-3 text-[10px] font-label text-outline uppercase font-semibold">
                <span>Foco Bajo</span>
                <span>Máximo Rendimiento</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cluster de Proyectos Multi-select */}
        <section className="md:col-span-5 glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="size-5 text-secondary" />
            <span className="text-xs font-label font-bold text-on-surface uppercase tracking-widest">
              Cluster de Proyectos
            </span>
          </div>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {projectsCluster.map((p) => {
              const isChecked = activeProjects.includes(p.name);
              return (
                <label
                  key={p.name}
                  onClick={() => handleToggleProject(p.name)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isChecked ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="size-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container-lowest border-outline-variant"
                    />
                    <span className="text-sm font-semibold text-on-surface truncate">{p.name}</span>
                  </div>
                  <span className={`text-[10px] font-label font-bold px-2.5 py-0.5 rounded-full border ml-2 ${p.tagClass}`}>
                    {p.tag}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Tipos de Tareas Cognitivas */}
        <section className="md:col-span-7 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="size-5 text-primary" />
              <span className="text-xs font-label font-bold text-on-surface uppercase tracking-widest">
                Tipos de Tareas Cognitivas
              </span>
            </div>
            <span className="text-[11px] font-label font-bold text-primary">
              {taskTypes.filter(t => t.active).length} SELECCIONADAS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {taskTypes.map((t, idx) => {
              const icons: Record<string, React.ReactNode> = {
                Trabajo: <Code className="size-4.5 text-primary" />,
                Colaboración: <Users className="size-4.5 text-secondary" />,
                Admin: <Mail className="size-4.5 text-outline" />,
                Estrategia: <Compass className="size-4.5 text-tertiary" />,
              };
              const iconKey = Object.keys(icons).find(k => t.name.includes(k)) || 'Trabajo';

              return (
                <button
                  key={t.name}
                  onClick={() => handleToggleTaskType(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer border text-left ${
                    t.active
                      ? 'bg-primary/10 border-primary shadow-sm text-on-surface font-bold'
                      : 'bg-surface-container-low border-outline-variant/40 hover:border-outline text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {icons[iconKey]}
                    <span className="text-sm truncate">{t.name}</span>
                  </div>
                  {t.active ? (
                    <CheckCircle2 className="size-5 text-primary shrink-0 ml-2" />
                  ) : (
                    <span className="size-5 border border-outline-variant rounded-full shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Contexto Activo & Aplicar */}
        <section className="md:col-span-12 glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3.5 flex-1">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4.5 text-primary" />
                <span className="text-xs font-label font-bold text-on-surface uppercase tracking-widest">
                  Contexto de Inteligencia Activo
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {filterChips.map(c => (
                  <span key={c.id} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-full border border-outline-variant/60 text-xs font-label transition-colors">
                    <span className="text-on-surface-variant font-medium">{c.label}</span>
                    <span className="text-on-surface font-bold">{c.val}</span>
                    <button onClick={() => removeChip(c.id)} className="ml-1 text-outline hover:text-error transition-colors">
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
                {filterChips.length === 0 && (
                  <span className="text-xs text-outline italic">No hay filtros específicos aplicados.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-outline-variant/30">
              <div className="text-center">
                <div className="text-2xl font-label font-bold text-primary">12.4k</div>
                <div className="text-[10px] font-label text-outline uppercase tracking-wider font-semibold">Nodos Coincidentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-label font-bold text-secondary">92.1%</div>
                <div className="text-[10px] font-label text-outline uppercase tracking-wider font-semibold">Nivel Confianza</div>
              </div>
              <button className="bg-primary hover:brightness-110 text-on-primary px-7 py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer text-sm">
                Aplicar Parámetros
              </button>
            </div>
          </div>
        </section>

        {/* Proyección Placeholder */}
        <section className="md:col-span-12 glass-card rounded-2xl h-48 flex flex-col items-center justify-center border-dashed border-outline-variant/70 relative">
          <BarChart2 className="size-10 text-outline mb-3 animate-pulse" />
          <div className="text-sm font-medium text-on-surface-variant text-center leading-relaxed">
            La vista previa de proyección quirúrgica del filtro está lista.<br />
            <span className="text-primary cursor-pointer hover:underline font-semibold">
              Reindexar grafo de telemetría en tiempo real
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
