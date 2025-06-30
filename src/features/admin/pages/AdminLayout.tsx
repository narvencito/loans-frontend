import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/shared/layouts/AppSidebar';
import { adminMenuLinks } from '@/constants/menuLinks';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AppSidebar 
        title="Panel Admin" 
        navItems={adminMenuLinks.map(item => ({ 
          to: item.path, 
          label: item.label,
          group: item.group 
        }))} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="p-4 text-lg font-bold border-b border-border bg-background text-white text-primary-foreground flex-shrink-0">
          Panel de Administración
        </header>
        <Separator className="flex-shrink-0" />
        <main className="flex-1 overflow-auto ">
          <div className="container mx-auto p-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
