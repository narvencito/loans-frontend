import { useEffect, useState } from 'react';
import { EquipmentCategory, equipmentCategoryApi } from '../api/equipment-category-api';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const EquipmentCategorySelect = ({ value, onChange, label = 'Categoría', disabled = false }: Props) => {
  const [options, setOptions] = useState<EquipmentCategory[]>([]);

  useEffect(() => {
    equipmentCategoryApi.getAll().then(setOptions);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border px-3 py-2 w-full rounded"
      >
        <option value="">Seleccione...</option>
        {options.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};

export default EquipmentCategorySelect;
