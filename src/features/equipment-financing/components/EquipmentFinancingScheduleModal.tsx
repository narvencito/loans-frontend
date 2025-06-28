import React, { useEffect, useState } from 'react';
import { EquipmentFinancingItem, equipmentFinancingApi } from '../api/equipment-financing-api';
import { generateSchedulePDF, ScheduleInstallmentItem } from '@/shared/utils/pdfUtils';
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
import { showConfirm, showInfo, showSuccess } from '@/shared/utils/global-dialog-utils';

interface FinancingStatus {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  financing: EquipmentFinancingItem | null;
  onFinancingUpdated?: () => void;
}

const EquipmentFinancingScheduleModal = ({ open, onClose, financing, onFinancingUpdated }: Props) => {
  const [deudaTotal, setDeudaTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && financing) {
      // Calcular la deuda total sumando los montos de las cuotas pendientes y vencidas
      const totalPendiente = financing.installments
        .filter(i => i.status === 'PENDING' || i.status === 'OVERDUE')
        .reduce((sum, i) => sum + i.amount, 0);
      setDeudaTotal(totalPendiente);
    }
  }, [open, financing]);

  const handlePayInstallment = async (installmentId: string) => {
    if (!financing) return;

    const hasOverdueInstallments = financing.installments.some((c) => c.status === 'OVERDUE');
    const overdueInstallment = financing.installments.find((c) => c.status === 'OVERDUE');
  
    if(overdueInstallment?.id !== installmentId){
      if (hasOverdueInstallments) {
        await showInfo('Cuotas vencidas', 'Existen cuotas vencidas. Debe pagar primero las cuotas vencidas.');
        return;
      }
    }

    const isConfirmed = await showConfirm('Pagar cuota', '¿Estás seguro de pagar esta cuota?');
    if (!isConfirmed) return;

    try {
      setLoading(true);
      await equipmentFinancingApi.payInstallment(financing.id, installmentId);
      
      // Generar y descargar el comprobante
      const blob = await equipmentFinancingApi.generatePaymentVoucher(financing.id, installmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_cuota_${installmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onFinancingUpdated?.();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAll = async () => {
    const isConfirmed = await showConfirm('Pagar deuda total', '¿Estás seguro de pagar la deuda total del financiamiento?');
    if (!isConfirmed || !financing) return;

    try {
      setLoading(true);
      await equipmentFinancingApi.payAllInstallments(financing.id);
      
      // Generar y descargar el certificado de no adeudo
      const blob = await equipmentFinancingApi.generateNoDebtCertificate(financing.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado_no_adeudo.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onFinancingUpdated?.();
    } catch (error) {
      console.error('Error al procesar el pago total:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string | undefined | null) => {
    if (!status) return 'Desconocido';
    
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Pagado';
      case 'PENDING':
        return 'Pendiente';
      case 'OVERDUE':
        return 'Vencido';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const hasPendingInstallments = financing?.installments.some((c) => c.status === 'PENDING' || c.status === 'OVERDUE');

  if (!financing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Cronograma de Pagos - Financiamiento de Equipo</DialogTitle>
        </DialogHeader>

        {/* Información general */}
        <div className="px-1 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Código:</span> {financing.code}
            </div>
            <div>
              <span className="font-semibold">Cliente:</span> {financing.client.fullName}
            </div>
            <div>
              <span className="font-semibold">Equipo:</span> {financing.equipment.name}
            </div>
            <div>
              <span className="font-semibold">Precio Total:</span> S/ {financing.totalAmount.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Inicial:</span> S/ {financing.downPayment.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Monto Financiado:</span> S/ {financing.financedAmount.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Tasa Anual:</span> {financing.annualRate}%
            </div>
            <div>
              <span className="font-semibold">Plazo:</span> {financing.term} meses
            </div>
            <div>
              <span className="font-semibold">Deuda Pendiente:</span> S/ {deudaTotal.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Estado:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(financing.status.name)}`}>
                {getStatusText(financing.status.name)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-auto mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-center">#</TableHead>
                  <TableHead>Fecha Vencimiento</TableHead>
                  <TableHead className="text-right">Cuota</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financing.installments.map((installment, index) => (
                  <TableRow key={installment.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{formatDate(installment.dueDate)}</TableCell>
                    <TableCell className="text-right">S/ {installment.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(installment.status)}`}>
                        {getStatusText(installment.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {(installment.status === 'PENDING' || installment.status === 'OVERDUE') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50"
                          onClick={() => handlePayInstallment(installment.id)}
                          disabled={loading}
                        >
                          {loading ? 'Procesando...' : 'Pagar'}
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
                financing.client.fullName,
                financing.id,
                financing.totalAmount,
                financing.annualRate,
                financing.term,
                financing.startDate,
                financing.installments.map((i, index) => ({
                  nro: index + 1,
                  fecha: formatDate(i.dueDate),
                  cuota: i.amount,
                  status: i.status
                }))
              )
            }
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            Descargar PDF
          </Button>
          {hasPendingInstallments && (
            <Button
              onClick={handlePayAll}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Pagar deuda total'}
            </Button>
          )}
          
          <Button 
            onClick={onClose} 
            variant="outline"
            className="hover:bg-gray-100"
            disabled={loading}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFinancingScheduleModal; 