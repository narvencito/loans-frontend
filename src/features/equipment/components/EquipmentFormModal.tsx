import { useEffect, useState } from 'react';
import { CreateEquipmentDto, EquipmentItem } from '../api/equipment_api';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEquipmentDto) => void;
  defaultValues?: EquipmentItem | null;
}

const EquipmentFormModal = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}: Props) => {
  const [form, setForm] = useState<CreateEquipmentDto>({
    code: '',
    name: '',
    location: '',
    statusId: '',
    categoryId: '',
  });

  useEffect(() => {
    if (defaultValues) {
      setForm({
        code: defaultValues.code,
        name: defaultValues.name,
        location: defaultValues.location || '',
        statusId: defaultValues.statusId,
        categoryId: defaultValues.categoryId,
      });
    } else {
      setForm({
        code: '',
        name: '',
        location: '',
        statusId: '',
        categoryId: '',
      });
    }
  }, [defaultValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Editar equipo' : 'Registrar nuevo equipo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium">Código</label>
            <Input
              name="code"
              placeholder="Código"
              value={form.code}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <EquipmentCategorySelect
              value={form.categoryId}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, categoryId: val }))
              }
            />
          </div>

          <div>
            <EquipmentStatusSelect
              value={form.statusId}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, statusId: val }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ubicación</label>
            <Input
              name="location"
              placeholder="Ubicación"
              value={form.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFormModal;
