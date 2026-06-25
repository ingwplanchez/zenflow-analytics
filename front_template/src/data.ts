import { InsightItem, ProjectItem, TaskItem } from './types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'ZEN-104',
    sourceIcon: 'git-commit',
    sourceColor: '#14b8a6',
    code: 'ZEN-104',
    title: 'Refactorizar middleware de API para rendimiento',
    category: 'Servicio Backend • Optimización',
    priority: 'CRÍTICO',
    difficulty: 3,
    estHours: 6,
    realHours: 4.5,
    velocity: '0.8x',
    context: 'Alto',
    status: 'En Progreso'
  },
  {
    id: 'JRA-229',
    sourceIcon: 'zap',
    sourceColor: '#3131c0',
    code: 'JRA-229',
    title: 'Implementar toggle de modo oscuro en panel',
    category: 'Componentes UI • Característica',
    priority: 'MEDIO',
    difficulty: 2,
    estHours: 2,
    realHours: 3.2,
    velocity: '0.4x',
    context: 'Cambio',
    status: 'Completado'
  },
  {
    id: 'TDO-091',
    sourceIcon: 'check-circle-2',
    sourceColor: '#859490',
    code: 'TDO-091',
    title: 'Actualizar documentación de equipo para v2.0',
    category: 'Documentación • Admin',
    priority: 'BAJO',
    difficulty: 1,
    estHours: 4,
    realHours: 0,
    velocity: '--',
    context: 'Inactivo',
    status: 'Pendiente'
  },
  {
    id: 'ZEN-110',
    sourceIcon: 'git-commit',
    sourceColor: '#14b8a6',
    code: 'ZEN-110',
    title: 'Corregir fuga de memoria en renderizador WebGL',
    category: 'Motor Gráfico • Bug Crítico',
    priority: 'CRÍTICO',
    difficulty: 5,
    estHours: 8,
    realHours: 7.8,
    velocity: '1.2x',
    context: 'Flujo',
    status: 'En Progreso'
  },
  {
    id: 'ZEN-118',
    sourceIcon: 'git-commit',
    sourceColor: '#14b8a6',
    code: 'ZEN-118',
    title: 'Sincronización en tiempo real con WebSockets',
    category: 'Infraestructura • Core',
    priority: 'ALTO',
    difficulty: 4,
    estHours: 5,
    realHours: 4.1,
    velocity: '1.1x',
    context: 'Flujo',
    status: 'Completado'
  },
  {
    id: 'JRA-305',
    sourceIcon: 'zap',
    sourceColor: '#3131c0',
    code: 'JRA-305',
    title: 'Diseñar paleta de colores de accesibilidad AA',
    category: 'Diseño • UI/UX',
    priority: 'MEDIO',
    difficulty: 2,
    estHours: 3,
    realHours: 2.5,
    velocity: '0.9x',
    context: 'Medio',
    status: 'Completado'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Aether Core Engine',
    description: 'Modernización de infraestructura APIs de baja latencia',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    status: 'En Riesgo',
    throughput: '42 u/s',
    velocityPercent: 64,
    complexity: 'Alta',
    teamAvatars: ['JD', 'ML'],
    teamExtraCount: 3
  },
  {
    id: 'proj-2',
    name: 'ZenFlow Mobile v3',
    description: 'Rediseño nativo multiplataforma con Flutter y Rust',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    status: 'Al día',
    throughput: '88 u/s',
    velocityPercent: 94,
    complexity: 'Media',
    teamAvatars: ['AS'],
    teamExtraCount: 8
  },
  {
    id: 'proj-3',
    name: 'Project Chronos',
    description: 'Motor de series temporales distribuidas de alta frecuencia',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
    status: 'Descubrimiento',
    throughput: '-- u/s',
    velocityPercent: 0,
    complexity: 'Ultra',
    teamAvatars: ['TK'],
    teamExtraCount: 0
  },
  {
    id: 'proj-4',
    name: 'Lumina Analytics UI',
    description: 'Visualización de próxima generación para sensores cuánticos',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    status: 'Al día',
    throughput: '112 u/s',
    velocityPercent: 98,
    complexity: 'Media',
    teamAvatars: ['RB', 'GW'],
    teamExtraCount: 2
  },
  {
    id: 'proj-5',
    name: 'Neural Nexus AI',
    description: 'Orquestación de agentes inteligentes Antigravity y Gemini',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80',
    status: 'Al día',
    throughput: '156 u/s',
    velocityPercent: 96,
    complexity: 'Alta',
    teamAvatars: ['AM', 'ER'],
    teamExtraCount: 5
  },
  {
    id: 'proj-6',
    name: 'Legacy Cloud Migration',
    description: 'Desacoplamiento de monolito hacia microservicios en Cloud Run',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    status: 'Pausado',
    throughput: '18 u/s',
    velocityPercent: 35,
    complexity: 'Media',
    teamAvatars: ['PT'],
    teamExtraCount: 1
  }
];

export const INSIGHTS_LIST: InsightItem[] = [
  {
    id: 'ins-1',
    icon: 'Timer',
    colorClass: 'text-primary border-l-primary bg-primary/10',
    title: 'Optimización de Bloques',
    description: 'Agrupa tus tareas de Desarrollo Profundo entre las 10 AM y las 12 PM.',
    category: 'Productividad'
  },
  {
    id: 'ins-2',
    icon: 'Moon',
    colorClass: 'text-secondary border-l-secondary bg-secondary/10',
    title: 'Fatiga Detectada',
    description: 'El rendimiento los viernes experimenta una caída sistemática después de las 4 PM.',
    category: 'Salud Cognitiva'
  },
  {
    id: 'ins-3',
    icon: 'Wand2',
    colorClass: 'text-tertiary border-l-tertiary bg-tertiary/10',
    title: 'Automatización Disponible',
    description: 'Existe un conector API listo para sincronizar tus reportes manuales de Jira.',
    category: 'Estrategia'
  }
];

export const COGNITIVE_TASK_TYPES = [
  { name: 'Trabajo Profundo', icon: 'Code', active: true },
  { name: 'Colaboración', icon: 'Users', active: true },
  { name: 'Admin. Reactiva', icon: 'Mail', active: false },
  { name: 'Estrategia', icon: 'Compass', active: true }
];
