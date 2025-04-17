import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-4">
      <h2 className="font-bold text-xl mb-4 text-white">Admin</h2>
      <ul className="space-y-2">
        <li>
          <Link
            to="/admin/dashboard"
            className="block text-white hover:text-green-400"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className="block text-white hover:text-green-400"
          >
            Usuarios
          </Link>
        </li>
        <li>
          <Link
            to="/admin/clients"
            className="block text-white hover:text-green-400"
          >
            Clientes
          </Link>
        </li>

        <li>
          <Link
            to="/admin/cash-loans"
            className="block text-white hover:text-green-400"
          >
            Préstamo en efectivo
          </Link>
        </li>

        <li>
          <Link
            to="/admin/equipment"
            className="block text-white hover:text-green-400"
          >
            Gestión de equipos
          </Link>
        </li>

        <li>
          <Link
            to="/admin/equipment-status"
            className="block text-white hover:text-green-400"
          >
            Estado de equipos
          </Link>
        </li>

        <li>
          <Link
            to="/admin/equipment-category"
            className="block text-white hover:text-green-400"
          >
            Categoria de equipos
          </Link>
        </li>

      </ul>
    </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 text-white p-4 text-lg font-bold">
          Panel de Administración
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
