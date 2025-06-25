import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Brand, brandApi } from '../api/brand_api';

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const BrandSelect = ({
  value,
  onChange,
  label = "Marca",
  placeholder = "Seleccione una marca",
  required = false
}: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        const data = await brandApi.getActive();
        setBrands(data);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>}
      <Select
        value={value || 'all'}
        onValueChange={(val) => onChange(val === 'all' ? null : val)}
        disabled={loading}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las marcas</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BrandSelect; 