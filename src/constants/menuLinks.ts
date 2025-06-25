import { Role } from "@/features/auth/types/auth.types";

interface MenuLink {
  label: string;
  path: string;
  roles?: Role[];
  group?: string;
}

export const menuLinks: MenuLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Equipos', path: '/equipment' },
  { label: 'Préstamos', path: '/loans' },
  { label: 'Financiamiento', path: '/financing' },
];

export const adminMenuLinks: MenuLink[] = [
  // Dashboard
  { 
    label: 'Dashboard', 
    path: '/admin/dashboard',
    roles: [Role.ADMIN],
    group: 'Principal'
  },

  // Solicitudes y Préstamos
  { 
    label: 'Solicitudes', 
    path: '/admin/requests',
    roles: [Role.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Préstamos de Equipos', 
    path: '/admin/equipment-loans',
    roles: [Role.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Préstamos en Efectivo', 
    path: '/admin/cash-loans',
    roles: [Role.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Financiamiento de Equipos', 
    path: '/admin/equipment-financing',
    roles: [Role.ADMIN],
    group: 'Solicitudes y Préstamos'
  },

  // Gestión de Equipos
  { 
    label: 'Equipos', 
    path: '/admin/equipment',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Marcas', 
    path: '/admin/brands',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Perfiles de Uso', 
    path: '/admin/general-categories',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Categorías', 
    path: '/admin/equipment-categories',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Estados de Equipos', 
    path: '/admin/equipment-status',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Características', 
    path: '/admin/equipment-feature',
    roles: [Role.ADMIN],
    group: 'Gestión de Equipos'
  },

  // Gestión de Usuarios
  { 
    label: 'Clientes', 
    path: '/admin/clients',
    roles: [Role.ADMIN],
    group: 'Gestión de Usuarios'
  },
  { 
    label: 'Usuarios', 
    path: '/admin/users',
    roles: [Role.ADMIN],
    group: 'Gestión de Usuarios'
  },
];
