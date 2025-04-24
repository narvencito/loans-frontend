import React, { useEffect, useState } from 'react';
import ClientTable from '../components/ClientTable';
import ClientFormModal from '../components/ClientFormModal';
import { clientApi, ClientItem, CreateClientDto } from '../api/client_api';
import { Button } from '@/components/ui/button';
import { confirmDialog } from '@/shared/utils/global-dialog';

const ClientListPage = () => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    const data = await clientApi.getClients();
    setClients(data);
    setLoading(false);
  };

  const askToggle = async (id: string) => {
    const confirmed = await confirmDialog({
      title: 'Confirmar acción',
      message: '¿Estás seguro de cambiar el estado de este cliente?',
    });

    if (confirmed) {
      await clientApi.toggleStatus(id);
      loadClients();
    }
  };

  const handleCreate = async (data: CreateClientDto) => {
    await clientApi.createClient(data);
    setShowModal(false);
    loadClients();
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Clientes</h1>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          Crear Cliente
        </Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <ClientTable clients={clients} onToggle={askToggle} />
        </div>
      )}

      <ClientFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default ClientListPage;
