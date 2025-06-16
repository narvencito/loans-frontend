import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import RedirectIfAuthenticated from '@/router/RedirectIfAuthenticated';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <RedirectIfAuthenticated>
          <Outlet />
        </RedirectIfAuthenticated>
      </main>
    </div>
  );
}