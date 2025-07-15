import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { equipmentCategoryApi } from '../api/equipment-category-api';
import { EquipmentCategory } from '../types/equipment-category.types';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import { BlueButton, RedButton } from '@/components/common/ColorButtons';

interface Props {
  onEdit: (id: string) => void;
}

export default function EquipmentCategoryTable({ onEdit }: Props) {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await equipmentCategoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('¿Estás seguro de eliminar esta categoría?');
    if (!confirmed) return;

    try {
      await equipmentCategoryApi.delete(id);
      await loadCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay categorías registradas
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <BlueButton
                      size="icon"
                      onClick={() => onEdit(category.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </BlueButton>
                    <RedButton
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </RedButton>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
