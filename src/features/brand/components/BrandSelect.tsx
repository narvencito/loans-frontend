import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand, brandApi } from '../api/brand_api';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  showAll?: boolean;
}

const BrandSelect = ({
  value,
  onChange,
  label = "Marca",
  disabled = false,
  required = false,
  showAll = false
}: Props) => {
  const [options, setOptions] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        const data = await brandApi.getActive();
        setOptions(data);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
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
          {showAll && (
            <SelectItem value="all">Todos</SelectItem>
          )}
          {options.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ColumnApp>
  );
};

export default BrandSelect; 