import React from 'react';
import { UserItem } from '../api/user_api';

interface Props {
  users: UserItem[];
  onToggle: (id: string) => void;
}

const roleTranslations: Record<string, string> = {
  Admin: 'Administrador',
  Operator: 'Operador',
  Client: 'Cliente',
  Worker: 'Trabajador',
};

const  UserTable = ({ users, onToggle }: Props) => {
  return (
    <table className="w-full border rounded shadow text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Correo</th>
          <th className="p-2 text-left">Rol</th>
          <th className="p-2 text-center">Estado</th>
          <th className="p-2 text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => ( 
          <tr key={u.id} className="border-t">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{roleTranslations[u.role] || u.role}</td>
            <td className="p-2 text-center">
              <span className={u.isActive ? 'text-green-600' : 'text-red-600'}>
                {u.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td className="p-2 text-center">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => onToggle(u.id)}
              >
                {u.isActive ? 'Desactivar' : 'Activar'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
