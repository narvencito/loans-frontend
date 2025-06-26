import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { equipmentCategoryApi } from '@/features/equipment-category/api/equipment-category-api';
import type { EquipmentCategory } from '@/features/equipment-category/types/equipment-category.types';

interface Props {
  selectedCategories: string[];
  onChange: (value: string[]) => void;
}

const PublicEquipmentCategoryCheckboxList = ({ selectedCategories, onChange }: Props) => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await equipmentCategoryApi.getActive();
        setCategories(response);
      } catch (error) {
        console.error('Error al cargar categorías de equipos:', error);
      }
    };
    loadCategories();
  }, []);

  const handleCheckboxChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedCategories, categoryId]);
    } else {
      onChange(selectedCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={`equipment-category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) => handleCheckboxChange(category.id, checked as boolean)}
          />
          <Label htmlFor={`equipment-category-${category.id}`} className="text-sm font-normal">
            {category.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PublicEquipmentCategoryCheckboxList; 