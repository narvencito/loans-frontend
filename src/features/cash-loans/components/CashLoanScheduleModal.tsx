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
import { confirmDialog } from '@/shared/utils/global-dialog';
import { cashInstallmentApi } from '@/features/cash-installment/api/cash_installments_api';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: CashLoanItem | null;
}

const CashLoanScheduleModal = ({ open, onClose, loan }: Props) => {
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

  if (!open || !loan) return null;

  const handlePayInstallment = async (installmentId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Confirmar pago',
      message: '¿Estás seguro de pagar esta cuota?',
    });
  
    if (!isConfirmed) return;
  
    await cashInstallmentApi.payInstallment(installmentId);
    const schedule = await cashLoanApi.getSchedule(loan!.id);
    setCuotas(schedule.cuotas);
    setDeudaTotal(schedule.deudaTotal);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Cronograma de Pagos</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
          </div>
          <p className="text-sm text-muted-foreground">
            Cliente: <strong>{loan.clientName}</strong><br />
            Fecha de Préstamo: <strong>{formatDate(loan.startDate)}</strong><br />
            Monto: <strong>S/ {loan.amount}</strong> | Tasa: {loan.rate}% | Cuotas: {loan.term}
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            <strong>Deuda total a pagar:</strong> S/ {deudaTotal.toFixed(2)}
          </p>
        </div>

        {/* Tabla scrollable */}
        <div className="flex-1 overflow-y-auto px-6 mt-4">
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
                      {c.status === 'Pendiente' && (
                        <Button
                          size="sm"
                          className='w-full sm:w-auto'
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

        {/* Footer fijo */}
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
          <Button
            variant="secondary"
            onClick={onClose}
            className="hover:bg-gray-400"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashLoanScheduleModal;
