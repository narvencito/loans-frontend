import { clientApi, ClientItem } from '@/features/client/api/client_api';
import React, { useState, useEffect } from 'react';
import { CreateCashLoanDto } from '../api/cash_loans_api';
import ClientSearchInput from '@/features/client/components/ClientSearchInput';

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
    startDate: '',
  });

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [filterText, setFilterText] = useState('');
  const [filteredClients, setFilteredClients] = useState<ClientItem[]>([]);

  useEffect(() => {
    if (open) {
      clientApi.getClients().then((res) => {
        setClients(res);
        setFilteredClients(res);
      });
    }
  }, [open]);

  useEffect(() => {
    const filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [filterText, clients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleClientSelect = (clientId: string) => {
    setForm({ ...form, clientId });
    setFilterText('');
  };

  const selectedClient = clients.find((c) => c.id === form.clientId);

  if (!open) return null;

  const handleClose = () => {
    setForm({
      clientId: '',
      amount: 0,
      rate: 0,
      term: 1,
      startDate: '',
    });
    setFilterText('');
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Registrar nuevo préstamo</h2>

        <div className="space-y-3">
          {/* Cliente con búsqueda y deselección */}
          <ClientSearchInput
            clients={clients}
            selectedClientId={form.clientId}
            onSelect={(id) => setForm({ ...form, clientId: id })}
            />

          {/* Monto con símbolo */}
          <div>
            <label className="text-sm font-medium">Monto (S/)</label>
            <div className="relative">
              <span className="absolute left-3 top-[10px] text-gray-500">S/</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Ingrese monto"
                className="pl-8 border px-3 py-2 w-full rounded mt-1"
              />
            </div>
          </div>

          {/* Tasa de interés */}
          <div>
            <label className="text-sm font-medium">Tasa de interés (%)</label>
            <input
              type="number"
              name="rate"
              value={form.rate}
              onChange={handleChange}
              placeholder="Ejemplo: 5"
              className="border px-3 py-2 w-full rounded mt-1"
            />
          </div>

          {/* Número de cuotas */}
          <div>
            <label className="text-sm font-medium">Número de cuotas</label>
            <input
              type="number"
              name="term"
              value={form.term}
              onChange={handleChange}
              placeholder="Ejemplo: 12"
              className="border px-3 py-2 w-full rounded mt-1"
            />
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="text-sm font-medium">Fecha de inicio</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={() => onCreate(form)}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={!form.clientId}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashLoanFormModal;
