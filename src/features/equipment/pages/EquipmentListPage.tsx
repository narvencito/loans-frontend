import React, { useEffect, useState } from 'react';
import { CreateEquipmentDto, equipmentApi, EquipmentItem, EquipmentFilters } from '../api/equipment_api';
import EquipmentTable from '../components/EquipmentTable';
import EquipmentFormModal from '../components/EquipmentFormModal';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import BrandSelect from '@/features/brand/components/BrandSelect';
import GeneralCategorySelect from '@/features/general-category/components/GeneralCategorySelect';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import RowApp from '@/shared/components/RowApp';
import ColumnApp from '@/shared/components/ColumnApp';
import { Input } from '@/components/ui/input';
import LabelApp from '@/shared/components/LabelApp';

const EquipmentListPage = () => {
  const [equipos, setEquipos] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [filters, setFilters] = useState<EquipmentFilters>({});

  const stableDefaultValues = React.useMemo(() => selectedEquipment, [selectedEquipment?.id]);

  const loadEquipos = async (params: EquipmentFilters = {}) => {
    setLoading(true);
    try {
      const searchFilters = {
        ...params,
        brandId: params.brandId === 'all' ? undefined : params.brandId,
        generalCategoryId: params.generalCategoryId === 'all' ? undefined : params.generalCategoryId,
        statusId: params.statusId === 'all' ? undefined : params.statusId
      };
      const data = await equipmentApi.getAll(searchFilters);
      setEquipos(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadEquipos(filters);
  };

  const handleSubmit = async (data: FormData) => {
    if (selectedEquipment) {
      data.append('id', selectedEquipment.id);
      await equipmentApi.update(selectedEquipment.id, data);
    } else {
      await equipmentApi.create(data);
    }
    setShowModal(false);
    setSelectedEquipment(null);
    loadEquipos(filters);
  };

  const handleEdit = (item: EquipmentItem) => {
    setSelectedEquipment(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm("Información",
      '¿Estás seguro de eliminar el equipo?'
    );

    if (!isConfirmed) return;

    await equipmentApi.delete(id);
    loadEquipos(filters);
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  return (
    <div className="">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Equipos</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <RowApp className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4">
          <ColumnApp className="w-full">
            <LabelApp className="text-sm">Buscar por nombre</LabelApp>
            <Input
              type="text"
              placeholder="Nombre del equipo..."
              value={filters.name || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </ColumnApp>
          <BrandSelect
            value={filters.brandId || ''}
            onChange={(value) => setFilters(prev => ({ ...prev, brandId: value }))}
            label="Filtrar por marca"
            showAll
          />
          <GeneralCategorySelect
            value={filters.generalCategoryId || ''}
            onChange={(value) => setFilters(prev => ({ ...prev, generalCategoryId: value }))}
            label="Filtrar por perfil de uso"
            showAll
          />
          <EquipmentStatusSelect
            value={filters.statusId || ''}
            onChange={(value) => setFilters(prev => ({ ...prev, statusId: value }))}
            label="Filtrar por estado"
            showAll
          />
          <Button 
            onClick={handleSearch}
            className="w-full sm:w-auto self-end bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Buscar
          </Button>
          <Button
            className="w-full sm:w-auto self-end bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            onClick={() => setShowModal(true)}
          >
            Registrar equipo
          </Button>
        </RowApp>
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
          loadEquipos(filters);
        }}
        onSubmit={handleSubmit}
        defaultValues={stableDefaultValues}
      />
    </div>
  );
};

export default EquipmentListPage;
