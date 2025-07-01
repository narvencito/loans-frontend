import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { EquipmentUsageType, EQUIPMENT_USAGE_TYPE_LABELS } from '../model/equipment.types';

interface Props {
  selectedUsageType: EquipmentUsageType | 'all';
  onChange: (value: EquipmentUsageType | 'all') => void;
}

const EquipmentUsageTypeCheckboxList = ({ selectedUsageType, onChange }: Props) => {
  const handleCheckboxChange = (value: EquipmentUsageType | 'all', checked: boolean) => {
    if (checked) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="usage-type-all"
          checked={selectedUsageType === 'all'}
          onCheckedChange={(checked) => handleCheckboxChange('all', checked as boolean)}
        />
        <Label htmlFor="usage-type-all" className="text-sm font-normal cursor-pointer">
          Todos los tipos
        </Label>
      </div>
      
      {Object.entries(EQUIPMENT_USAGE_TYPE_LABELS).map(([value, label]) => (
        <div key={value} className="flex items-center space-x-2">
          <Checkbox
            id={`usage-type-${value}`}
            checked={selectedUsageType === value}
            onCheckedChange={(checked) => handleCheckboxChange(value as EquipmentUsageType, checked as boolean)}
          />
          <Label htmlFor={`usage-type-${value}`} className="text-sm font-normal cursor-pointer">
            {label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default EquipmentUsageTypeCheckboxList; 