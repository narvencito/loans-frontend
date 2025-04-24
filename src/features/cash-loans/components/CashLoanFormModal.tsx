import React, { useEffect, useRef, useState } from 'react';
import { clientApi, ClientItem } from '@/features/client/api/client_api';
import ClientSearchInput from '@/features/client/components/ClientSearchInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DatePicker } from '@/shared/components/DatePicker';
import { CreateCashLoanDto } from '@/features/cash-loans/api/cash_loans_api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateCashLoanDto) => void;
}

const CashLoanFormModal = ({ open, onClose, onCreate }: Props) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLInputElement>(null);

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [clientId, setClientId] = useState('');
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      clientApi.getClients().then(setClients);
    }
  }, [open]);

  const handleClose = () => {
    setStartDate(undefined);
    setClientId('');
    setErrors(null);
    onClose();
  };

  const validateForm = (
    amount: number,
    rate: number,
    term: number
  ): boolean => {
    if (!clientId || !startDate) return false;
    if (isNaN(amount) || amount <= 0) {
      setErrors('El monto debe ser mayor a 0');
      return false;
    }
    if (isNaN(rate) || rate < 0) {
      setErrors('La tasa de interés no puede ser negativa');
      return false;
    }
    if (isNaN(term) || term <= 0) {
      setErrors('El número de cuotas debe ser mayor a 0');
      return false;
    }

    setErrors(null);
    return true;
  };

  const handleSubmit = () => {
    const amount = parseFloat(amountRef.current?.value ?? '');
    const rate = parseFloat(rateRef.current?.value ?? '');
    const term = parseInt(termRef.current?.value ?? '');

    if (!validateForm(amount, rate, term)) return;

    onCreate({
      clientId,
      amount,
      rate,
      term,
      startDate: startDate!,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Registrar nuevo préstamo</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Cliente</label>
            <ClientSearchInput
              clients={clients}
              selectedClientId={clientId}
              onSelect={(id) => setClientId(id)}
              placeholder="Buscar cliente por nombre"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Monto (S/)</label>
            <Input
              type="number"
              name="amount"
              ref={amountRef}
              min={0}
              placeholder="Ej. 1000"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tasa de interés (%)</label>
            <Input
              type="number"
              name="rate"
              ref={rateRef}
              min={0}
              placeholder="Ej. 5"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Número de cuotas</label>
            <Input
              type="number"
              name="term"
              ref={termRef}
              min={1}
              placeholder="Ej. 12"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fecha de inicio</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder={format(new Date(), 'dd/MM/yyyy')}
            />
          </div>

          {errors && <p className="text-red-600 text-sm">{errors}</p>}
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <Button variant="secondary" onClick={handleClose} className="hover:bg-gray-400">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!clientId || !startDate}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Crear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashLoanFormModal;
