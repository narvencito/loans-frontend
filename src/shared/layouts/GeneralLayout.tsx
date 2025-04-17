// src/shared/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';

export default function GeneralLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Aquí puedes agregar un Sidebar si deseas */}
      <aside className="w-64 bg-gray-900 text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">general layotu</h2>
        {/* enlaces del panel */}
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
