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
  items: EquipmentFinancingItem[];
  onEdit: (item: EquipmentFinancingItem) => void;
  onDelete: (id: string) => void;
  onViewSchedule: (id: string) => void;
}

const EquipmentFinancingTable = ({ items, onEdit, onDelete, onViewSchedule }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAGADO':
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDIENTE':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'VENCIDO':
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Cliente</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Monto Total</TableHead>
            <TableHead>Inicial</TableHead>
            <TableHead>Monto Financiado</TableHead>
            <TableHead>Plazo</TableHead>
            <TableHead>Tasa Anual</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-foreground">{item.client.fullName}</TableCell>
              <TableCell className="text-foreground">{item.equipment.name}</TableCell>
              <TableCell className="text-foreground">S/ {item.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-foreground">S/ {item.downPayment.toFixed(2)}</TableCell>
              <TableCell className="text-foreground">S/ {item.financedAmount.toFixed(2)}</TableCell>
              <TableCell className="text-foreground">{item.term} meses</TableCell>
              <TableCell className="text-foreground">{item.annualRate}%</TableCell>
              <TableCell className="text-foreground">
                {formatDate(item.startDate)}
              </TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(item.status.name)}`}>
                  {getStatusText(item.status.name)}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onViewSchedule(item.id)}
                >
                  Cronograma
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => onEdit(item)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onDelete(item.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default EquipmentFinancingTable;
