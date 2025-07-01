import { useState, useEffect } from 'react';
import { equipmentPublicApi, PublicEquipmentItem } from '@/features/equipment/api/equipmentPublicApi';

interface Props {
  onNext: (equipment: PublicEquipmentItem) => void;
  onPrevious: () => void;
  preselectedId?: string | null;
  preselectedEquipment?: PublicEquipmentItem | null;
}

export const StepSelectEquipment = ({ onNext, onPrevious, preselectedId, preselectedEquipment }: Props) => {
  const [equipmentList, setEquipmentList] = useState<PublicEquipmentItem[]>(
    preselectedEquipment ? [preselectedEquipment] : []
  );
  const [selectedId, setSelectedId] = useState<string | null>(preselectedId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      // Si ya tenemos el equipo preseleccionado, no necesitamos hacer la llamada al API
      if (preselectedEquipment) {
        if (preselectedId === preselectedEquipment.id) {
          onNext(preselectedEquipment);
        }
        return;
      }

      // Si tenemos un ID preseleccionado pero no el equipo, buscamos solo ese equipo
      if (preselectedId) {
        try {
          setIsLoading(true);
          setError(null);
          const equipment = await equipmentPublicApi.getById(preselectedId);
          setEquipmentList([equipment]);
          onNext(equipment);
        } catch (error) {
          setError('No se pudo cargar el equipo seleccionado. Por favor, intente nuevamente.');
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Si no hay preselección, cargamos la lista completa
      try {
        setIsLoading(true);
        setError(null);
        const response = await equipmentPublicApi.getByFilter({});
        setEquipmentList(response.items);
      } catch (error) {
        setError('No se pudieron cargar los equipos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEquipment();
  }, [preselectedId, preselectedEquipment, onNext]);

  const handleSelect = () => {
    const selected = equipmentList.find((e) => e.id === selectedId);
    if (selected) onNext(selected);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-gray-500">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            <label htmlFor={eq.id} className="cursor-pointer w-full block">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">{eq.name}</span>
                <span className="text-sm text-gray-500">Código: {eq.code}</span>
                {eq.description && (
                  <p className="text-sm text-gray-600 mt-1">{eq.description}</p>
                )}
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-medium text-blue-600">
                    Precio: S/ {eq.salePrice.toLocaleString()}
                  </span>
                  {eq.location && (
                    <span className="text-sm text-gray-500">
                      Ubicación: {eq.location}
                    </span>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
        {equipmentList.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 py-4">No hay equipos disponibles</p>
        )}
      </div>

      <div className="flex justify-between mt-8 gap-4">
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
