import React, { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  status: EquipmentStatus | null;
}

const EquipmentStatusFormModal = ({ open, onClose, onSuccess, status }: Props) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (status) {
      setName(status.name);
    } else {
      setName('');
    }
  }, [status]);

  const handleSubmit = async () => {
    if (status) {
      await equipmentStatusApi.update(status.id, { name });
    } else {
      await equipmentStatusApi.create({ name });
    }
    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">{status ? 'Editar' : 'Crear'} Estado</h2>
        <input
          type="text"
          placeholder="Nombre del estado"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 w-full rounded bg-white text-black"
        />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatusFormModal;
