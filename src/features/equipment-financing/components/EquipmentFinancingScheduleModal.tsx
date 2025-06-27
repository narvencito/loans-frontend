import React, { useEffect, useState } from 'react';
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
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
import { showConfirm, showInfo, showSuccess } from '@/shared/utils/global-dialog-utils';

interface InstallmentItem {
  id: string;
  nro: number;
  fecha: string;
  interes: number;
  capital: number;
  saldo: number;
  cuota: number;
  status: 'Pendiente' | 'Pagado' | 'Vencido';
}

interface Props {
  open: boolean;
  onClose: () => void;
  financing: EquipmentFinancingItem | null;
}

const EquipmentFinancingScheduleModal = ({ open, onClose, financing }: Props) => {
  const [cuotas, setCuotas] = useState<InstallmentItem[]>([]);
  const [deudaTotal, setDeudaTotal] = useState<number>(0);

  useEffect(() => {
    if (open && financing) {
      // TODO: Reemplazar con la llamada real a la API cuando esté disponible
      // equipmentFinancingApi.getSchedule(financing.id).then((schedule) => {
      //   setCuotas(schedule.cuotas);
      //   setDeudaTotal(schedule.deudaTotal);
      // });
    }
  }, [open, financing]);

  const handlePayInstallment = async (installmentId: string) => {
    const hasOverdueInstallments = cuotas.some((c) => c.status === 'Vencido');
    const find = cuotas.find((c) => c.status === 'Vencido');
  
    if(find?.id !== installmentId){
      if (hasOverdueInstallments) {
        await showInfo('Cuotas vencidas', 'Existen cuotas vencidas. Debe pagar primero las cuotas vencidas.');
        return;
      }
    }

    const isConfirmed = await showConfirm('Pagar cuota', '¿Estás seguro de pagar esta cuota?');
    if (!isConfirmed) return;

    // TODO: Reemplazar con la llamada real a la API cuando esté disponible
    // await equipmentFinancingApi.payInstallment(installmentId);
    // const schedule = await equipmentFinancingApi.getSchedule(financing!.id);
    // setCuotas(schedule.cuotas);
    // setDeudaTotal(schedule.deudaTotal);
    // const blob = await equipmentFinancingApi.generateVoucher(installmentId);
    // const fileURL = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    // window.open(fileURL);

    showSuccess("Pago exitoso", "Cuota pagada exitosamente.");
  };

  const handlePayAll = async () => {
    const isConfirmed = await showConfirm('Pagar deuda total', '¿Estás seguro de pagar la deuda total del financiamiento?');
    if (!isConfirmed || !financing) return;

    // TODO: Reemplazar con la llamada real a la API cuando esté disponible
    // await equipmentFinancingApi.payAllInstallments(financing.id);
    // const schedule = await equipmentFinancingApi.getSchedule(financing.id);
    // setCuotas(schedule.cuotas);
    // setDeudaTotal(schedule.deudaTotal);
    // await equipmentFinancingApi.generateVoucherForFinancing(financing.id);

    // const hasPending = schedule.cuotas.some(c => c.status === 'Pendiente');
    // if (!hasPending) {
    //   await equipmentFinancingApi.generateNoDebtCertificate(financing.id);
    // }

    showSuccess("Pago exitoso", "Pago total realizado exitosamente.");
  };

  const hasPendingInstallments = cuotas.some((c) => c.status === 'Pendiente');

  if (!financing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Cronograma de Pagos - Financiamiento de Equipo</DialogTitle>
        </DialogHeader>

        {/* Información general */}
        <div className="px-1 text-sm text-muted-foreground">
          Cliente: <strong>{financing.clientName}</strong><br />
          Equipo: <strong>{financing.equipmentName}</strong><br />
          Precio Total: <strong>S/ {financing.totalPrice}</strong> | Inicial: S/ {financing.downPayment}
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
                      {(c.status === 'Pendiente' || c.status === 'Vencido') && (
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
                financing.clientName,
                financing.id,
                financing.totalPrice,
                15, // TODO: Agregar tasa de interés al modelo
                12, // TODO: Agregar número de cuotas al modelo
                financing.createdAt,
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

export default EquipmentFinancingScheduleModal; 