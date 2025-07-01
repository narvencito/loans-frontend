import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AsyncEquipmentCombobox from '@/features/equipment/components/AsyncEquipmentCombobox';
import { CreateRequestAdminDto, CreateRequestDto, requestApi } from '../api/request_api';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';
import { showError, showSuccess } from '@/shared/utils/global-dialog-utils';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: CreateRequestAdminDto) => void;
}

const DEFAULT_INTEREST_RATE = 10;

const AdminRequestFormModal = ({ open, onClose, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<RequestTypeEnum | ''>('');
  const [form, setForm] = useState<CreateRequestAdminDto>({
    clientId: '',
    requestTypeId: RequestTypeEnum.CASH,
    equipmentId: undefined,
    amount: undefined,
    termInMonths: undefined,
    termInDays: undefined,
    interestRate: DEFAULT_INTEREST_RATE,
    message: '',
  });

  const handleClientChange = (id: string | null) => {
    setForm((prev) => ({ ...prev, clientId: id || '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === 'message' ? value : Number(value) 
    }));
  };

  const handleEquipmentChange = (id: string | null) => {
    setForm((prev) => ({ ...prev, equipmentId: id || undefined }));
  };

  const validateForm = (): string | null => {
    if (!type) return 'Seleccione un tipo de solicitud';
    if (!form.clientId) return 'Seleccione un cliente';
    
    if (type === RequestTypeEnum.CASH) {
      if (!form.amount || form.amount <= 0) return 'Ingrese un monto válido';
      if (!form.termInMonths || form.termInMonths <= 0) return 'Ingrese un plazo válido';
      if (!form.interestRate || form.interestRate < 0) return 'Ingrese una tasa de interés válida';
    }

    if (type === RequestTypeEnum.EQUIPMENT_LOAN) {
      if (!form.equipmentId) return 'Seleccione un equipo';
      if (!form.termInDays || form.termInDays <= 0) return 'Ingrese un tiempo de préstamo válido';
    }

    if (type === RequestTypeEnum.EQUIPMENT_FINANCING && !form.equipmentId) {
      return 'Seleccione un equipo';
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      showError('Error de validación', error);
      return;
    }

    setIsSubmitting(true);
    try {
      await requestApi.createAdmin({
        ...form,
        requestTypeId: type as RequestTypeEnum,
      });
      showSuccess('Solicitud creada', 'La solicitud se ha creado correctamente');
      onSuccess?.(form);
      onClose();
    } catch (error) {
      showError('Error', 'No se pudo crear la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setType('');
    setForm({
      clientId: '',
      requestTypeId: RequestTypeEnum.CASH,
      equipmentId: undefined,
      amount: undefined,
      termInMonths: undefined,
      termInDays: undefined,
      interestRate: DEFAULT_INTEREST_RATE,
      message: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => { resetForm(); onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Registrar Solicitud</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Tipo de solicitud</Label>
            <select
              className="w-full border rounded px-2 py-1.5"
              value={type}
              onChange={(e) => setType(e.target.value as RequestTypeEnum)}
            >
              <option value="">Seleccione tipo</option>
              <option value={RequestTypeEnum.CASH}>Préstamo monetario</option>
              <option value={RequestTypeEnum.EQUIPMENT_LOAN}>Préstamo de equipo</option>
              <option value={RequestTypeEnum.EQUIPMENT_FINANCING}>Financiamiento de equipo</option>
            </select>
          </div>

          <AsyncClientCombobox
            selectedClientId={form.clientId}
            onSelect={handleClientChange}
          />

          {(type === RequestTypeEnum.EQUIPMENT_LOAN || type === RequestTypeEnum.EQUIPMENT_FINANCING) && (
            <AsyncEquipmentCombobox
              selectedEquipmentId={form.equipmentId || ''}
              onSelect={handleEquipmentChange}
            />
          )}

          {type === RequestTypeEnum.CASH && (
            <>
              <div>
                <Label>Monto del préstamo</Label>
                <Input
                  type="number"
                  name="amount"
                  value={form.amount || ''}
                  onChange={handleInputChange}
                  placeholder="Ingrese el monto"
                  min="1"
                />
              </div>

              <div>
                <Label>Plazo (meses)</Label>
                <Input
                  type="number"
                  name="termInMonths"
                  value={form.termInMonths || ''}
                  onChange={handleInputChange}
                  placeholder="Ingrese el plazo en meses"
                  min="1"
                />
              </div>

              <div>
                <Label>Tasa de interés (%)</Label>
                <Input
                  type="number"
                  name="interestRate"
                  value={form.interestRate || DEFAULT_INTEREST_RATE}
                  onChange={handleInputChange}
                  placeholder="Ingrese la tasa de interés"
                  min="0"
                  step="0.01"
                />
              </div>
            </>
          )}

          {type === RequestTypeEnum.EQUIPMENT_LOAN && (
            <div>
              <Label>Tiempo de préstamo (días)</Label>
              <Input
                type="number"
                name="termInDays"
                value={form.termInDays || ''}
                onChange={handleInputChange}
                placeholder="Ingrese el tiempo en días"
                min="1"
              />
            </div>
          )}

          <div>
            <Label>Mensaje adicional</Label>
            <Input
              name="message"
              value={form.message || ''}
              onChange={handleInputChange}
              placeholder="Ingrese un mensaje adicional"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => { resetForm(); onClose(); }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRequestFormModal;
