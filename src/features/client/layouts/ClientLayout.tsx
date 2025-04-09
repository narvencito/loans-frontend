import { Outlet } from 'react-router-dom';

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 text-lg font-bold">
        Área del Cliente
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
