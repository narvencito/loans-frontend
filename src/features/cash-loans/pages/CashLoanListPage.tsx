import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CashLoanTable } from '../components/CashLoanTable';
import { CashLoanFormModal } from '../components/CashLoanFormModal';
import { CashLoanScheduleModal } from '../components/CashLoanScheduleModal';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import CashLoanStatusSelect from '@/features/cash-loan-status/components/CashLoanStatusSelect';
import { cashLoanApi, type CashLoanItem } from '../api/cash_loans_api';
import { useDialogStore } from '@/shared/utils/global-dialog';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

export default function CashLoanListPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState<CashLoanItem[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const loadLoans = async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await cashLoanApi.getCashLoansFiltered(filters);
      setLoans(data);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filters: { clientId?: string; statusId?: string } = {};
    if (selectedClientId) filters.clientId = selectedClientId;
    if (selectedStatus) filters.statusId = selectedStatus;
    loadLoans(filters);
  };

  const handleClearFilters = () => {
    setSelectedClientId(null);
    setSelectedStatus('');
    loadLoans();
  };

  const handleViewSchedule = (loanId: string) => {
    setSelectedLoanId(loanId);
    setShowScheduleModal(true);
  };

  const handleToggleStatus = async (loanId: string) => {
    const confirmed = await showConfirm("Confirmacion", '¿Estás seguro de cambiar el estado del préstamo?');
    if (!confirmed) return;

    try {
      await cashLoanApi.deleteCashLoan(loanId);
      loadLoans();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Préstamos Monetarios</h1>
        <Button onClick={() => setShowFormModal(true)}>Nuevo Préstamo</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AsyncClientCombobox
              selectedClientId={selectedClientId}
              onSelect={setSelectedClientId}
              label="Cliente"
            />
            <CashLoanStatusSelect
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || '')}
              label="Estado"
            />
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch}>Buscar</Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <CashLoanTable
            loans={loans}
            isLoading={isLoading}
            onViewSchedule={handleViewSchedule}
            askToogle={handleToggleStatus}
          />
        </CardContent>
      </Card>

      {showFormModal && (
        <CashLoanFormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          onCreate={() => {
            setShowFormModal(false);
            loadLoans();
          }}
        />
      )}

      {showScheduleModal && selectedLoanId && (
        <CashLoanScheduleModal
          open={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          loan={loans.find(loan => loan.id === selectedLoanId) || null}
        />
      )}
    </div>
  );
}
