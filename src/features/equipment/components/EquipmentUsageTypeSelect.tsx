import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import { EquipmentUsageType, EQUIPMENT_USAGE_TYPE_LABELS } from '../model/equipment.types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  showAll?: boolean;
}

const EquipmentUsageTypeSelect = ({
  value,
  onChange,
  label = 'Tipo de Uso',
  disabled = false,
  required = false,
  showAll = false
}: Props) => {
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
          {showAll && (
            <SelectItem value="all">Todos los tipos</SelectItem>
          )}
          {Object.entries(EQUIPMENT_USAGE_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ColumnApp>
  );
};

export default EquipmentUsageTypeSelect; 