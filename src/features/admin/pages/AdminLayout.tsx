import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-700 text-white p-4 text-lg font-bold">
        Panel de Administración
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
