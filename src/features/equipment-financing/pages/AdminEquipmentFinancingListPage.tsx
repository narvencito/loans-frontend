import React, { useEffect, useState } from 'react';
import { equipmentFinancingApi, EquipmentFinancingItem } from '../api/equipment-financing-api';
import EquipmentFinancingTable from '../components/EquipmentFinancingTable';
import EquipmentFinancingScheduleModal from '../components/EquipmentFinancingScheduleModal';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';

const AdminEquipmentFinancingListPage = () => {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [financingSelected, setFinancingSelected] = useState<EquipmentFinancingItem | null>(null);

  // Filtros visuales
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const searchFinancings = async () => {
    setLoading(true);
    try {
      const data = await equipmentFinancingApi.getAll({
        clientId: clientFilter ?? undefined,
        statusId: statusFilter ?? undefined,
      });
      setFinancings(data);
    } catch (error) {
      console.error("Error al cargar financiamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm('¿Estás seguro de eliminar este financiamiento?');
    if (!isConfirmed) return;
    try {
      await equipmentFinancingApi.delete(id);
      searchFinancings();
    } catch (error) {
      console.error("Error al eliminar financiamiento:", error);
    }
  };

  const handleViewSchedule = (id: string) => {
    const financing = financings.find((f) => f.id === id);
    if (financing) setFinancingSelected(financing);
  };

  useEffect(() => {
    searchFinancings();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Gestión de Financiamientos de Equipos</h1>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mb-6">
        {/* Filtros a la izquierda */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="w-full sm:w-64">
            <AsyncClientCombobox
              selectedClientId={clientFilter}
              onSelect={(id: string | null) => setClientFilter(id)}
              label="Filtrar por cliente"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobado</option>
              <option value="REJECTED">Rechazado</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={searchFinancings}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Buscar
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <EquipmentFinancingTable
            financings={financings}
            onDelete={handleDelete}
            onViewSchedule={handleViewSchedule}
          />
        </div>
      )}

      <EquipmentFinancingScheduleModal
        open={!!financingSelected}
        onClose={() => setFinancingSelected(null)}
        financing={financingSelected}
      />
    </div>
  );
};

export default AdminEquipmentFinancingListPage; 