import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import FileDropzone from '@/shared/components/FileDropzone';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';
import EquipmentFeatureSelectCheckboxList from '@/features/equipment-feature/components/EquipmentFeatureSelectedCheckboxList';
import { CreateEquipmentDto, EquipmentItem } from '../api/equipment_api';
import { ImageApp } from '@/features/equipment-feature/api/equipment-feature-api';
import DialogApp from '@/shared/components/DialogApp';
import ColumnApp from '@/shared/components/ColumnApp';
import RowApp from '@/shared/components/RowApp';
import LabelApp from '@/shared/components/LabelApp';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: EquipmentItem | null;
}

const EquipmentFormModal = ({ open, onClose, onSubmit, defaultValues }: Props) => {
  const [form, setForm] = useState<CreateEquipmentDto & { newImages?: File[]; number?: string; serial?: string }>(
    {
      code: '',
      name: '',
      categoryId: '',
      statusId: '',
      location: '',
      serial: '',
      number: '',
      purchasePrice: 0,
      salePrice: 0,
      featureIds: [],
      images: [],
      newImages: [],
    }
  );

  useEffect(() => {
    if (!open) return;
    if (defaultValues) {
      const copiedImages: ImageApp[] = defaultValues.images?.map(i => ({ id: i.id, url: i.url })) || [];
      setForm({
        code: defaultValues.code,
        name: defaultValues.name,
        location: defaultValues.location || '',
        serial: defaultValues.serial || '',
        number: defaultValues.number?.toString() || '',
        statusId: defaultValues.statusId,
        categoryId: defaultValues.categoryId,
        purchasePrice: defaultValues.purchasePrice || 0,
        salePrice: defaultValues.salePrice || 0,
        featureIds: defaultValues.features?.map(f => f.id) || [],
        images: copiedImages,
        newImages: [],
      });
    } else {
      setForm({
        code: '',
        name: '',
        location: '',
        serial: '',
        number: '',
        statusId: '',
        categoryId: '',
        purchasePrice: 0,
        salePrice: 0,
        featureIds: [],
        images: [],
        newImages: [],
      });
    }
  }, [open, defaultValues?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('code', form.code);
    formData.append('name', form.name);
    formData.append('location', form.location || '');
    formData.append('statusId', form.statusId);
    formData.append('categoryId', form.categoryId);
    formData.append('serial', form.serial || '');
    formData.append('purchasePrice', String(form.purchasePrice || 0));
    formData.append('salePrice', String(form.salePrice || 0));
    form.featureIds?.forEach(id => formData.append('featureIds', id));
    form.newImages?.forEach(file => formData.append('images', file));
    await onSubmit(formData);
  };

  return (
    <DialogApp
      open={open}
      onClose={onClose}
      onConfirm={handleSubmit}
      maxWidth='4xl'
      title={defaultValues ? "Editar equipo" : "Registrar nuevo equipo"}
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
        <RowApp className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RowApp>
            <ColumnApp>
              <LabelApp className="text-sm font-medium">Código</LabelApp>
              <Input name="code" value={form.code} onChange={handleChange} />
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Nombre</LabelApp>
              <Input name="name" value={form.name} onChange={handleChange} />
            </ColumnApp>
          </RowApp>

          <RowApp>
            <EquipmentCategorySelect value={form.categoryId} onChange={val => setForm(prev => ({ ...prev, categoryId: val }))} />
            <EquipmentStatusSelect value={form.statusId} onChange={val => setForm(prev => ({ ...prev, statusId: val }))} />
          </RowApp>

          <RowApp>
            <ColumnApp className="sm:col-span-2">
              <LabelApp className="text-sm font-medium">Ubicación</LabelApp>
              <Input name="location" value={form.location} onChange={handleChange} />
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Serie</LabelApp>
              <Input name="serial" value={form.serial} onChange={handleChange} />
            </ColumnApp>
          </RowApp>

          {defaultValues?.id && (
            <ColumnApp>
              <LabelApp className="text-sm font-medium">Número</LabelApp>
              <Input name="number" value={form.number} onChange={handleChange} />
            </ColumnApp>
          )}

          <RowApp>
            <ColumnApp>
              <LabelApp className="text-sm font-medium">Precio compra</LabelApp>
              <Input type="number" name="purchasePrice" value={form.purchasePrice} onChange={(e) => setForm(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))} />
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Precio venta</LabelApp>
              <Input type="number" name="salePrice" value={form.salePrice} onChange={(e) => setForm(prev => ({ ...prev, salePrice: Number(e.target.value) }))} />
            </ColumnApp>
          </RowApp>
        </RowApp>

        <ColumnApp>
          <LabelApp className="text-sm font-medium">Características</LabelApp>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2 mt-1">
            <EquipmentFeatureSelectCheckboxList
              selected={form.featureIds || []}
              onChange={(ids) => setForm(prev => ({ ...prev, featureIds: ids }))}
            />
          </div>
        </ColumnApp>

        <ColumnApp>
          <LabelApp className="text-sm font-medium">Imágenes del equipo</LabelApp>
          <FileDropzone
            existingImages={defaultValues?.images ?? []}
            onChange={(files, kept) => {
              setForm(prev => ({ ...prev, images: kept, newImages: files }));
            }}
          />
        </ColumnApp>
      </ColumnApp>
    </DialogApp>
  );

};

export default EquipmentFormModal;
