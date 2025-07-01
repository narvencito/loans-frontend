import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentLoanStatusCode } from '../enums/equipment-loan-status.enum';
import { equipmentLoanApi } from '../api/equipment_loan_api';

interface Props {
  open: boolean;
  onClose: () => void;
  loanId: string;
  action: 'deliver' | 'return' | 'cancel';
}

const actionConfig = {
  deliver: {
    title: 'Entregar Equipo',
    status: EquipmentLoanStatusCode.DELIVERED,
    confirmButtonText: 'Confirmar Entrega',
    notesPlaceholder: 'Ingrese las observaciones de la entrega',
    showAdvancePayment: true,
    showDate: false,
  },
  return: {
    title: 'Devolver Equipo',
    status: EquipmentLoanStatusCode.RETURNED,
    confirmButtonText: 'Confirmar Devolución',
    notesPlaceholder: 'Ingrese las observaciones de la devolución',
    showAdvancePayment: false,
    showDate: true,
  },
  cancel: {
    title: 'Cancelar Préstamo',
    status: EquipmentLoanStatusCode.CANCELLED,
    confirmButtonText: 'Confirmar Cancelación',
    notesPlaceholder: 'Ingrese el motivo de la cancelación',
    showAdvancePayment: false,
    showDate: false,
  },
};

export const ChangeStatusModal = ({ open, onClose, loanId, action }: Props) => {
  const [date, setDate] = useState<string>('');
  const [advancePayment, setAdvancePayment] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const config = actionConfig[action];

  const handleSubmit = async () => {
    if (!notes || (config.showDate && !date)) return;

    setLoading(true);
    try {
      await equipmentLoanApi.changeStatus(loanId, {
        status: config.status,
        advancePayment: advancePayment ? parseFloat(advancePayment) : undefined,
        notes,
        ...(action === 'deliver' && { date: new Date().toISOString() }),
      });
      handleClose();
      onClose();
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDate('');
    setAdvancePayment('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {config.showDate && (
            <div>
              <Label htmlFor="date">Fecha de Devolución</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {config.showAdvancePayment && (
            <div>
              <Label htmlFor="advancePayment">Pago Anticipado</Label>
              <Input
                id="advancePayment"
                type="number"
                min="0"
                step="0.01"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(e.target.value)}
                placeholder="Ingrese el monto del pago anticipado"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={config.notesPlaceholder}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant={action === 'cancel' ? 'warning' : 'secondary'}
              onClick={handleSubmit}
              disabled={!notes || (config.showDate && !date) || loading}
            >
              {config.confirmButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 