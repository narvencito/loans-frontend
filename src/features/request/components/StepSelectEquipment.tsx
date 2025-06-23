import { equipmentApi, EquipmentItem } from '@/features/equipment/api/equipment_api';
import { useState, useEffect } from 'react';


interface Props {
  onNext: (equipment: EquipmentItem) => void;
  onPrevious: () => void;
  preselectedId?: string | null;
}

export const StepSelectEquipment = ({ onNext, onPrevious, preselectedId }: Props) => {
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
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Selecciona un equipo</h2>

      <div className="space-y-2 max-h-[30rem] overflow-y-auto border border-gray-300 rounded-md p-1 custom-scrollbar">
        {equipmentList.map((eq) => (
          <div
            key={eq.id}
            className={`p-4 rounded-md cursor-pointer transition duration-150 ease-in-out border-b border-gray-200 last:border-b-0
                        ${selectedId === eq.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedId(eq.id)}
          >
            <input
              type="radio"
              id={eq.id}
              name="equipment"
              value={eq.id}
              checked={selectedId === eq.id}
              onChange={() => setSelectedId(eq.id)}
              className="sr-only" // Hide the actual radio button
            />
            <label htmlFor={eq.id} className="cursor-pointer w-full block text-gray-700">
              <span className="font-semibold">{eq.name}</span>
              <span className="text-sm text-gray-500 ml-2">({eq.code})</span>
            </label>
          </div>
        ))}
        {equipmentList.length === 0 && (
          <p className="text-center text-gray-500 py-4">Cargando equipos...</p>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onPrevious}
          className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Anterior
        </button>
        <button
          disabled={!selectedId}
          onClick={handleSelect}
          className="w-1/2 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
