import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import { adminCashLoanApi } from '../api/admin_cash_loans_api';
import { useDialogStore } from '@/shared/utils/global-dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminCashLoanFormModal({ open, onClose, onSuccess }: Props) {
  const { showDialog } = useDialogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [rate, setRate] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !amount || !term || !rate || !startDate) {
      showDialog({
        title: 'Error',
        message: 'Por favor, complete todos los campos',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await adminCashLoanApi.createCashLoan({
        clientId: selectedClientId,
        amount: parseFloat(amount),
        term: parseInt(term),
        rate: parseFloat(rate),
        startDate,
      });
      showDialog({
        title: 'Éxito',
        message: 'Préstamo creado exitosamente',
        type: 'success'
      });
      onSuccess();
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      showDialog({
        title: 'Error',
        message: 'Ocurrió un error al crear el préstamo',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedClientId(null);
    setAmount('');
    setTerm('');
    setRate('');
    setStartDate('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Préstamo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <AsyncClientCombobox
              selectedClientId={selectedClientId}
              onSelect={setSelectedClientId}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (S/)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Plazo (meses)</Label>
            <Input
              id="term"
              type="number"
              min="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Tasa de interés (%)</Label>
            <Input
              id="rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 