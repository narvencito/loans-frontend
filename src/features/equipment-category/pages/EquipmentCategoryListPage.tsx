import React, { useEffect, useState } from 'react';
import { EquipmentCategory, equipmentCategoryApi } from '../api/equipment-category-api';
import EquipmentCategoryTable from '../components/EquipmentCategoryTable';
import EquipmentCategoryFormModal from '../components/EquipmentCategoryFormModal';
import { Button } from '@/components/ui/button';

const EquipmentCategoryListPage = () => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [selected, setSelected] = useState<EquipmentCategory | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const data = await equipmentCategoryApi.getAll();
    setCategories(data);
    setLoading(false);
  };

  const handleCreate = () => {
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (category: EquipmentCategory) => {
    setSelected(category);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await equipmentCategoryApi.delete(id);
    loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías de Equipos</h1>
        <Button onClick={handleCreate}>
          Crear Categoría
        </Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EquipmentCategoryTable
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EquipmentCategoryFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadCategories}
        category={selected}
      />
    </div>
  );
};

export default EquipmentCategoryListPage;
