import React, { useEffect, useState, useCallback } from 'react';
import ClientTable from '../components/ClientTable';
import ClientFormModal from '../components/ClientFormModal';
import { clientApi, ClientItem, CreateClientDto } from '../api/client_api';
import { Button } from '@/components/ui/button';
import { confirmDialog } from '@/shared/utils/global-dialog';
import { showSuccess, showError } from '@/shared/utils/global-dialog-utils';
import { YellowButton } from '@/components/common/ColorButtons';

const ClientListPage = () => {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientApi.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      await showError('Error', 'No se pudieron cargar los clientes');
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      const confirmed = await confirmDialog({
        title: 'Confirmar acción',
        message: '¿Estás seguro de cambiar el estado de este cliente?',
        type: 'info'
      });

      if (confirmed) {
        await clientApi.toggleStatus(id);
        await loadClients();
        await showSuccess('Éxito', 'Estado del cliente actualizado correctamente');
      }
    } catch (error) {
      await showError('Error', 'No se pudo cambiar el estado del cliente');
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleCreate = async (data: CreateClientDto) => {
    try {
      await clientApi.createClient(data);
      setShowModal(false);
      await loadClients();
      await showSuccess('Éxito', 'Cliente creado correctamente');
    } catch (error) {
      await showError('Error', 'No se pudo crear el cliente');
      console.error('Error al crear cliente:', error);
    }
  };

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Gestión de Clientes
        </h1>
        <YellowButton 
          onClick={() => setShowModal(true)} 
          className="w-full sm:w-auto"
        >
          Crear Cliente
        </YellowButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay clientes registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <ClientTable 
              clients={clients} 
              onToggle={handleToggleStatus}
            />
          </div>
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
