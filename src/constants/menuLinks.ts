import { Role, RoleEnum } from "@/features/auth/types/auth.types";

interface MenuLink {
  label: string;
  path: string;
  roles?: RoleEnum[];
  group?: string;
}

export const menuLinks: MenuLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Equipos', path: '/equipment' },
  //{ label: 'Préstamos', path: '/loans' },
  //{ label: 'Financiamiento', path: '/financing' },
];

export const adminMenuLinks: MenuLink[] = [
  // Dashboard
  { 
    label: 'Dashboard', 
    path: '/admin/dashboard',
    roles: [RoleEnum.ADMIN],
    group: 'Principal'
  },

  // Solicitudes y Préstamos
  { 
    label: 'Solicitudes', 
    path: '/admin/requests',
    roles: [RoleEnum.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Préstamos de Equipos', 
    path: '/admin/equipment-loans',
    roles: [RoleEnum.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Préstamos en Efectivo', 
    path: '/admin/cash-loans',
    roles: [RoleEnum.ADMIN],
    group: 'Solicitudes y Préstamos'
  },
  { 
    label: 'Financiamiento de Equipos', 
    path: '/admin/equipment-financing',
    roles: [RoleEnum.ADMIN],
    group: 'Solicitudes y Préstamos'
  },

  // Gestión de Equipos
  { 
    label: 'Equipos', 
    path: '/admin/equipment',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Marcas', 
    path: '/admin/brands',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Perfiles de Uso', 
    path: '/admin/general-categories',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Categorías', 
    path: '/admin/equipment-categories',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Estados de Equipos', 
    path: '/admin/equipment-status',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },
  { 
    label: 'Características', 
    path: '/admin/equipment-features',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Equipos'
  },

  // Gestión de Usuarios
  { 
    label: 'Clientes', 
    path: '/admin/clients',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Usuarios'
  },
  { 
    label: 'Usuarios', 
    path: '/admin/users',
    roles: [RoleEnum.ADMIN],
    group: 'Gestión de Usuarios'
  },
];
