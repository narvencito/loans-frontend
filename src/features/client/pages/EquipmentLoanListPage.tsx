import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Info, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { clientLoansApi } from '../api/client_loans_api';
import { EquipmentLoanItem } from '@/features/equipment-loan/api/equipment_loan_api';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import EquipmentLoanDetailModal from '@/features/equipment-loan/components/EquipmentLoanDetailModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChangeStatusModal } from '@/features/equipment-loan/components/ChangeStatusModal';

const StatusColors: Record<string, string> = {
  'created': 'bg-yellow-100 text-yellow-700',
  'delivered': 'bg-green-100 text-green-700',
  'overdue': 'bg-red-100 text-red-700',
  'returned': 'bg-blue-100 text-blue-700',
  'cancelled': 'bg-gray-100 text-gray-700'
};

export default function EquipmentLoanListPage() {
  const [loans, setLoans] = useState<EquipmentLoanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<EquipmentLoanItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loanToCancel, setLoanToCancel] = useState<EquipmentLoanItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const response = await clientLoansApi.getMyEquipmentLoans();
      setLoans(response);
    } catch (error) {
      console.error('Error loading loans:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (loan: EquipmentLoanItem) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  const handleCancelLoan = (loan: EquipmentLoanItem) => {
    setLoanToCancel(loan);
  };

  const handleCancelModalClose = () => {
    setLoanToCancel(null);
    loadLoans(); // Recargar la lista después de cancelar
  };

  const handleNewRequest = () => {
    navigate('/client/requests', { 
      state: { 
        requestType: 'equipment-loan',
        defaultValues: {
          type: 'equipment-loan'
        }
      } 
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si hay préstamos en estado "created"
  const hasCreatedLoans = loans.some(loan => loan.status.code === 'created');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Préstamos de Equipo</h1>
      </div>

      {hasCreatedLoans && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-700">
            ¡Tienes equipos listos para recoger! Acércate a nuestras oficinas con tu DNI para realizar la entrega.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto Total</TableHead>
                <TableHead>Monto Inicial</TableHead>
                <TableHead>Monto Pendiente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow 
                  key={loan.id}
                  className={`hover:bg-gray-100 ${loan.status.code === 'created' ? 'bg-blue-50' : ''}`}
                >
                  <TableCell>{loan.id.slice(0, 8)}</TableCell>
                  <TableCell>{loan.equipment?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={StatusColors[loan.status.code]}>
                      {loan.status.name}
                    </Badge>
                    {loan.status.code === 'created' && (
                      <p className="text-xs text-blue-600 mt-1">
                        Listo para recoger
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(loan.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(loan.downPayment)}</TableCell>
                  <TableCell>{formatCurrency(loan.remainingAmount)}</TableCell>
                  <TableCell>
                    {loan.createdAt
                      ? format(new Date(loan.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(loan)}
                        className="hover:bg-gray-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {loan.status.code === 'created' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelLoan(loan)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">No tienes préstamos de equipo</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EquipmentLoanDetailModal
        loan={selectedLoan}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLoan(null);
        }}
      />

      {loanToCancel && (
        <ChangeStatusModal
          open={true}
          onClose={handleCancelModalClose}
          loanId={loanToCancel.id}
          action="cancel"
        />
      )}
    </div>
  );
} 