import React, { useEffect, useState } from 'react';
import { cashLoanApi, CashLoanItem, CreateCashLoanDto } from '../api/cash_loans_api';
import CashLoanTable from '../components/CashLoanTable';
import CashLoanFormModal from '../components/CashLoanFormModal';
import ClientSearchInput, { SimpleClient } from '@/features/client/components/ClientSearchInput';
import CashLoanScheduleModal from '../components/CashLoanScheduleModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

const CashLoanListPage = () => {
  const [loans, setLoans] = useState<CashLoanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<CashLoanItem | null>(null);

  const loadLoans = async () => {
    setLoading(true);
    const data = await cashLoanApi.getCashLoans();
    setLoans(data);
    setLoading(false);
  };

  const handleCreate = async (data: CreateCashLoanDto) => {
    await cashLoanApi.createCashLoan(data);
    setShowModal(false);
    loadLoans();
  };

  const askToggle = async (cashLoanId: string) => {
    const isConfirmed = await showConfirm('¿Estás seguro de eliminar el préstamo de este cliente?');
    if (!isConfirmed) return;
    await cashLoanApi.deleteCashLoan(cashLoanId);
    loadLoans();
  };

  const handleViewSchedule = (id: string) => {
    const prestamo = loans.find((l) => l.id === id);
    if (prestamo) setPrestamoSeleccionado(prestamo);
  };

  const clientesUnicos = (): SimpleClient[] => {
    const mapa = new Map<string, string>();
    loans.forEach((l) => {
      if (!mapa.has(l.clientId)) {
        mapa.set(l.clientId, l.clientName);
      }
    });
    return Array.from(mapa, ([id, name]) => ({ id, name }));
  };

  const loansFiltrados = clienteSeleccionado
    ? loans.filter((l) => l.clientId === clienteSeleccionado)
    : loans;

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Gestión de Préstamos</h1>

        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          Crear Préstamo
        </Button>
      </div>

      <div className="mb-4">
        <Label className="text-sm font-medium">Filtrar por cliente</Label>
        <ClientSearchInput
          clients={clientesUnicos()}
          selectedClientId={clienteSeleccionado}
          onSelect={setClienteSeleccionado}
          placeholder="Buscar cliente por nombre"
        />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <CashLoanTable
            loans={loansFiltrados}
            askToogle={askToggle}
            onViewSchedule={handleViewSchedule}
          />
        </div>
      )}

      <CashLoanFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
      <CashLoanScheduleModal
        open={!!prestamoSeleccionado}
        onClose={() => setPrestamoSeleccionado(null)}
        loan={prestamoSeleccionado}
      />
    </div>
  );
};

export default CashLoanListPage;
