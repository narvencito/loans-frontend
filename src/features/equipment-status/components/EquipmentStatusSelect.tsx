import { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const EquipmentStatusSelect = ({
  value,
  onChange,
  label = 'Estado',
  disabled = false,
}: Props) => {
  const [options, setOptions] = useState<EquipmentStatus[]>([]);

  useEffect(() => {
    equipmentStatusApi.getAll().then(setOptions);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label className="text-sm text-gray-600">{label}</Label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent  className="select-white">
          {options.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EquipmentStatusSelect;
