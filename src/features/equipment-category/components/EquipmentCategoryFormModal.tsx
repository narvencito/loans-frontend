import React, { useEffect, useState } from 'react';
import { equipmentCategoryApi, EquipmentCategory } from '../api/equipment-category-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: EquipmentCategory | null;
}

const EquipmentCategoryFormModal = ({ open, onClose, onSuccess, category }: Props) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category]);

  const handleSubmit = async () => {
    if (category) {
      await equipmentCategoryApi.update(category.id, { name });
    } else {
      await equipmentCategoryApi.create({ name });
    }
    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {category ? 'Editar' : 'Crear'} Categoría
        </h2>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la categoría</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ej: Laptops"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose} className="hover:bg-gray-200">
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCategoryFormModal;
