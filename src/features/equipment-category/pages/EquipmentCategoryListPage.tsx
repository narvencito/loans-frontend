import { useState } from 'react';
import EquipmentCategoryTable from '../components/EquipmentCategoryTable';
import EquipmentCategoryFormModal from '../components/EquipmentCategoryFormModal';
import { Plus } from 'lucide-react';
import { YellowButton } from '@/components/common/ColorButtons';

export default function EquipmentCategoryListPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setSelectedCategoryId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorías de Equipos</h1>
        <YellowButton onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </YellowButton>
      </div>

      <EquipmentCategoryTable onEdit={handleEdit} />

      <EquipmentCategoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        categoryId={selectedCategoryId}
      />
    </div>
  );
}
