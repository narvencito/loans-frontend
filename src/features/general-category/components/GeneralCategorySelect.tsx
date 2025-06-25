import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GeneralCategory, generalCategoryApi } from '../api/general_category_api';

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const GeneralCategorySelect = ({
  value,
  onChange,
  label = "Perfil de uso",
  placeholder = "Seleccione un perfil de uso",
  required = false
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
          <SelectItem value="all">Todos los perfiles de uso</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GeneralCategorySelect; 