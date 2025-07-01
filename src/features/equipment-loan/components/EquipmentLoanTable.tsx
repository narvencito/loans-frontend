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
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EquipmentLoanItem } from '../api/equipment_loan_api';
import { EquipmentLoanStatusCode, EquipmentLoanStatusLabel } from '../enums/equipment-loan-status.enum';
import { formatCurrency } from "@/shared/utils/currencyUtils";
import Pagination from '@/shared/components/Pagination';

interface EquipmentLoanTableProps {
  loans: EquipmentLoanItem[];
  onViewSchedule: (loan: EquipmentLoanItem) => void;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const getStatusBadgeColor = (statusCode: string) => {
  switch (statusCode) {
    case EquipmentLoanStatusCode.CREATED:
      return "bg-yellow-500";
    case EquipmentLoanStatusCode.DELIVERED:
      return "bg-green-500";
    case EquipmentLoanStatusCode.OVERDUE:
      return "bg-red-500";
    case EquipmentLoanStatusCode.RETURNED:
      return "bg-blue-500";
    case EquipmentLoanStatusCode.CANCELLED:
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const EquipmentLoanTable = ({ loans, onViewSchedule, total, page, limit, onPageChange }: EquipmentLoanTableProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Monto Total</TableHead>
              <TableHead>Monto Pendiente</TableHead>
              <TableHead>Fecha de Entrega</TableHead>
              <TableHead>Fecha de Devolución</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.client.fullName}</TableCell>
                <TableCell>{loan.equipment.name}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(loan.status.code)}>
                    {loan.status.name}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(loan.totalAmount)}</TableCell>
                <TableCell>{formatCurrency(loan.remainingAmount)}</TableCell>
                <TableCell>
                  {loan.deliveryDate
                    ? format(new Date(loan.deliveryDate), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  {loan.returnDate
                    ? format(new Date(loan.returnDate), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSchedule(loan)}
                  >
                    Ver Cronograma
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        pageSize={limit}
        onPageChange={onPageChange}
        onPageSizeChange={() => {}}
      />
    </div>
  );
};

export default EquipmentLoanTable; 