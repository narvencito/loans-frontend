import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Props {
  open: boolean;
  onClose: () => void;
  financing: EquipmentFinancingItem | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'APPROVED': 'bg-green-100 text-green-700',
    'REJECTED': 'bg-red-100 text-red-700',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'COMPLETED': 'bg-gray-100 text-gray-700',
    'CANCELLED': 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    'PENDING': 'Pendiente',
    'APPROVED': 'Aprobado',
    'REJECTED': 'Rechazado',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado'
  };
  return texts[status] || status;
};

const EquipmentFinancingScheduleModal = ({ open, onClose, financing }: Props) => {
  if (!financing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cronograma de Financiamiento</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{financing.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Equipo</p>
            <p className="font-medium">{financing.equipmentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monto</p>
            <p className="font-medium">{formatCurrency(financing.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tasa de interés</p>
            <p className="font-medium">{financing.interestRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha inicio</p>
            <p className="font-medium">
              {format(new Date(financing.startDate), 'dd/MM/yyyy', { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha fin</p>
            <p className="font-medium">
              {format(new Date(financing.endDate), 'dd/MM/yyyy', { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <Badge className={getStatusColor(financing.status)}>
              {getStatusText(financing.status)}
            </Badge>
          </div>
        </div>

        {/* Aquí irá el cronograma de pagos cuando esté disponible en la API */}
        <div className="text-center text-gray-500 py-4">
          El cronograma de pagos estará disponible próximamente
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFinancingScheduleModal; 