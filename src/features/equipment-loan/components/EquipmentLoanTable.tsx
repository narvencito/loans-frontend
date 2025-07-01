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
import RowApp from '@/shared/components/RowApp';
import { Download, FileText, Wallet } from 'lucide-react';

interface EquipmentLoanTableProps {
  loans: EquipmentLoanItem[];
  onViewSchedule: (loan: EquipmentLoanItem) => void;
  onPayInstallment?: (loan: EquipmentLoanItem) => void;
  onPayTotal?: (loan: EquipmentLoanItem) => void;
  onDownloadSchedule?: (loan: EquipmentLoanItem) => void;
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

export const EquipmentLoanTable = ({ 
  loans, 
  onViewSchedule, 
  onPayInstallment,
  onPayTotal,
  onDownloadSchedule,
  total, 
  page, 
  limit, 
  onPageChange 
}: EquipmentLoanTableProps) => {
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
              <TableHead className="text-right">Acciones</TableHead>
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
                  <RowApp gap={2} className="justify-end">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onViewSchedule(loan)}
                      title="Ver Cronograma"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {onPayInstallment && loan.status.code !== EquipmentLoanStatusCode.CANCELLED && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onPayInstallment(loan)}
                        title="Pagar Cuota"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                    )}
                    {onPayTotal && loan.status.code !== EquipmentLoanStatusCode.CANCELLED && loan.remainingAmount > 0 && (
                      <Button
                        size="icon"
                        variant="default"
                        onClick={() => onPayTotal(loan)}
                        title="Pago Total"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                    )}
                    {onDownloadSchedule && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onDownloadSchedule(loan)}
                        title="Descargar Cronograma"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </RowApp>
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