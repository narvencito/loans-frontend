import { equipmentApi, EquipmentItem } from '@/features/equipment/api/equipment_api';
import { useState, useEffect } from 'react';


interface Props {
  onNext: (equipment: EquipmentItem) => void;
  preselectedId?: string | null;
}

export const StepSelectEquipment = ({ onNext }: Props) => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    equipmentApi.getAll().then(setEquipmentList);
  }, []);

  const handleSelect = () => {
    const selected = equipmentList.find((e) => e.id === selectedId);
    if (selected) onNext(selected);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">Selecciona un equipo</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto border p-4 rounded">
        {equipmentList.map((eq) => (
          <div key={eq.id} className="flex items-center space-x-3">
            <input
              type="radio"
              id={eq.id}
              name="equipment"
              value={eq.id}
              checked={selectedId === eq.id}
              onChange={() => setSelectedId(eq.id)}
            />
            <label htmlFor={eq.id} className="cursor-pointer">
              {eq.name} ({eq.code})
            </label>
          </div>
        ))}
      </div>

      <button
        disabled={!selectedId}
        onClick={handleSelect}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Continuar
      </button>
    </div>
  );
};
