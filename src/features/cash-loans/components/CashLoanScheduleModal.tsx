import React, { useEffect, useState } from 'react';
import { CashLoanItem, cashLoanApi, InstallmentItem } from '../api/cash_loans_api';
import { generateSchedulePDF } from '@/shared/utils/pdfUtils';
import { formatDate } from '@/shared/utils/dateUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { confirmDialog } from '@/shared/utils/global-dialog';
import { cashInstallmentApi } from '@/features/cash-installment/api/cash_installments_api';
import { showConfirm, showInfo, showSuccess } from '@/shared/utils/global-dialog-utils';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: CashLoanItem | null;
}

export const CashLoanScheduleModal = ({ open, onClose, loan }: Props) => {
  const [cuotas, setCuotas] = useState<InstallmentItem[]>([]);
  const [deudaTotal, setDeudaTotal] = useState<number>(0);

  useEffect(() => {
    if (open && loan) {
      cashLoanApi.getSchedule(loan.id).then((schedule) => {
        setCuotas(schedule.cuotas);
        setDeudaTotal(schedule.deudaTotal);
      });
    }
  }, [open, loan]);

  const handlePayInstallment = async (installmentId: string) => {

    const hasOverdueInstallments = cuotas.some((c) => c.status === 'Vencido');
    const find = cuotas.find((c) => c.status = 'Vencido');
  
    if(find?.id  !=  installmentId){
      if (hasOverdueInstallments) {
        await showInfo( "informacion", 'Existen cuotas vencidas. Debe pagar primero las cuotas vencidas.');
        return;
      }
    }

    const isConfirmed = await showConfirm('¿Estás seguro de pagar esta cuota?');
    if (!isConfirmed) return;

    await cashInstallmentApi.payInstallment(installmentId);
    const schedule = await cashLoanApi.getSchedule(loan!.id);
    setCuotas(schedule.cuotas);
    setDeudaTotal(schedule.deudaTotal);

    const blob = await cashInstallmentApi.generateVoucher(installmentId);

    const fileURL = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    window.open(fileURL);

    showSuccess( "Exito", "Cuota Pagado exitosamente.");
  };

  const handlePayAll = async () => {
    const isConfirmed = await confirmDialog({
      title: 'Confirmar pago total',
      message: '¿Estás seguro de pagar la deuda total del préstamo?',
    });
    if (!isConfirmed || !loan) return;

    await cashLoanApi.payAllInstallments(loan.id);
    const schedule = await cashLoanApi.getSchedule(loan.id);
    setCuotas(schedule.cuotas);
    setDeudaTotal(schedule.deudaTotal);

    await cashLoanApi.generateVoucherForLoan(loan.id);

    const hasPending = schedule.cuotas.some(c => c.status === 'Pendiente');
    if (!hasPending) {
      await cashLoanApi.generateNoDebtCertificate(loan.id);
    }

    showSuccess("Exito", "Pago total realizado exitosamente.");
  };

  const hasPendingInstallments = cuotas.some((c) => c.status === 'Pendiente');

  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Cronograma de Pagos</DialogTitle>
        </DialogHeader>

        {/* Información general */}
        <div className="px-1 text-sm text-muted-foreground">
          Cliente: <strong>{loan.clientName}</strong><br />
          Fecha de Préstamo: <strong>{formatDate(loan.startDate)}</strong><br />
          Monto: <strong>S/ {loan.amount}</strong> | Tasa: {loan.rate}% | Cuotas: {loan.term}
          <p className="mt-2">
            <strong>Deuda total a pagar:</strong> S/ {deudaTotal.toFixed(2)}
          </p>
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-y-auto mt-4 px-1">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>#</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Interés</TableHead>
                  <TableHead>Capital</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuotas.map((c) => (
                  <TableRow key={c.nro}>
                    <TableCell>{c.nro}</TableCell>
                    <TableCell>{c.fecha}</TableCell>
                    <TableCell>S/ {c.interes}</TableCell>
                    <TableCell>S/ {c.capital}</TableCell>
                    <TableCell>S/ {c.saldo.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">S/ {c.cuota}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        c.status === 'Pagado' ? 'bg-green-100 text-green-700' :
                        c.status === 'Vencido' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(c.status === 'Pendiente' || c.status === 'Vencido'  )&& (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handlePayInstallment(c.id)}
                        >
                          Pagar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <Button
            onClick={() =>
              generateSchedulePDF(
                loan.clientName,
                loan.id,
                loan.amount,
                loan.rate,
                loan.term,
                loan.startDate,
                cuotas
              )
            }
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Descargar PDF
          </Button>
          {hasPendingInstallments && (
              <Button
                onClick={handlePayAll}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Pagar deuda total
              </Button>
            )}
          
          <Button onClick={onClose} className="hover:bg-gray-400">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashLoanScheduleModal;
