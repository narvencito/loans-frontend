// components/EquipmentFinancingTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Pagination from '@/shared/components/Pagination';
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
import { formatDate } from "@/shared/utils/dateUtils";

interface Props {
  financings?: EquipmentFinancingItem[];
  isLoading?: boolean;
  onViewSchedule?: (id: string) => void;
  onEditSchedule?: (financing: EquipmentFinancingItem) => void;
}

export function EquipmentFinancingTable({ financings = [], isLoading, onViewSchedule, onEditSchedule }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!financings.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hay financiamientos para mostrar.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de solicitud</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {financings.map((financing) => (
          <TableRow key={financing.id}>
            <TableCell>{financing.client.fullName}</TableCell>
            <TableCell>{financing.equipment.name}</TableCell>
            <TableCell>S/ {financing.amount}</TableCell>
            <TableCell>{financing.status}</TableCell>
            <TableCell>{new Date(financing.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {onViewSchedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSchedule(financing.id)}
                  >
                    Ver cronograma
                  </Button>
                )}
                {onEditSchedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSchedule(financing)}
                  >
                    Editar cronograma
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
