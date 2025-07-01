import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileDropzone from '@/shared/components/FileDropzone';
import EquipmentStatusSelect from '@/features/equipment-status/components/EquipmentStatusSelect';
import EquipmentCategorySelect from '@/features/equipment-category/components/EquipmentCategorySelect';
import GeneralCategorySelect from '@/features/general-category/components/GeneralCategorySelect';
import BrandSelect from '@/features/brand/components/BrandSelect';
import EquipmentFeatureSelectCheckboxList from '@/features/equipment-feature/components/EquipmentFeatureSelectedCheckboxList';
import { CreateEquipmentDto, EquipmentItem } from '../api/equipment_api';
import { ImageApp } from '@/features/equipment-feature/api/equipment-feature-api';
import DialogAppCustom from '@/shared/components/DialogAppCustom';
import { Button } from '@/components/ui/button';
import ColumnApp from '@/shared/components/ColumnApp';
import RowApp from '@/shared/components/RowApp';
import LabelApp from '@/shared/components/LabelApp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EquipmentUsageType, EQUIPMENT_USAGE_TYPE_LABELS } from '../model/equipment.types';
import EquipmentUsageTypeSelect from './EquipmentUsageTypeSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: EquipmentItem | null;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const formatNumber = (num: string | number | undefined) => {
  if (!num) return '';
  const numStr = String(num);
  return numStr.length >= 6 ? numStr : '0'.repeat(6 - numStr.length) + numStr;
};

const EquipmentFormModal = ({ open, onClose, onSubmit, defaultValues }: Props) => {
  const [form, setForm] = useState<CreateEquipmentDto & { newImages?: File[]; number?: string; serial?: string; description?: string; brandId?: string }>(
    {
      code: '',
      name: '',
      description: '',
      categoryId: '',
      generalCategoryId: '',
      statusId: '',
      brandId: '',
      location: '',
      serial: '',
      number: '',
      purchasePrice: 0,
      salePrice: 0,
      rentalDailyRate: 0,
      featureIds: [],
      images: [],
      newImages: [],
      usageType: EquipmentUsageType.FINANCING,
    }
  );

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [rentalPriceFocused, setRentalPriceFocused] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (defaultValues) {
      const copiedImages: ImageApp[] = defaultValues.images?.map(i => ({ id: i.id, url: i.url })) || [];
      setForm({
        code: defaultValues.code,
        name: defaultValues.name,
        description: defaultValues.description || '',
        location: defaultValues.location || '',
        serial: defaultValues.serial || '',
        number: defaultValues.number?.toString() || '',
        statusId: defaultValues.statusId,
        categoryId: defaultValues.categoryId,
        generalCategoryId: defaultValues.generalCategoryId || '',
        brandId: defaultValues.brandId || '',
        purchasePrice: defaultValues.purchasePrice || 0,
        salePrice: defaultValues.salePrice || 0,
        rentalDailyRate: defaultValues.rentalDailyRate || 0,
        featureIds: defaultValues.features?.map(f => f.id) || [],
        images: copiedImages,
        newImages: [],
        usageType: (defaultValues.usageTypeId === 'RENTAL' ? EquipmentUsageType.RENTAL : EquipmentUsageType.FINANCING),
      });
    } else {
      setForm({
        code: '',
        name: '',
        description: '',
        location: '',
        serial: '',
        number: '',
        statusId: '',
        categoryId: '',
        generalCategoryId: '',
        brandId: '',
        purchasePrice: 0,
        salePrice: 0,
        rentalDailyRate: 0,
        featureIds: [],
        images: [],
        newImages: [],
        usageType: EquipmentUsageType.FINANCING,
      });
    }
    setErrors({});
    setRentalPriceFocused(false);
  }, [open, defaultValues?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.code) newErrors.code = 'El código es requerido';
    if (!form.name) newErrors.name = 'El nombre es requerido';
    if (!form.description) newErrors.description = 'La descripción es requerida';
    if (!form.categoryId) newErrors.categoryId = 'La categoría es requerida';
    if (!form.generalCategoryId) newErrors.generalCategoryId = 'El perfil de uso es requerido';
    if (!form.statusId) newErrors.statusId = 'El estado es requerido';
    if (!form.brandId) newErrors.brandId = 'La marca es requerida';
    if (!form.usageType) newErrors.usageType = 'El tipo de uso es requerido';
    if (form.purchasePrice <= 0) newErrors.purchasePrice = 'El precio de compra debe ser mayor a 0';
    if (form.salePrice <= 0) newErrors.salePrice = 'El precio de venta debe ser mayor a 0';
    if (form.rentalDailyRate <= 0) newErrors.rentalDailyRate = 'La tarifa diaria debe ser mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('code', form.code);
    formData.append('name', form.name);
    formData.append('description', form.description || '');
    formData.append('location', form.location || '');
    formData.append('statusId', form.statusId);
    formData.append('categoryId', form.categoryId);
    formData.append('generalCategoryId', form.generalCategoryId);
    formData.append('brandId', form.brandId || '');
    formData.append('serial', form.serial || '');
    formData.append('purchasePrice', String(form.purchasePrice || 0));
    formData.append('salePrice', String(form.salePrice || 0));
    formData.append('rentalDailyRate', String(form.rentalDailyRate || 0));
    formData.append('usageType', form.usageType);
    
    // Asegurarnos de que featureIds siempre se envíe como array
    const featureIds = form.featureIds || [];
    if (featureIds.length > 0) {
      featureIds.forEach(id => formData.append('featureIds[]', id));
    } else {
      formData.append('featureIds[]', ''); // Enviar array vacío
    }

    // Agregar imágenes existentes
    if (form.images && form.images.length > 0) {
      form.images.forEach(image => {
        formData.append('existingImages[]', JSON.stringify(image));
      });
    }

    // Agregar nuevas imágenes
    if (form.newImages && form.newImages.length > 0) {
      form.newImages.forEach(file => formData.append('images[]', file));
    }

    await onSubmit(formData);
  };

  return (
    <DialogAppCustom
      open={open}
      onClose={onClose}
      maxWidth='lg'
      title={defaultValues ? "Editar equipo" : "Registrar nuevo equipo"}
      childrenFooter={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {defaultValues ? "Guardar cambios" : "Registrar"}
          </Button>
        </>
      }
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 space-y-4 flex-1 max-h-[calc(100vh-200px)]">
        <RowApp className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RowApp className="grid grid-cols-3 gap-4 w-full">
            <ColumnApp className="w-full">
              <LabelApp className="text-sm font-medium">Código *</LabelApp>
              <Input 
                name="code" 
                value={form.code} 
                onChange={handleChange} 
                className={`w-full ${errors.code ? 'border-red-500' : ''}`}
              />
              {errors.code && <span className="text-red-500 text-xs">{errors.code}</span>}
            </ColumnApp>

            <ColumnApp className="w-full col-span-2">
              <EquipmentUsageTypeSelect
                value={form.usageType}
                onChange={(value) => {
                  setForm(prev => ({ ...prev, usageType: value as EquipmentUsageType }));
                  setErrors(prev => ({ ...prev, usageType: '' }));
                }}
                required
              />
              {errors.usageType && <span className="text-red-500 text-xs">{errors.usageType}</span>}
            </ColumnApp>
          </RowApp>

          <RowApp className="grid grid-cols-2 gap-4 w-full">
            <ColumnApp className="w-full">
              <LabelApp className="text-sm font-medium">Nombre *</LabelApp>
              <Input 
                name="name" 
                value={form.name} 
                onChange={handleChange}
                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
            </ColumnApp>

            <BrandSelect 
              value={form.brandId} 
              onChange={val => {
                setForm(prev => ({ ...prev, brandId: val || '' }));
                setErrors(prev => ({ ...prev, brandId: '' }));
              }}
              required
            />
            {errors.brandId && <span className="text-red-500 text-xs">{errors.brandId}</span>}
          </RowApp>

          <RowApp className="grid grid-cols-2 gap-4 w-full">
            <EquipmentCategorySelect 
              value={form.categoryId} 
              onChange={val => {
                setForm(prev => ({ ...prev, categoryId: val || '' }));
                setErrors(prev => ({ ...prev, categoryId: '' }));
              }} 
              required
            />
            {errors.categoryId && <span className="text-red-500 text-xs">{errors.categoryId}</span>}
            
            <GeneralCategorySelect 
              value={form.generalCategoryId} 
              onChange={val => {
                setForm(prev => ({ ...prev, generalCategoryId: val || '' }));
                setErrors(prev => ({ ...prev, generalCategoryId: '' }));
              }}
              required
            />
            {errors.generalCategoryId && <span className="text-red-500 text-xs">{errors.generalCategoryId}</span>}
          </RowApp>

          <RowApp className="grid grid-cols-2 gap-4 w-full">
            <EquipmentStatusSelect 
              value={form.statusId} 
              onChange={val => {
                setForm(prev => ({ ...prev, statusId: val }));
                setErrors(prev => ({ ...prev, statusId: '' }));
              }}
              required
            />
            {errors.statusId && <span className="text-red-500 text-xs">{errors.statusId}</span>}
            
            <ColumnApp className="w-full">
              <LabelApp className="text-sm font-medium">Ubicación</LabelApp>
              <Input 
                name="location" 
                value={form.location} 
                onChange={handleChange}
              />
            </ColumnApp>
          </RowApp>

          <RowApp>
            <ColumnApp>
              <LabelApp className="text-sm font-medium">Serie</LabelApp>
              <Input name="serial" value={form.serial} onChange={handleChange} />
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Número</LabelApp>
              <Input 
                name="number" 
                value={formatNumber(form.number)} 
                onChange={handleChange}
                readOnly={!!defaultValues} 
                className={!!defaultValues ? 'bg-gray-100' : ''}
              />
            </ColumnApp>
          </RowApp>

          <RowApp>
            <ColumnApp>
              <LabelApp className="text-sm font-medium">Precio compra *</LabelApp>
              <Input 
                type="number" 
                name="purchasePrice" 
                value={form.purchasePrice} 
                onChange={(e) => {
                  setForm(prev => ({ ...prev, purchasePrice: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, purchasePrice: '' }));
                }}
                className={errors.purchasePrice ? 'border-red-500' : ''}
                min="0"
                step="0.01"
              />
              {errors.purchasePrice && <span className="text-red-500 text-xs">{errors.purchasePrice}</span>}
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Precio venta *</LabelApp>
              <Input 
                type="number" 
                name="salePrice" 
                value={form.salePrice} 
                onChange={(e) => {
                  setForm(prev => ({ ...prev, salePrice: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, salePrice: '' }));
                }}
                className={errors.salePrice ? 'border-red-500' : ''}
                min="0"
                step="0.01"
              />
              {errors.salePrice && <span className="text-red-500 text-xs">{errors.salePrice}</span>}
            </ColumnApp>

            <ColumnApp>
              <LabelApp className="text-sm font-medium">Tarifa diaria *</LabelApp>
              <Input 
                type="number" 
                name="rentalDailyRate" 
                value={form.rentalDailyRate} 
                onChange={(e) => {
                  setForm(prev => ({ ...prev, rentalDailyRate: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, rentalDailyRate: '' }));
                }}
                className={errors.rentalDailyRate ? 'border-red-500' : ''}
                min="0"
                step="0.01"
              />
              {errors.rentalDailyRate && <span className="text-red-500 text-xs">{errors.rentalDailyRate}</span>}
            </ColumnApp>
          </RowApp>

          <ColumnApp className="sm:col-span-2">
            <LabelApp className="text-sm font-medium">Características</LabelApp>
            <EquipmentFeatureSelectCheckboxList
              selected={form.featureIds || []}
              onChange={(ids) => {
                setForm(prev => ({ ...prev, featureIds: ids }));
              }}
            />
          </ColumnApp>

          <ColumnApp className="sm:col-span-2">
            <LabelApp className="text-sm font-medium">Descripción *</LabelApp>
            <Textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange}
              className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
          </ColumnApp>

          <ColumnApp className="sm:col-span-2">
            <LabelApp className="text-sm font-medium">Imágenes</LabelApp>
            <FileDropzone
              onDrop={(files) => setForm(prev => ({ ...prev, newImages: [...(prev.newImages || []), ...files] }))}
              existingFiles={form.images}
              onRemoveExisting={(url) => setForm(prev => ({ ...prev, images: prev.images?.filter(i => i.url !== url) || [] }))}
              onRemoveNew={(file) => setForm(prev => ({ ...prev, newImages: prev.newImages?.filter(f => f !== file) || [] }))}
            />
          </ColumnApp>
        </RowApp>
      </ColumnApp>
    </DialogAppCustom>
  );
};

export default EquipmentFormModal;
