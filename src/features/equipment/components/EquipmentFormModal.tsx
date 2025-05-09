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
import EquipmentFeatureSelectCheckboxList from '@/features/equipment-feature/components/EquipmentFeatureSelectedCheckboxList';

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
    featureIds: [],
  });

  useEffect(() => {
    if (defaultValues) {
      setForm({
        code: defaultValues.code,
        name: defaultValues.name,
        location: defaultValues.location || '',
        statusId: defaultValues.statusId,
        categoryId: defaultValues.categoryId,
        featureIds: defaultValues.features?.map(f => f.id) || [],
      });
    } else {
      setForm({
        code: '',
        name: '',
        location: '',
        statusId: '',
        categoryId: '',
        featureIds: [],
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
      <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Editar equipo' : 'Registrar nuevo equipo'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="col-span-1">
            <label className="text-sm font-medium">Código</label>
            <Input
              name="code"
              placeholder="Código"
              value={form.code}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1">
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

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Input
              name="location"
              placeholder="Ubicación"
              value={form.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Características</label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2 mt-1">
            <EquipmentFeatureSelectCheckboxList
              selected={form.featureIds || []}
              onChange={(ids) => setForm((prev) => ({ ...prev, featureIds: ids }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
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
