import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Brand, brandApi } from '../api/brand_api';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  label?: string;
}

const BrandCheckboxList = ({
  selectedBrands,
  onBrandsChange,
  label = "Marcas"
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

  const handleBrandToggle = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onBrandsChange(selectedBrands.filter(id => id !== brandId));
    } else {
      onBrandsChange([...selectedBrands, brandId]);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => handleBrandToggle(brand.id)}
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BrandCheckboxList; 