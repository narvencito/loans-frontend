import { Link, Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/shared/layouts/AppSidebar';

const navItems = [
   { to: '/worker/dashboard', label: 'Dashboard' },
   { to: '/worker/clients', label: 'Clientes' },
   { to: '/worker/cash-loans', label: 'Préstamo en efectivo' },
   { to: '/worker/equipment', label: 'Gestión de equipos' },
   { to: '/worker/equipment-feature', label: 'Caracteristica de equipos' },
   { to: '/worker/equipment-financing', label: 'Financiamiento de equipos' },
];

export default function WorkerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AppSidebar title="Panel Trabajador" navItems={navItems} />

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
