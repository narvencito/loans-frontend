import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EquipmentLoanItem, EquipmentLoanSchedule, equipmentLoanApi } from '../api/equipment_loan_api';
import { showSuccess } from '@/shared/utils/global-dialog-utils';
import { formatDate } from '@/shared/utils/dateUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: EquipmentLoanItem | null;
  onUpdate: () => void;
}

const EquipmentLoanScheduleModal = ({ open, onClose, loan, onUpdate }: Props) => {
  const [schedule, setSchedule] = useState<EquipmentLoanSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && loan) {
      setIsLoading(true);
      equipmentLoanApi.getSchedule(loan.id)
        .then(data => setSchedule(data))
        .catch(error => console.error('Error al cargar cronograma:', error))
        .finally(() => setIsLoading(false));
    } else {
      setSchedule(null);
    }
  }, [open, loan]);

  if (!loan || !schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Cronograma de Préstamo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del préstamo */}
          <div className="text-sm space-y-2">
            <div className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Información del Cliente</h3>
              <p>Cliente: <strong>{schedule.client.name}</strong></p>
            </div>

            <div className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Información del Equipo</h3>
              <p>Equipo: <strong>{schedule.equipment.name}</strong></p>
              <p className="text-muted-foreground">{schedule.equipment.description}</p>
              <p>Precio de venta: <strong>S/ {schedule.equipment.salePrice.toFixed(2)}</strong></p>
            </div>

            <div className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Detalles del Préstamo</h3>
              <p>Estado: <strong>{schedule.status}</strong></p>
              <p>Tarifa diaria: <strong>S/ {schedule.dailyRate.toFixed(2)}</strong></p>
              <p>Días totales: <strong>{schedule.totalDays} días</strong></p>
              {schedule.delayDays > 0 && (
                <p className="text-red-600">
                  Días de retraso: <strong>{schedule.delayDays} días</strong>
                </p>
              )}
            </div>

            <div className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Fechas</h3>
              <p>Entrega: <strong>{schedule.deliveryDate ? formatDate(schedule.deliveryDate) : '-'}</strong></p>
              <p>Devolución: <strong>{schedule.returnDate ? formatDate(schedule.returnDate) : '-'}</strong></p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Costos</h3>
              <p>Monto base: <strong>S/ {schedule.baseAmount.toFixed(2)}</strong></p>
              {schedule.penaltyAmount > 0 && (
                <p className="text-red-600">
                  Penalidad: <strong>S/ {schedule.penaltyAmount.toFixed(2)}</strong>
                </p>
              )}
              <p className="text-lg font-semibold mt-1">
                Monto total: S/ {schedule.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentLoanScheduleModal; 