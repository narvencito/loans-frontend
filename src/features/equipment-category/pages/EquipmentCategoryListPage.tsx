import React, { useEffect, useState } from 'react';
import { EquipmentCategory, equipmentCategoryApi } from '../api/equipment-category-api';
import EquipmentCategoryTable from '../components/EquipmentCategoryTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EquipmentCategoryListPage = () => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [selected, setSelected] = useState<EquipmentCategory | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const data = await equipmentCategoryApi.getAll();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setForm({ name: '' });
    setError(null);
    setShowDialog(true);
  };

  const handleEdit = (category: EquipmentCategory) => {
    setSelected(category);
    setForm({ name: category.name });
    setError(null);
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setSelected(null);
    setForm({ name: '' });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    await equipmentCategoryApi.delete(id);
    loadCategories();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    if (selected) {
      await equipmentCategoryApi.update(selected.id, form);
    } else {
      await equipmentCategoryApi.create(form);
    }

    handleClose();
    loadCategories();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías de Equipos</h1>
        <Button onClick={handleCreate}>Crear Categoría</Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EquipmentCategoryTable
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar categoría' : 'Registrar nueva categoría'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Nombre de la categoría</label>
              <Input
                name="name"
                placeholder="Ej. Maquinaria pesada, Herramientas"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleClose}>Cancelar</Button>
            <Button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>{selected ? 'Guardar cambios' : 'Crear'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentCategoryListPage;
