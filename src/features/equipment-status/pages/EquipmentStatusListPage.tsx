import React, { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';
import EquipmentStatusTable from '../components/EquipmentStatusTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EquipmentStatusListPage = () => {
  const [statuses, setStatuses] = useState<EquipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<EquipmentStatus | null>(null);
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [error, setError] = useState<string | null>(null);

  const loadStatuses = async () => {
    setLoading(true);
    const data = await equipmentStatusApi.getAll();
    setStatuses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({ name: '' });
    setError(null);
    setShowDialog(true);
  };

  const openEdit = (status: EquipmentStatus) => {
    setSelected(status);
    setForm({ name: status.name });
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
    await equipmentStatusApi.delete(id);
    loadStatuses();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    if (selected) {
      await equipmentStatusApi.update(selected.id, form);
    } else {
      await equipmentStatusApi.create(form);
    }

    handleClose();
    loadStatuses();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Estados de Equipos</h1>
        <Button onClick={openCreate}>Crear Estado</Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EquipmentStatusTable
          data={statuses}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar estado' : 'Registrar nuevo estado'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Nombre del estado</label>
              <Input
                name="name"
                placeholder="Ej. Operativo, En mantenimiento"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleClose}>
              Cancelar
            </Button>
            <Button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
              {selected ? 'Guardar cambios' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentStatusListPage;
