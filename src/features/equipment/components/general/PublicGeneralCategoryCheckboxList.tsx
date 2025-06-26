import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { generalCategoryApi } from '@/features/general-category/api/general_category_api';
import type { GeneralCategory } from '@/features/general-category/types/general-category.types';

interface Props {
  selectedCategories: string[];
  onChange: (value: string[]) => void;
}

const PublicGeneralCategoryCheckboxList = ({ selectedCategories, onChange }: Props) => {
  const [categories, setCategories] = useState<GeneralCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await generalCategoryApi.getActive();
        setCategories(response);
      } catch (error) {
        console.error('Error al cargar categorías generales:', error);
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
            id={`general-category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) => handleCheckboxChange(category.id, checked as boolean)}
          />
          <Label htmlFor={`general-category-${category.id}`} className="text-sm font-normal">
            {category.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PublicGeneralCategoryCheckboxList; 