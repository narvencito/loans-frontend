import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminCashLoanApi, CashLoanScheduleItem } from '../api/admin_cash_loans_api';

interface Props {
  open: boolean;
  onClose: () => void;
  loanId: string | null;
}

export function AdminCashLoanScheduleModal({ open, onClose, loanId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [installments, setInstallments] = useState<CashLoanScheduleItem[]>([]);

  useEffect(() => {
    if (open && loanId) {
      loadSchedule();
    }
  }, [open, loanId]);

  const loadSchedule = async () => {
    if (!loanId) return;
    
    setIsLoading(true);
    try {
      const data = await adminCashLoanApi.getSchedule(loanId);
      setInstallments(data);
    } catch (error) {
      console.error('Error al cargar cronograma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagado':
        return 'text-green-600';
      case 'pendiente':
        return 'text-yellow-600';
      case 'vencido':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cronograma de Pagos</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Cargando...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Cuota</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Capital</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((installment) => (
                <TableRow key={installment.number}>
                  <TableCell>{installment.number}</TableCell>
                  <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>S/ {installment.amount.toFixed(2)}</TableCell>
                  <TableCell>S/ {installment.interest.toFixed(2)}</TableCell>
                  <TableCell>S/ {installment.principal.toFixed(2)}</TableCell>
                  <TableCell>S/ {installment.balance.toFixed(2)}</TableCell>
                  <TableCell className={getStatusColor(installment.status)}>
                    {installment.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
} 