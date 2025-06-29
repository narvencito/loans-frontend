import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CashLoanItem } from '../api/admin_cash_loans_api';
import { Badge } from '@/components/ui/badge';

interface Props {
  loans: CashLoanItem[];
  isLoading?: boolean;
  onViewSchedule: (id: string) => void;
  askToogle: (id: string) => void;
}

export function AdminCashLoanTable({ loans, isLoading, onViewSchedule, askToogle }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!loans.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hay préstamos para mostrar.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Plazo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de solicitud</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell>{loan.client.fullName}</TableCell>
            <TableCell>S/ {loan.amount.toFixed(2)}</TableCell>
            <TableCell>{loan.term} meses</TableCell>
            <TableCell>
              <Badge className={getStatusColor(loan.status.name)}>
                {loan.status.name}
              </Badge>
            </TableCell>
            <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSchedule(loan.id)}
                >
                  Ver cronograma
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => askToogle(loan.id)}
                >
                  Cambiar estado
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 