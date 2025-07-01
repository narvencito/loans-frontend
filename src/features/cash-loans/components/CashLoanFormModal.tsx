import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import DialogAppCustom from '@/shared/components/DialogAppCustom';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import { CreateCashLoanDto } from '@/features/cash-loans/api/cash_loans_api';
import { DatePicker} from '@/shared/components/DatePicker';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateCashLoanDto) => void;
}

export const CashLoanFormModal = ({ open, onClose, onCreate }: Props) => {
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
    if (!form.clientId || !form.startDate) return setErrors('Debe seleccionar un cliente y una fecha válida');
    if (form.amount <= 0) return setErrors('El monto debe ser mayor a 0');
    if (form.rate < 0) return setErrors('La tasa de interés no puede ser negativa');
    if (form.term <= 0) return setErrors('El número de cuotas debe ser mayor a 0');

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
    <DialogAppCustom
      open={open}
      onClose={handleReset}
      title="Registrar nuevo préstamo"
      maxWidth="md"
      childrenFooter={
        <>
          <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleReset}>
            Cancelar
          </Button>
          <Button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={!form.clientId || !form.startDate}>
            Crear
          </Button>
        </>
      }
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
        <ColumnApp>
          <AsyncClientCombobox
            selectedClientId={form.clientId}
            onSelect={(id) => setForm((prev) => ({ ...prev, clientId: id ?? '' }))}
            placeholder="Buscar cliente por nombre o documento"
          />
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Monto (S/)</LabelApp>
          <Input name="amount" type="number" placeholder='S/. 1000.00' min={0} value={form.amount || ''} onChange={handleChange} />
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Tasa de interés (%)</LabelApp>
          <Input name="rate" type="number" placeholder='10' min={0} value={form.rate || ''} onChange={handleChange} />
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Número de cuotas</LabelApp>
          <Input name="term" type="number" min={1} value={form.term || ''} onChange={handleChange} />
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Fecha de inicio</LabelApp>
          <DatePicker
            value={form.startDate}
            onChange={(date) => setForm((prev) => ({ ...prev, startDate: date! }))}
            placeholder={format(new Date(), 'dd/MM/yyyy')}
          />
        </ColumnApp>

        {errors && <p className="text-red-600 text-sm">{errors}</p>}
      </ColumnApp>
    </DialogAppCustom>
  );
};

export default CashLoanFormModal;
