import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EquipmentFinancing } from "../types/equipment-financing.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";
import { pdfUtils } from "@/shared/utils/pdfUtils";
import { equipmentFinancingApi } from "../api/equipment-financing-api";
import { showConfirm, showSuccess } from "@/shared/utils/global-dialog-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLoaderStore } from "@/shared/store/loader.store";
import { apiRequest } from "@/shared/utils/apiHelper";

interface EquipmentFinancingDetailModalProps {
  financing: EquipmentFinancing | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

export default function EquipmentFinancingDetailModal({
  financing,
  isOpen,
  onClose,
  onUpdate
}: EquipmentFinancingDetailModalProps) {
  const [paymentNotes, setPaymentNotes] = useState('');
  const { show: showLoader, hide: hideLoader } = useLoaderStore();
  
  if (!financing) return null;

  const handleDownloadSchedule = async () => {
    const cuotas = financing.installments.map(installment => ({
      nro: installment.number,
      fecha: format(new Date(installment.dueDate), 'dd/MM/yyyy', { locale: es }),
      cuota: installment.amount,
      interes: installment.interest,
      capital: installment.capital,
      saldo: installment.balance,
      status: installment.status.code
    }));

    pdfUtils.generateSchedulePDF(
      financing.client.fullName,
      financing.id,
      financing.totalAmount,
      financing.annualRate,
      financing.term,
      financing.startDate,
      cuotas
    );
  };

  const handlePayInstallment = async (installmentId: string) => {
    const isConfirmed = await showConfirm('¿Estás seguro de realizar el pago de esta cuota?', 'Confirmar pago');

    if (!isConfirmed) return;

    const { show: showLoader, hide: hideLoader } = useLoaderStore.getState();

    try {
      showLoader();
      await equipmentFinancingApi.payInstallment(financing.id, installmentId, {
        notes: paymentNotes || undefined
      });
      const voucherBlob = await equipmentFinancingApi.generateVoucher(installmentId);
      
      // Abrir el voucher en una nueva pestaña
      const fileURL = window.URL.createObjectURL(new Blob([voucherBlob], { type: 'application/pdf' }));
      window.open(fileURL);
      
      // Verificar si quedan cuotas pendientes
      const hasPendingInstallments = financing.installments.some(
        i => i.status.code === 'Pendiente' && i.id !== installmentId
      );
      
      if (!hasPendingInstallments) {
        const certificateBlob = await equipmentFinancingApi.generateNoDebtCertificate(financing.id);
        const certificateURL = window.URL.createObjectURL(new Blob([certificateBlob], { type: 'application/pdf' }));
        window.open(certificateURL);
      }

      showSuccess('Éxito', 'Pago realizado correctamente');
      setPaymentNotes(''); // Limpiar las notas después del pago
      onUpdate();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    } finally {
      hideLoader();
    }
  };

  const handlePayTotal = async () => {
    const isConfirmed = await showConfirm('¿Estás seguro de realizar el pago total del financiamiento?', 'Confirmar pago total');

    if (!isConfirmed) return;

    const { show: showLoader, hide: hideLoader } = useLoaderStore.getState();

    try {
      showLoader();
      await equipmentFinancingApi.payAll(financing.id, {
        notes: paymentNotes || undefined
      });
      const voucherBlob = await equipmentFinancingApi.generateVoucher(financing.id);
      const certificateBlob = await equipmentFinancingApi.generateNoDebtCertificate(financing.id);
      
      // Abrir los documentos en nuevas pestañas
      const voucherURL = window.URL.createObjectURL(new Blob([voucherBlob], { type: 'application/pdf' }));
      const certificateURL = window.URL.createObjectURL(new Blob([certificateBlob], { type: 'application/pdf' }));
      window.open(voucherURL);
      window.open(certificateURL);
      
      showSuccess('Éxito', 'Pago total realizado correctamente');
      setPaymentNotes(''); // Limpiar las notas después del pago
      onUpdate();
    } catch (error) {
      console.error('Error al procesar el pago total:', error);
    } finally {
      hideLoader();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Financiamiento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Equipo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Código</p>
                  <p className="font-medium">{financing.equipment?.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{financing.equipment?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Financiamiento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Financiamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Monto Total</p>
                  <p className="font-medium">{formatAmount(financing.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cuota Inicial</p>
                  <p className="font-medium">{formatAmount(financing.downPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Financiado</p>
                  <p className="font-medium">{formatAmount(financing.financedAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasa Anual</p>
                  <p className="font-medium">{financing.annualRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plazo</p>
                  <p className="font-medium">{financing.term} meses</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Inicio</p>
                  <p className="font-medium">{format(new Date(financing.startDate), 'dd/MM/yyyy', { locale: es })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma de Pagos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Cronograma de Pagos</CardTitle>
              <div className="flex gap-2">
                {financing.installments.some(i => i.status.code === 'Pendiente') && (
                  <Button 
                    variant="default"
                    onClick={handlePayTotal}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pagar Total
                  </Button>
                )}
                <Button 
                  variant="default"
                  onClick={handleDownloadSchedule}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Descargar Cronograma
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Campo de notas para el pago */}
              {financing.installments.some(i => i.status.code === 'Pendiente') && (
                <div className="mb-4">
                  <Label htmlFor="paymentNotes">Notas de pago (opcional)</Label>
                  <Input
                    id="paymentNotes"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Ingrese notas adicionales para el pago"
                    className="mt-1"
                  />
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Fecha de Vencimiento</TableHead>
                    <TableHead>Cuota</TableHead>
                    <TableHead>Capital</TableHead>
                    <TableHead>Interés</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...financing.installments]
                    .sort((a, b) => a.number - b.number)
                    .map((installment) => (
                    <TableRow key={installment.id}>
                      <TableCell>{installment.number}</TableCell>
                      <TableCell>
                        {format(new Date(installment.dueDate), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{formatAmount(installment.amount)}</TableCell>
                      <TableCell>{formatAmount(installment.capital)}</TableCell>
                      <TableCell>{formatAmount(installment.interest)}</TableCell>
                      <TableCell>{formatAmount(installment.balance)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            installment.status.code === 'Pendiente' 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : installment.status.code === 'Pagado'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }
                        >
                          {installment.status.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {installment.status.code === 'Pendiente' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePayInstallment(installment.id)}
                            className="flex items-center gap-1"
                          >
                            <CreditCard className="h-3 w-3" />
                            Pagar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 