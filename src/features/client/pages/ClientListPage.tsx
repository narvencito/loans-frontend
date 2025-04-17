import React, { useEffect, useState } from 'react';
import ClientTable from '../components/ClientTable';
import ClientFormModal from '../components/ClientFormModal';
import { clientApi, ClientItem, CreateClientDto } from '../api/client_api';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

const ClientListPage = () => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    const data = await clientApi.getClients();
    setClients(data);
    setLoading(false);
  };

  const askToggle = (id: string) => {
    setSelectedClientId(id);
    setConfirmOpen(true);
  };

  const confirmToggle = async () => {
    if (!selectedClientId) return;
    await clientApi.toggleStatus(selectedClientId);
    setConfirmOpen(false);
    setSelectedClientId(null);
    loadClients();
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
  
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => setShowModal(true)}
        >
          Crear Cliente
        </button>
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
  
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar acción"
        message="¿Estás seguro de cambiar el estado de este cliente?"
        onConfirm={confirmToggle}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default ClientListPage;
