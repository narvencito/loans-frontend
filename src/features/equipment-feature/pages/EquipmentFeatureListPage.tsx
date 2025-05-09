import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EquipmentFeatureTable from '../components/EquipmentFeatureTable';
import { EquipmentFeature, equipmentFeatureApi } from '../api/equipment-feature-api';

const EquipmentFeatureListPage = () => {
  const [features, setFeatures] = useState<EquipmentFeature[]>([]);
  const [selected, setSelected] = useState<EquipmentFeature | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFeatures = async () => {
    setLoading(true);
    const data = await equipmentFeatureApi.getAll();
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setForm({ name: '' });
    setError(null);
    setShowDialog(true);
  };

  const handleEdit = (feature: EquipmentFeature) => {
    setSelected(feature);
    setForm({ name: feature.name });
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
    await equipmentFeatureApi.delete(id);
    loadFeatures();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    if (selected) {
      await equipmentFeatureApi.update(selected.id, form);
    } else {
      await equipmentFeatureApi.create(form);
    }

    handleClose();
    loadFeatures();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Características Técnicas</h1>
        <Button onClick={handleCreate}>Crear Característica</Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EquipmentFeatureTable
          data={features}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar característica' : 'Registrar nueva característica'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                name="name"
                placeholder="Ej. Pantalla táctil, Proyector 4K"
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

export default EquipmentFeatureListPage;