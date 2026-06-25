/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NavTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { ReportsView } from './components/ReportsView';

export default function App() {
  // Start on the Auth/Login view as requested, or switch directly to dashboard
  const [currentTab, setCurrentTab] = useState<NavTab>('auth');

  const getHeaderTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Ejecutivo';
      case 'analytics': return 'Filtros de Inteligencia';
      case 'projects': return 'Gestión de Proyectos';
      case 'tasks': return 'Registro Detallado de Tareas';
      case 'reports': return 'Exportación de Reportes';
      default: return 'ZenFlow Analytics';
    }
  };

  if (currentTab === 'auth') {
    return <AuthView onLoginSuccess={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="dark bg-background text-on-background min-h-screen flex selection:bg-primary selection:text-on-primary font-body overflow-x-hidden">
      {/* Persistent Navigation Shell */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
      
      <Header title={getHeaderTitle(currentTab)} />

      {/* Main Content Area */}
      <main className="ml-[260px] pt-24 px-8 pb-16 flex-1 min-h-screen max-w-7xl mx-auto transition-all">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'projects' && <ProjectsView />}
        {currentTab === 'tasks' && <TasksView />}
        {currentTab === 'reports' && <ReportsView />}
      </main>
    </div>
  );
}

