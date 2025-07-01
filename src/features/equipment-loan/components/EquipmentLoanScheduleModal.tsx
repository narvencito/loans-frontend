import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentLoanItem } from '../api/equipment_loan_api';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EquipmentLoanStatusCode } from '../enums/equipment-loan-status.enum';
import { formatCurrency } from "@/shared/utils/currencyUtils";
import { ChangeStatusModal } from './ChangeStatusModal';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: EquipmentLoanItem | null;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (!isValid(date)) return '-';
  return format(date, 'dd/MM/yyyy', { locale: es });
};

const getStatusColor = (statusCode: string): string => {
  switch (statusCode) {
    case EquipmentLoanStatusCode.CREATED:
      return 'bg-yellow-100 text-yellow-700';
    case EquipmentLoanStatusCode.DELIVERED:
      return 'bg-green-100 text-green-700';
    case EquipmentLoanStatusCode.OVERDUE:
      return 'bg-red-100 text-red-700';
    case EquipmentLoanStatusCode.RETURNED:
      return 'bg-blue-100 text-blue-700';
    case EquipmentLoanStatusCode.CANCELLED:
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const EquipmentLoanScheduleModal = ({ 
  open, 
  onClose, 
  loan,
}: Props) => {
  const [changeStatusAction, setChangeStatusAction] = useState<'deliver' | 'return' | 'cancel' | null>(null);

  if (!loan) return null;

  const handleChangeStatusClose = () => {
    setChangeStatusAction(null);
    onClose();
  };

  const renderStatusActions = () => {
    switch (loan.status.code) {
      case EquipmentLoanStatusCode.CREATED:
        return (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setChangeStatusAction('cancel')}
            >
              Cancelar Préstamo
            </Button>
            <Button
              variant="secondary"
              onClick={() => setChangeStatusAction('deliver')}
            >
              Entregar Equipo
            </Button>
          </div>
        );

      case EquipmentLoanStatusCode.DELIVERED:
      case EquipmentLoanStatusCode.OVERDUE:
        return (
          <Button
            variant="secondary"
            onClick={() => setChangeStatusAction('return')}
          >
            Devolver Equipo
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle del Préstamo</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6 p-4">
              {/* Información del Cliente */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p>{loan.client.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p>{loan.client.document}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{loan.client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p>{loan.client.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información del Equipo */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del Equipo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Equipo</p>
                    <p>{loan.equipment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Descripción</p>
                    <p>{loan.equipment.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tarifa Diaria</p>
                    <p>{formatCurrency(loan.dailyRate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio de Venta</p>
                    <p>{formatCurrency(loan.equipment.salePrice)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información del Préstamo */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del Préstamo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <Badge className={getStatusColor(loan.status.code)}>
                      {loan.status.name}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto Total</p>
                    <p>{formatCurrency(loan.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto Inicial</p>
                    <p>{formatCurrency(loan.downPayment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto Pendiente</p>
                    <p>{formatCurrency(loan.remainingAmount)}</p>
                  </div>
                  {loan.status.code !== EquipmentLoanStatusCode.CREATED && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Entrega</p>
                        <p>{formatDate(loan.deliveryDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Devolución</p>
                        <p>{formatDate(loan.returnDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Días Pagados</p>
                        <p>{loan.paidDays}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Acciones */}
              <div className="flex justify-end">
                {renderStatusActions()}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {changeStatusAction && (
        <ChangeStatusModal
          open={true}
          onClose={handleChangeStatusClose}
          loanId={loan.id}
          action={changeStatusAction}
        />
      )}
    </>
  );
};

export default EquipmentLoanScheduleModal; 