import React, { useEffect, useState } from 'react';
import { CreateEquipmentDto, equipmentApi, EquipmentItem, EquipmentFilters } from '../api/equipment_api';
import EquipmentTable from '../components/EquipmentTable';
import EquipmentFormModal from '../components/EquipmentFormModal';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import BrandSelect from '@/features/brand/components/BrandSelect';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import RowApp from '@/shared/components/RowApp';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';
import { EquipmentUsageType } from '../model/equipment.types';
import EquipmentUsageTypeSelect from '../components/EquipmentUsageTypeSelect';

type ExtendedFilters = Omit<EquipmentFilters, 'usageType'> & {
  usageType?: EquipmentUsageType | 'all';
};

const EquipmentListPage = () => {
  const [equipos, setEquipos] = useState<EquipmentItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [filters, setFilters] = useState<ExtendedFilters>({});

  const stableDefaultValues = React.useMemo(() => selectedEquipment, [selectedEquipment?.id]);

  const loadEquipos = async (params: ExtendedFilters = {}) => {
    try {
      const searchFilters: EquipmentFilters = {
        ...params,
        brandId: params.brandId === 'all' ? undefined : params.brandId,
        generalCategoryId: params.generalCategoryId === 'all' ? undefined : params.generalCategoryId,
        statusId: params.statusId === 'all' ? undefined : params.statusId,
        usageType: params.usageType === 'all' ? undefined : params.usageType
      };
      const data = await equipmentApi.getAll(searchFilters);
      setEquipos(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
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

  const handleFilterChange = (key: keyof ExtendedFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gestión de Equipos</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <RowApp className="justify-between">
          <div className="flex-1 grid grid-cols-4 gap-4">
            <ColumnApp>
              <BrandSelect
                value={filters.brandId || ''}
                onChange={(value) => handleFilterChange('brandId', value)}
              />
            </ColumnApp>
            <ColumnApp>
              <EquipmentCategorySelect
                value={filters.categoryId || ''}
                onChange={(value) => handleFilterChange('categoryId', value)}
              />
            </ColumnApp>
            <ColumnApp>
              <EquipmentStatusSelect
                value={filters.statusId || ''}
                onChange={(value) => handleFilterChange('statusId', value)}
                showAll
              />
            </ColumnApp>
            <ColumnApp>
              <EquipmentUsageTypeSelect
                value={filters.usageType || 'all'}
                onChange={(value) => handleFilterChange('usageType', value)}
                showAll
              />
            </ColumnApp>
          </div>
          <div className="flex items-end gap-2 ml-4">
            <Button
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600"
              onClick={handleSearch}
            >
              Buscar
            </Button>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
              onClick={handleOpenCreate}
            >
              Registrar equipo
            </Button>
          </div>
        </RowApp>
      </div>

      <div className="overflow-x-auto">
        <EquipmentTable
          equipos={equipos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

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
