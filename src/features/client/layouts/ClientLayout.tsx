import { Link, Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/shared/layouts/AppSidebar';
import { Drawer } from '@/components/ui/drawer';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import DrawerApp from '@/shared/components/DrawerApp';

const navItems = [
  { to: '/client/dashboard', label: 'Inicio' },
  { to: '/client/cash-loans', label: 'Préstamos Monetarios' },
  { to: '/client/equipment-loans', label: 'Préstamos de Equipo' },
  { to: '/client/equipment-financing', label: 'Financiamiento de Equipo' },
  { to: '/client/requests', label: 'Mis Solicitudes' },
  { to: '/client/help', label: 'Ayuda' },
];

export default function ClientLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar solo visible en desktop */}
      <aside className="hidden md:block w-64">
        <AppSidebar title="Panel Cliente" navItems={navItems} />
      </aside>

      {/* Mobile Header con botón de menú */}
      <div className="flex-1 flex flex-col w-full">
        <header className="flex items-center justify-between p-4 border-b bg-background text-white text-primary-foreground md:hidden">
          <button onClick={() => setDrawerOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold">Panel Cliente</span>
        </header>
        <Separator className="md:hidden" />

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Drawer personalizado para mobile */}
      <DrawerApp open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <AppSidebar
          title="Panel Cliente"
          navItems={navItems}
          onNavigate={() => setDrawerOpen(false)} 
        />
      </DrawerApp>
    </div>
  );
}
