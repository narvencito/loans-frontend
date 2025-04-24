import React, { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';
import EquipmentStatusTable from '../components/EquipmentStatusTable';
import EquipmentStatusFormModal from '../components/EquipmentStatusFormModal';
import { Button } from '@/components/ui/button';

const EquipmentStatusListPage = () => {
  const [statuses, setStatuses] = useState<EquipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EquipmentStatus | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadStatuses = async () => {
    setLoading(true);
    const data = await equipmentStatusApi.getAll();
    setStatuses(data);
    setLoading(false);
  };

  const handleCreate = () => {
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (status: EquipmentStatus) => {
    setSelected(status);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await equipmentStatusApi.delete(id);
    loadStatuses();
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Estados de Equipos</h1>
        <Button onClick={handleCreate}>
          Crear Estado
        </Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EquipmentStatusTable
          data={statuses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EquipmentStatusFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadStatuses}
        status={selected}
      />
    </div>
  );
};

export default EquipmentStatusListPage;
