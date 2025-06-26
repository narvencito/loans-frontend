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
import { equipmentCategoryApi } from '@/features/equipment-category/api/equipment-category-api';
import { EquipmentCategory } from '@/features/equipment-category/types/equipment-category.types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  includeAll?: boolean;
}

const PublicEquipmentCategorySelect = ({
  value,
  onChange,
  label = 'Categoría',
  disabled = false,
  required = false,
  includeAll = false
}: Props) => {
  const [options, setOptions] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await equipmentCategoryApi.getAll();
        setOptions(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
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
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent className="select-white">
          {includeAll && (
            <SelectItem value="all">Todos</SelectItem>
          )}
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

export default PublicEquipmentCategorySelect; 