import { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const EquipmentStatusSelect = ({ value, onChange, label = 'Estado', disabled = false }: Props) => {
  const [options, setOptions] = useState<EquipmentStatus[]>([]);

  useEffect(() => {
    equipmentStatusApi.getAll().then(setOptions);
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
        {options.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
};

export default EquipmentStatusSelect;
