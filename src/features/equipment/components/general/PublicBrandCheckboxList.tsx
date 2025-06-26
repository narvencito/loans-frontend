import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { brandApi } from '@/features/brand/api/brand_api';
import type { Brand } from '@/features/brand/api/brand_api';

interface Props {
  selectedBrands: string[];
  onChange: (value: string[]) => void;
}

const PublicBrandCheckboxList = ({ selectedBrands, onChange }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await brandApi.getActive();
        setBrands(response);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
      }
    };
    loadBrands();
  }, []);

  const handleCheckboxChange = (brandId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedBrands, brandId]);
    } else {
      onChange(selectedBrands.filter(id => id !== brandId));
    }
  };

  return (
    <div className="space-y-2">
      {brands.map((brand) => (
        <div key={brand.id} className="flex items-center space-x-2">
          <Checkbox
            id={`brand-${brand.id}`}
            checked={selectedBrands.includes(brand.id)}
            onCheckedChange={(checked) => handleCheckboxChange(brand.id, checked as boolean)}
          />
          <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal">
            {brand.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PublicBrandCheckboxList; 