import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/shared/layouts/AppSidebar';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/clients', label: 'Clientes' },
  { to: '/admin/requests', label: 'Solicitudes' },
  { to: '/admin/cash-loans', label: 'Préstamo en efectivo' },
  { to: '/admin/equipment', label: 'Gestión de equipos' },
  { to: '/admin/equipment-status', label: 'Estado de equipos' },
  { to: '/admin/equipment-category', label: 'Categoría de equipos' },
  { to: '/admin/equipment-feature', label: 'Caracteristica de equipos' },
  { to: '/admin/equipment-financing', label: 'Financiamiento de equipos' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AppSidebar title="Panel Admin" navItems={navItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 text-lg font-bold border-b border-border bg-background text-white text-primary-foreground">
          Panel de Administración
        </header>
        <Separator />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
