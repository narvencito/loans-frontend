import { useEffect, useState } from 'react';
import { clientApi, ClientItem } from '@/features/client/api/client_api';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DatePicker } from '@/shared/components/DatePicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateCashLoanDto } from '@/features/cash-loans/api/cash_loans_api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateCashLoanDto) => void;
}

const CashLoanFormModal = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState<CreateCashLoanDto>({
    clientId: '',
    amount: 0,
    rate: 0,
    term: 1,
    startDate: new Date(),
  });
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' || name === 'rate'
        ? parseFloat(value)
        : name === 'term'
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.clientId || !form.startDate) {
      setErrors('Debe seleccionar un cliente y una fecha válida');
      return;
    }

    if (form.amount <= 0) {
      setErrors('El monto debe ser mayor a 0');
      return;
    }

    if (form.rate < 0) {
      setErrors('La tasa de interés no puede ser negativa');
      return;
    }

    if (form.term <= 0) {
      setErrors('El número de cuotas debe ser mayor a 0');
      return;
    }

    setErrors(null);
    onCreate(form);
  };

  const handleReset = () => {
    setForm({
      clientId: '',
      amount: 0,
      rate: 0,
      term: 1,
      startDate: new Date(),
    });
    setErrors(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Registrar nuevo préstamo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <AsyncClientCombobox
              selectedClientId={form.clientId}
              onSelect={(id) => setForm((prev) => ({ ...prev, clientId: id ?? '' }))}
              placeholder="Buscar cliente por nombre o documento"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Monto (S/)</label>
            <Input
              name="amount"
              type="number"
              min={0}
              placeholder="Ej. 1000"
              value={form.amount || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tasa de interés (%)</label>
            <Input
              name="rate"
              type="number"
              min={0}
              placeholder="Ej. 5"
              value={form.rate || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Número de cuotas</label>
            <Input
              name="term"
              type="number"
              min={1}
              placeholder="Ej. 12"
              value={form.term || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fecha de inicio</label>
            <DatePicker
              value={form.startDate}
              onChange={(date) => setForm((prev) => ({ ...prev, startDate: date! }))}
              placeholder={format(new Date(), 'dd/MM/yyyy')}
            />
          </div>

          {errors && <p className="text-red-600 text-sm">{errors}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleReset}>
            Cancelar
          </Button>
          <Button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={!form.clientId || !form.startDate}>
            Crear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashLoanFormModal;
