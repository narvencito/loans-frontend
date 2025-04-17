import React, { useEffect, useState } from 'react';
import { equipmentCategoryApi, EquipmentCategory } from '../api/equipment-category-api';

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
        <h2 className="text-lg font-bold mb-4">{category ? 'Editar' : 'Crear'} Categoría</h2>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCategoryFormModal;
