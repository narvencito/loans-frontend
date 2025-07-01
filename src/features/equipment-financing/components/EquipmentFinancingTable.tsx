// components/EquipmentFinancingTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Props {
  financings: EquipmentFinancingItem[];
  onDelete: (id: string) => void;
  onViewSchedule: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (!isValid(date)) return '-';
  return format(date, 'dd/MM/yyyy', { locale: es });
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'APPROVED': 'bg-green-100 text-green-700',
    'REJECTED': 'bg-red-100 text-red-700',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'COMPLETED': 'bg-green-100 text-green-700',
    'CANCELLED': 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'PENDING': 'Pendiente',
    'APPROVED': 'Aprobado',
    'REJECTED': 'Rechazado',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado'
  };
  return labels[status] || status;
};

const EquipmentFinancingTable = ({ financings, onDelete, onViewSchedule }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Plazo (meses)</TableHead>
          <TableHead>Tasa de interés</TableHead>
          <TableHead>Fecha inicio</TableHead>
          <TableHead>Fecha fin</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {financings.map((financing) => (
          <TableRow key={financing.id}>
            <TableCell>{financing.code}</TableCell>
            <TableCell>{financing.clientName}</TableCell>
            <TableCell>{financing.equipmentName}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(financing.status)}>
                {getStatusLabel(financing.status)}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(financing.amount)}</TableCell>
            <TableCell>{financing.termInMonths}</TableCell>
            <TableCell>{financing.interestRate}%</TableCell>
            <TableCell>{formatDate(financing.startDate)}</TableCell>
            <TableCell>{formatDate(financing.endDate)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewSchedule(financing.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(financing.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {financings.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-8">
              No hay financiamientos registrados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EquipmentFinancingTable;
