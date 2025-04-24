import React, { useEffect, useState } from 'react';
import { CreateEquipmentDto, equipmentApi, EquipmentItem } from '../api/equipment_api';
import EquipmentTable from '../components/EquipmentTable';
import EquipmentFormModal from '../components/EquipmentFormModal';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

const EquipmentListPage = () => {
  const [equipos, setEquipos] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);

  const loadEquipos = async () => {
    setLoading(true);
    const data = await equipmentApi.getAll();
    setEquipos(data);
    setLoading(false);
  };

  const handleSubmit = async (data: CreateEquipmentDto) => {
    if (selectedEquipment) {
      await equipmentApi.update(selectedEquipment.id, {
        ...data,
        id: selectedEquipment.id,
      });
    } else {
      await equipmentApi.create(data);
    }
    setShowModal(false);
    setSelectedEquipment(null);
    loadEquipos();
  };

  const handleEdit = (item: EquipmentItem) => {
    setSelectedEquipment(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm(
      '¿Estás seguro de eliminar el equipo?'
    );

    if (!isConfirmed) return;

    await equipmentApi.delete(id);
    loadEquipos();
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Equipos</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setShowModal(true)}
        >
          Registrar equipo
        </Button>
      </div>

      {loading ? (
        <p>Cargando equipos...</p>
      ) : (
        <div className="overflow-x-auto">
          <EquipmentTable equipos={equipos} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      )}

      <EquipmentFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEquipment(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={selectedEquipment}
      />
    </div>
  );
};

export default EquipmentListPage;
