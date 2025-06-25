import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EquipmentLoanItem } from '../api/equipment_loan_api';
import { formatDate } from '@/shared/utils/dateUtils';
import Pagination from '@/shared/components/Pagination';
import TruncatedWithTooltip from '@/components/common/TruncatedWithTooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EquipmentLoanStatusCode, getEquipmentLoanStatusName } from '../enums/equipment-loan-status.enum';

interface Props {
  loans: EquipmentLoanItem[];
  onEditSchedule: (loan: EquipmentLoanItem) => void;
}

const formatPrice = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return 'S/ 0.00';
  return `S/ ${amount.toFixed(2)}`;
};

const calculateDaysRemaining = (returnDate: string) => {
  const end = new Date(returnDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusStyle = (status: string, daysRemaining: number) => {
  if (status === 'Creado') return 'bg-yellow-100 text-yellow-700';
  if (status === 'Activo') {
    if (daysRemaining <= 3) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  }
  if (status === 'Finalizado') return 'bg-blue-100 text-blue-700';
  return 'bg-red-100 text-red-700';
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700';
    case 'activo':
      return 'bg-green-100 text-green-700';
    case 'completado':
      return 'bg-blue-100 text-blue-700';
    case 'vencido':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const EquipmentLoanTable = ({ loans, onEditSchedule }: Props) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(loans.length / pageSize);
  const paginatedLoans = loans.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Equipo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Monto Total</TableHead>
            <TableHead className="text-right">Pagado</TableHead>
            <TableHead className="text-right">Pendiente</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLoans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.equipmentName}</TableCell>
              <TableCell>{loan.clientName}</TableCell>
              <TableCell>{formatDate(loan.startDate)}</TableCell>
              <TableCell>{formatDate(loan.endDate)}</TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusClass(loan.status)}`}>
                  {loan.status}
                </span>
              </TableCell>
              <TableCell className="text-right">{formatPrice(loan.totalAmount)}</TableCell>
              <TableCell className="text-right">{formatPrice(loan.paidAmount)}</TableCell>
              <TableCell className="text-right">{formatPrice(loan.pendingAmount)}</TableCell>
              <TableCell className="text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate(`/admin/equipment-loans/${loan.id}`)}
                  >
                    Ver detalle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditSchedule(loan)}
                  >
                    Cronograma
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size: number) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default EquipmentLoanTable; 