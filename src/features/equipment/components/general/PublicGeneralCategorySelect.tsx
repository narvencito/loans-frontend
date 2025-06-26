import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generalCategoryApi } from '@/features/general-category/api/general_category_api';
import { GeneralCategory } from '@/features/general-category/types/general-category.types';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  includeAll?: boolean;
}

const PublicGeneralCategorySelect = ({
  value,
  onChange,
  label = "Perfil de uso",
  disabled = false,
  required = false,
  includeAll = false
}: Props) => {
  const [options, setOptions] = useState<GeneralCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await generalCategoryApi.getActive();
        setOptions(data);
      } catch (error) {
        console.error('Error al cargar perfiles de uso:', error);
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

export default PublicGeneralCategorySelect; 