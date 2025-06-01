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
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';

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
    <ColumnApp className='w-full'>
      <LabelApp className="text-sm">{label}</LabelApp>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
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
    </ColumnApp>
  );
};

export default EquipmentStatusSelect;
