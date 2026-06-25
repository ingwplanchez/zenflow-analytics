export type NavTab = 'dashboard' | 'analytics' | 'projects' | 'tasks' | 'reports' | 'auth';

export type AuthMode = 'login' | 'register';

export interface TaskItem {
  id: string;
  sourceIcon: string;
  sourceColor: string;
  code: string;
  title: string;
  category: string;
  priority: 'CRÍTICO' | 'MEDIO' | 'BAJO' | 'ALTO';
  difficulty: number; // out of 5
  estHours: number;
  realHours: number;
  velocity: string;
  context: string;
  status: 'En Progreso' | 'Completado' | 'Pendiente';
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'En Riesgo' | 'Al día' | 'Descubrimiento' | 'Pausado';
  throughput: string;
  velocityPercent: number;
  complexity: 'Alta' | 'Media' | 'Ultra' | 'Baja';
  teamAvatars: string[];
  teamExtraCount: number;
}

export interface InsightItem {
  id: string;
  icon: string;
  colorClass: string;
  title: string;
  description: string;
  category: string;
}

export interface ReportConfig {
  format: 'PDF' | 'CSV' | 'JSON';
  dateRange: '7days' | '30days' | 'custom';
  metrics: {
    rendimiento: boolean;
    velocidad: boolean;
    riesgo: boolean;
    consistencia: boolean;
    enfoque: boolean;
  };
  automation: boolean;
  frequency: string;
  recipients: string;
}
