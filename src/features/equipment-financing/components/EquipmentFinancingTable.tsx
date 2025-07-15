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
import { Eye, Trash2, Edit } from "lucide-react";
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { EquipmentFinancingStatusCode, EquipmentFinancingStatusLabel } from '../enums/equipment-financing-status.enum';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlueButton, RedButton } from "@/components/common/ColorButtons";

interface Props {
  financings: EquipmentFinancingItem[];
  onEdit: (item: EquipmentFinancingItem) => void;
  onDelete: (id: string) => void;
  onViewSchedule: (id: string) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (!isValid(date)) return 'Fecha inválida';
  return format(date, 'dd/MM/yyyy', { locale: es });
};

const getStatusColor = (status: string): string => {
  const statusCode = status as EquipmentFinancingStatusCode;
  switch (statusCode) {
    case EquipmentFinancingStatusCode.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case EquipmentFinancingStatusCode.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case EquipmentFinancingStatusCode.CANCELLED:
      return 'bg-red-100 text-red-800 border border-red-300';
    case EquipmentFinancingStatusCode.VOIDED:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
    case EquipmentFinancingStatusCode.COMPLETED:
      return 'bg-green-100 text-green-800 border border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const EquipmentFinancingTable = ({ financings, onEdit, onDelete, onViewSchedule }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Monto Total</TableHead>
          <TableHead>Cuota Inicial</TableHead>
          <TableHead>Monto Financiado</TableHead>
          <TableHead>Tasa Anual</TableHead>
          <TableHead>Plazo (meses)</TableHead>
          <TableHead>Fecha inicio</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {financings.map((financing) => (
          <TableRow key={financing.id}>
            <TableCell>{financing.equipment.code}</TableCell>
            <TableCell>{financing.client.fullName}</TableCell>
            <TableCell>{financing.equipment.name}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(financing.status.name)}>
                {EquipmentFinancingStatusLabel[financing.status.name as EquipmentFinancingStatusCode] || financing.status.name}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(financing.totalAmount)}</TableCell>
            <TableCell>{formatCurrency(financing.downPayment)}</TableCell>
            <TableCell>{formatCurrency(financing.financedAmount)}</TableCell>
            <TableCell>{financing.annualRate}%</TableCell>
            <TableCell>{financing.term}</TableCell>
            <TableCell>{formatDate(financing.startDate)}</TableCell>
            <TableCell className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BlueButton
                      size="icon"
                      onClick={() => onViewSchedule(financing.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </BlueButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver Cronograma</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <BlueButton
                      size="icon"
                      onClick={() => onEdit(financing)}
                    >
                      <Edit className="h-4 w-4" />
                    </BlueButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <RedButton
                      size="icon"
                      onClick={() => onDelete(financing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </RedButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
        {financings.length === 0 && (
          <TableRow>
            <TableCell colSpan={11} className="text-center py-8">
              No hay financiamientos registrados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EquipmentFinancingTable;
