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
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import AsyncEquipmentCombobox from '@/features/equipment/components/AsyncEquipmentCombobox';
import { CreateRequestAdminDto } from '../api/request_api';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateRequestAdminDto) => void;
}

const AdminRequestFormModal = ({ open, onClose, onCreate }: Props) => {
  const [type, setType] = useState<RequestTypeEnum | ''>('');
  const [form, setForm] = useState<CreateRequestAdminDto>({
    clientId: '',
    requestTypeId: RequestTypeEnum.CASH,
    equipmentId: undefined,
    message: '',
  });

  const handleClientChange = (id: string | null) => {
    setForm((prev) => ({ ...prev, clientId: id || '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEquipmentChange = (id: string | null) => {
    setForm((prev) => ({ ...prev, equipmentId: id || undefined }));
  };

  const handleSubmit = () => {
    if (!type || !form.clientId) return;
    onCreate({ ...form, requestTypeId: type });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Registrar Solicitud</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Tipo de solicitud</Label>
            <select
              className="border rounded px-2 py-1 w-full"
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
            <div>
              <Label>Monto</Label>
              <Input name="message" value={form.message || ''} onChange={handleInputChange} />
            </div>
          )}

          {type === RequestTypeEnum.EQUIPMENT_LOAN && (
            <div>
              <Label>Tiempo de préstamo (días)</Label>
              <Input name="message" value={form.message || ''} onChange={handleInputChange} />
            </div>
          )}

          {type === RequestTypeEnum.EQUIPMENT_FINANCING && (
            <div>
              <Label>Cuota inicial</Label>
              <Input name="message" value={form.message || ''} onChange={handleInputChange} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-gray-300 text-black" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-green-600 text-white" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRequestFormModal;
