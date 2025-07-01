import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EquipmentFinancingItem } from "../api/equipment-financing-api";
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

interface EquipmentFinancingDetailModalProps {
  financing: EquipmentFinancingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy', { locale: es });
};

const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'PAGADO':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'VENCIDO':
      return 'bg-red-100 text-red-800 border border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
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

  const handlePayInstallment = async (installmentId: string) => {
    const confirmed = await showConfirm(
      '¿Estás seguro de realizar el pago de esta cuota?',
      'Esta acción no se puede deshacer'
    );
    if (!confirmed) return;

    try {
      showLoader();
      await equipmentFinancingApi.payInstallment(financing.id, installmentId, { notes: paymentNotes });
      showSuccess('Pago realizado correctamente', 'El pago se ha procesado exitosamente');
      onUpdate();
    } catch (error) {
      console.error('Error al realizar el pago:', error);
    } finally {
      hideLoader();
    }
  };

  const handlePayTotal = async () => {
    const confirmed = await showConfirm(
      '¿Estás seguro de realizar el pago total del financiamiento?',
      'Esta acción no se puede deshacer'
    );
    if (!confirmed) return;

    try {
      showLoader();
      await equipmentFinancingApi.payAll(financing.id, { notes: paymentNotes });
      showSuccess('Pago total realizado correctamente', 'El pago total se ha procesado exitosamente');
      onUpdate();
    } catch (error) {
      console.error('Error al realizar el pago total:', error);
    } finally {
      hideLoader();
    }
  };

  const handleDownloadSchedule = async () => {
    try {
      showLoader();
      const blob = await equipmentFinancingApi.generateVoucher(financing.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el cronograma:', error);
    } finally {
      hideLoader();
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      showLoader();
      const blob = await equipmentFinancingApi.generateNoDebtCertificate(financing.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
    } finally {
      hideLoader();
    }
  };

  const allInstallmentsPaid = financing.installments.every(i => i.status.code === 'Pagado');

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
                  <p className="font-medium">{financing.equipment.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{financing.equipment.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">{financing.client.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documento</p>
                  <p className="font-medium">{financing.client.document}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{financing.client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{financing.client.phone}</p>
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
                  <p className="font-medium">{formatCurrency(financing.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cuota Inicial</p>
                  <p className="font-medium">{formatCurrency(financing.downPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Financiado</p>
                  <p className="font-medium">{formatCurrency(financing.financedAmount)}</p>
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
                  <p className="font-medium">{formatDate(financing.startDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma de Pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Cronograma de Pagos</span>
                <div className="space-x-2">
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleDownloadSchedule}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Cronograma
                  </Button>
                  {allInstallmentsPaid && (
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleDownloadCertificate}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Descargar Certificado
                    </Button>
                  )}
                </div>
              </CardTitle>
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
                        {formatDate(installment.dueDate)}
                      </TableCell>
                      <TableCell>{formatCurrency(installment.amount)}</TableCell>
                      <TableCell>{formatCurrency(installment.capital)}</TableCell>
                      <TableCell>{formatCurrency(installment.interest)}</TableCell>
                      <TableCell>{formatCurrency(installment.balance)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={getStatusColor(installment.status.code)}
                        >
                          {installment.status.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {installment.status.code === 'Pendiente' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handlePayInstallment(installment.id)}
                          >
                            Pagar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Botón de pago total */}
              {financing.installments.some(i => i.status.code === 'Pendiente') && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handlePayTotal}
                  >
                    Pagar Total
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 