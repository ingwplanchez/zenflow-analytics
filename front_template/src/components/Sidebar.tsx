import React from 'react';
import { NavTab } from '../types';
import { 
  LayoutDashboard, 
  BarChart3, 
  FolderOpen, 
  CheckSquare, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Activity,
  GitCommit,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  compactVariant?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as NavTab, label: 'Analíticas', icon: BarChart3 },
    { id: 'projects' as NavTab, label: 'Proyectos', icon: FolderOpen },
    { id: 'tasks' as NavTab, label: 'Tareas', icon: CheckSquare },
    { id: 'reports' as NavTab, label: 'Reportes', icon: FileText },
  ];

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 px-4 gap-4 z-30 transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-4 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
        <div className="size-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary-container/20 overflow-hidden">
          <Activity className="size-6 text-on-primary animate-pulse" />
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold text-primary tracking-tight">ZenFlow</h1>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70 font-semibold">
            Intelligence
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 active:scale-[0.98] w-full text-left cursor-pointer ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10 shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'text-primary' : 'text-outline'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Connected Sources (shown in Tasks/Projects variants) */}
      <div className="mt-4 px-3 py-3 rounded-xl bg-surface-container/50 border border-outline-variant/40">
        <p className="text-[10px] uppercase font-label font-bold text-outline tracking-widest mb-2.5">
          Fuentes Conectadas
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface">
            <span className="flex items-center gap-2 text-on-surface-variant font-medium">
              <GitCommit className="size-3.5 text-primary" /> Git Hub
            </span>
            <span className="size-2 rounded-full bg-tertiary shadow-[0_0_8px_#4edea3]"></span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface">
            <span className="flex items-center gap-2 text-on-surface-variant font-medium">
              <Zap className="size-3.5 text-secondary" /> Jira Cloud
            </span>
            <span className="size-2 rounded-full bg-tertiary shadow-[0_0_8px_#4edea3]"></span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface">
            <span className="flex items-center gap-2 text-on-surface-variant font-medium">
              <CheckCircle2 className="size-3.5 text-outline" /> Todoist
            </span>
            <span className="size-2 rounded-full bg-error shadow-[0_0_8px_#ffb4ab]"></span>
          </div>
        </div>
      </div>

      {/* Footer System Links & Profile */}
      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 text-sm">
          <Settings className="size-4.5 text-outline" />
          <span>Configuración</span>
        </button>
        <button 
          onClick={() => onSelectTab('auth')}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-error font-medium hover:bg-error/10 transition-colors duration-200 text-sm"
        >
          <LogOut className="size-4.5 text-error" />
          <span>Pantalla de Acceso</span>
        </button>

        {/* User Card */}
        <div className="mt-3 flex items-center gap-3 px-3 py-3 bg-surface-container rounded-xl border border-outline-variant/40 shadow-sm">
          <div className="size-9 rounded-full overflow-hidden bg-primary/20 border border-primary shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="Alex Rivera" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold truncate text-on-surface leading-tight">Alex Rivera</p>
            <p className="text-[10px] text-primary truncate font-label">Plan Pro Activo</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
