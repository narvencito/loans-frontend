import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { equipmentCategoryApi } from '../api/equipment-category-api';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
}

export default function EquipmentCategoryFormModal({ open, onClose, categoryId }: Props) {
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) {
        setForm({ name: '' });
        return;
      }

      try {
        setLoading(true);
        const data = await equipmentCategoryApi.getById(categoryId);
        setForm({ name: data.name });
      } catch (error) {
        console.error('Error al cargar categoría:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadCategory();
    }
  }, [categoryId, open]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      setLoading(true);
      if (categoryId) {
        await equipmentCategoryApi.update(categoryId, form);
      } else {
        await equipmentCategoryApi.create(form);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError('Ocurrió un error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoryId ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Maquinaria pesada"
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {categoryId ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
