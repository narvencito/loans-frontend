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
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';

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

  const handleOpenCreate = () => {
    setShowModal(true);
    setSelectedEquipment(null);
  };

  const handleFilterChange = (key: keyof EquipmentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gestión de Equipos</h1>
        <Button onClick={handleOpenCreate}>
          Registrar equipo
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <RowApp>
          <ColumnApp>
            <LabelApp>Marca</LabelApp>
            <BrandSelect
              value={filters.brandId || ''}
              onChange={(value) => handleFilterChange('brandId', value)}
            />
          </ColumnApp>
          <ColumnApp>
            <LabelApp>Categoría</LabelApp>
            <EquipmentCategorySelect
              value={filters.categoryId || ''}
              onChange={(value) => handleFilterChange('categoryId', value)}
            />
          </ColumnApp>
          <ColumnApp>
            <LabelApp>Estado</LabelApp>
            <EquipmentStatusSelect
              value={filters.statusId || ''}
              onChange={(value) => handleFilterChange('statusId', value)}
            />
          </ColumnApp>
          <Button
            className="self-end bg-yellow-400 hover:bg-yellow-500 text-black"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </RowApp>
      </div>

      {loading ? (
        <p>Cargando equipos...</p>
      ) : (
        <div className="overflow-x-auto">
          <EquipmentTable
            equipos={equipos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
