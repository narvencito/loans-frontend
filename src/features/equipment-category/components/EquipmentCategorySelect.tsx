import { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import { equipmentCategoryApi } from '../api/equipment-category-api';
import { EquipmentCategory } from '../types/equipment-category.types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

const EquipmentCategorySelect = ({
  value,
  onChange,
  label = 'Categoría',
  disabled = false,
  required = false
}: Props) => {
  const [options, setOptions] = useState<EquipmentCategory[]>([]);

  useEffect(() => {
    equipmentCategoryApi.getAll().then(setOptions);
  }, []);

  return (
    <ColumnApp className='w-full'>
      <LabelApp className="text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </LabelApp>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent className="select-white">
          {options.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ColumnApp>
  );
};

export default EquipmentCategorySelect;
