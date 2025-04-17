import React, { useEffect, useState } from 'react';
import { userApi, UserItem } from '../api/user_api';
import UserTable from '../components/UserTable';
import { clientApi } from '@/features/client/api/client_api';

const UserListPage = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await userApi.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggle = async (id: string) => {
    await userApi.toggleStatus(id);
    loadUsers(); // refrescar lista
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {loading ? <p>Cargando...</p> : <UserTable users={users} onToggle={handleToggle} />}
    </div>
  );
};

export default UserListPage;
