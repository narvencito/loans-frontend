import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generalCategoryApi } from '../api/general_category_api';
import { GeneralCategory } from '../types/general-category.types';

interface Props {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  label?: string;
}

const GeneralCategoryCheckboxList = ({
  selectedCategories,
  onCategoriesChange,
  label = "Perfiles de uso"
}: Props) => {
  const [categories, setCategories] = useState<GeneralCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await generalCategoryApi.getActive();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar perfiles de uso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
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
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`general-category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`general-category-${category.id}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GeneralCategoryCheckboxList; 