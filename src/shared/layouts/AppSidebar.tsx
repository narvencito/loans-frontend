import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Asegúrate de tener este componente
import { useAuthStore } from '@/features/auth/store/auth.store';
import { showConfirm } from '../utils/global-dialog-utils';

interface NavItem {
  to: string;
  label: string;
}

interface AppSidebarProps {
  title: string;
  navItems: NavItem[];
  onNavigate?: () => void;
}

export function AppSidebar({ title, navItems, onNavigate }: AppSidebarProps) {
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const isConfirmed = await showConfirm('¿Estás seguro de cerrar sesión');
    if (!isConfirmed) return;
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 p-4 bg-background text-gray-200 flex flex-col h-screen">
      <h2 className="font-bold text-xl mb-4">{title}</h2>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onNavigate}
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
      </div>

      {/* Logout Button */}
      <div className="mt-4 p-4">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
