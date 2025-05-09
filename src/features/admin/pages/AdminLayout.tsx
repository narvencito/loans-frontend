import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/clients', label: 'Clientes' },
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
      <aside className="w-64 p-4 bg-background text-gray-200">
        <h2 className="font-bold text-xl mb-4">Panel Admin</h2>
        <ScrollArea className="h-full">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname == (item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block px-3 py-2 rounded text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-200 hover:bg-primary hover:text-black'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </aside>

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
