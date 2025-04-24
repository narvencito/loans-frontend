import { useEffect, useState } from 'react';
import { EquipmentCategory, equipmentCategoryApi } from '../api/equipment-category-api';

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

const EquipmentCategorySelect = ({
  value,
  onChange,
  label = 'Categoría',
  disabled = false,
}: Props) => {
  const [options, setOptions] = useState<EquipmentCategory[]>([]);

  useEffect(() => {
    equipmentCategoryApi.getAll().then(setOptions);
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
          {options.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EquipmentCategorySelect;
