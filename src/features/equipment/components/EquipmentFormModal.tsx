import { useEffect, useState } from 'react';
import { CreateEquipmentDto, EquipmentItem } from '../api/equipment_api';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEquipmentDto) => void;
  defaultValues?: EquipmentItem | null;
}

const EquipmentFormModal = ({ open, onClose, onSubmit, defaultValues }: Props) => {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {defaultValues ? 'Editar equipo' : 'Registrar nuevo equipo'}
        </h2>

        <div className="space-y-2">
          <input
            type="text"
            name="code"
            placeholder="Código"
            value={form.code}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />

          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />

          <EquipmentCategorySelect
            value={form.categoryId}
            onChange={(val) => setForm((prev) => ({ ...prev, categoryId: val }))}
          />

          <EquipmentStatusSelect
            value={form.statusId}
            onChange={(val) => setForm((prev) => ({ ...prev, statusId: val }))}
          />

          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={form.location}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFormModal;
