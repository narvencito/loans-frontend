import React, { useEffect, useState } from 'react';
import { cashLoanApi, CashLoanItem, CreateCashLoanDto } from '../api/cash_loans_api';
import CashLoanTable from '../components/CashLoanTable';
import CashLoanFormModal from '../components/CashLoanFormModal';
import CashLoanScheduleModal from '../components/CashLoanScheduleModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import CashLoanStatusSelect from '@/features/cash-loan-status/components/CashLoanStatusSelect';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';

const AdminCashLoanListPage = () => {
  const [loans, setLoans] = useState<CashLoanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<CashLoanItem | null>(null);

  // Filtros visuales
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);

  const buscarPrestamos = async () => {
    setLoading(true);
    const data = await cashLoanApi.getCashLoansFiltered({
      clientId: clienteFiltro ?? undefined,
      statusId: estadoFiltro ?? undefined,
    });
    setLoans(data);
    setLoading(false);
  };

  const handleCreate = async (data: CreateCashLoanDto) => {
    await cashLoanApi.createCashLoan(data);
    setShowModal(false);
    buscarPrestamos();
  };

  const askToggle = async (cashLoanId: string) => {
    const isConfirmed = await showConfirm('¿Estás seguro de eliminar el préstamo de este cliente?');
    if (!isConfirmed) return;
    await cashLoanApi.deleteCashLoan(cashLoanId);
    buscarPrestamos();
  };

  const handleViewSchedule = (id: string) => {
    const prestamo = loans.find((l) => l.id === id);
    if (prestamo) setPrestamoSeleccionado(prestamo);
  };

  useEffect(() => {
    buscarPrestamos();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Gestión de Préstamos</h1>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mb-6">
        {/* Filtros a la izquierda */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="w-full sm:w-64">
            <AsyncClientCombobox
              selectedClientId={clienteFiltro}
              onSelect={setClienteFiltro}
              label="Filtrar por cliente"
            />
          </div>

          <div className="w-full sm:w-48">
            <CashLoanStatusSelect
              value={estadoFiltro}
              onChange={setEstadoFiltro}
              label="Filtrar por estado"
            />
          </div>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={buscarPrestamos}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Buscar
          </Button>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            Crear Préstamo
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <CashLoanTable
            loans={loans}
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

export default AdminCashLoanListPage;
