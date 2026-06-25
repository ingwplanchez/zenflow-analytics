import React, { useState } from 'react';
import { INITIAL_PROJECTS } from '../data';
import { 
  Plus, 
  BarChart3, 
  Gauge, 
  AlertTriangle, 
  Filter, 
  Calendar, 
  Layers, 
  LayoutGrid, 
  List, 
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused' | 'done'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [projectsList] = useState(INITIAL_PROJECTS);

  const filteredProjects = projectsList.filter((p) => {
    if (activeTab === 'active') return p.status === 'Al día' || p.status === 'En Riesgo';
    if (activeTab === 'paused') return p.status === 'Pausado';
    if (activeTab === 'done') return p.status === 'Descubrimiento';
    return true;
  });

  const getStatusClass = (st: string) => {
    switch (st) {
      case 'En Riesgo': return 'bg-error/15 text-error border-error/30';
      case 'Al día': return 'bg-primary/15 text-primary border-primary/30';
      case 'Descubrimiento': return 'bg-secondary/15 text-secondary border-secondary/30';
      default: return 'bg-surface-container-highest text-outline border-outline-variant';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-on-surface font-headline tracking-tight">Gestión de Proyectos</h1>
          <p className="text-on-surface-variant text-base max-w-2xl leading-relaxed">
            Analiza el rendimiento de ingeniería, identifica cuellos de botella y mantén la salud de los proyectos en toda la organización.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 shadow-lg shadow-primary/25 transition-all active:scale-95 cursor-pointer text-sm shrink-0">
          <Plus className="size-5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant hover:border-primary/40 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Rendimiento Total</span>
            <BarChart3 className="size-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-on-surface font-label">142 <span className="text-base font-normal text-outline">unidades</span></div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="text-tertiary font-bold font-label">+12%</span>
            <span className="text-outline">desde el último sprint</span>
          </div>
        </div>

        <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant hover:border-secondary/40 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Velocidad Promedio</span>
            <Gauge className="size-5 text-secondary" />
          </div>
          <div className="text-3xl font-bold text-on-surface font-label">85%</div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="text-error font-bold font-label">-2%</span>
            <span className="text-outline">bajo capacidad asignada</span>
          </div>
        </div>

        <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant hover:border-tertiary/40 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Nivel de Riesgo</span>
            <AlertTriangle className="size-5 text-error" />
          </div>
          <div className="text-3xl font-bold text-on-surface font-label">Bajo</div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="text-primary font-bold font-label">Estable</span>
            <span className="text-outline">3 alertas activas en sub-nodos</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-4">
        <div className="flex border-b border-outline-variant gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Todos los proyectos' },
            { id: 'active', label: 'Activos' },
            { id: 'paused', label: 'Pausados' },
            { id: 'done', label: 'Completados' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-4 pt-2 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-primary text-on-surface'
                  : 'border-transparent text-outline hover:text-on-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-5 bg-surface-container-low rounded-2xl border border-outline-variant">
          <div className="flex flex-wrap gap-2.5">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-high border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-variant transition-colors cursor-pointer">
              <Filter className="size-3.5 text-outline" />
              <span>Ordenar: Rendimiento</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-high border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-variant transition-colors cursor-pointer">
              <Calendar className="size-3.5 text-outline" />
              <span>Plazo: Más cercano</span>
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-high border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-variant transition-colors cursor-pointer">
              <Layers className="size-3.5 text-outline" />
              <span>Complejidad: Todas</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-label text-outline font-semibold">
              Mostrando {filteredProjects.length} de {projectsList.length}
            </span>
            <div className="flex p-1 bg-surface-container-highest rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                <LayoutGrid className="size-4.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                <List className="size-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Variant */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group bg-surface-container border border-outline-variant rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-36 w-full relative overflow-hidden bg-surface-container-low">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase backdrop-blur-md border shadow-sm ${getStatusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 -mt-8 relative z-10 space-y-4">
                  <div>
                    <h3 className="text-on-surface font-headline font-bold text-lg leading-tight">{p.name}</h3>
                    <p className="text-xs text-outline mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline font-label uppercase font-semibold text-[10px]">Rendimiento</span>
                      <span className="text-on-surface font-label font-bold">{p.throughput}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-outline font-label uppercase font-semibold text-[10px]">Velocidad</span>
                        <span className={`font-label font-bold ${p.velocityPercent < 70 ? 'text-error' : 'text-primary'}`}>
                          {p.velocityPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          style={{ width: `${p.velocityPercent}%` }}
                          className={`h-full rounded-full ${p.velocityPercent < 70 ? 'bg-error' : 'bg-primary'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/40 bg-surface-container-low/50 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {p.teamAvatars.map((av, idx) => (
                      <div key={idx} className="size-7 rounded-full border-2 border-surface-container bg-primary-container text-on-primary-container text-[10px] font-label font-bold flex items-center justify-center">
                        {av}
                      </div>
                    ))}
                    {p.teamExtraCount > 0 && (
                      <div className="size-7 rounded-full border-2 border-surface-container bg-surface-variant text-outline text-[10px] font-label font-bold flex items-center justify-center">
                        +{p.teamExtraCount}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-outline ml-3 font-medium">Complejidad: {p.complexity}</span>
                </div>

                <button className="size-9 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-all cursor-pointer">
                  <ChevronRight className="size-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table Variant */
        <div className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-[10px] font-label uppercase tracking-widest text-outline border-b border-outline-variant font-bold">
                  <th className="px-6 py-4">Nombre del Proyecto</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Rendimiento</th>
                  <th className="px-6 py-4">Velocidad</th>
                  <th className="px-6 py-4">Complejidad</th>
                  <th className="px-6 py-4">Equipo</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-sm font-body">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-variant/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img src={p.imageUrl} alt={p.name} className="size-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-on-surface">{p.name}</p>
                          <p className="text-xs text-outline truncate max-w-xs mt-0.5">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase border ${getStatusClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-label font-bold text-on-surface">{p.throughput}</td>
                    <td className="px-6 py-4 w-40">
                      <div className="space-y-1">
                        <div className="text-[11px] font-label font-bold text-primary">{p.velocityPercent}%</div>
                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div style={{ width: `${p.velocityPercent}%` }} className="bg-primary h-full rounded-full" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">{p.complexity}</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-1.5">
                        {p.teamAvatars.map((av, i) => (
                          <div key={i} className="size-6 rounded-full border border-surface bg-secondary-container text-on-secondary-container text-[9px] font-bold flex items-center justify-center">
                            {av}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-surface-container-highest rounded-lg text-outline hover:text-primary transition-colors cursor-pointer">
                        <ChevronRight className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Load Floating Bottom Banner */}
      <div className="sticky bottom-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-6 px-8 py-3.5 bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant rounded-full shadow-2xl z-20">
          <div className="flex items-center gap-3 pr-6 border-r border-outline-variant">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Zap className="size-4 animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface text-xs font-bold">Carga de Infraestructura</span>
              <span className="text-primary font-label text-[10px]">Óptima (12%)</span>
            </div>
          </div>
          <div className="flex gap-5 text-xs font-bold text-on-surface">
            <button className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
              <Activity className="size-4 text-secondary" /> Tendencias
            </button>
            <button className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
              <BarChart3 className="size-4 text-tertiary" /> Nodos Cloud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
