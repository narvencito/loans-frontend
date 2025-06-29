import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClientRequest } from '../types/request.types';
import { clientLoansApi } from '../api/client_loans_api';
import { Skeleton } from '@/components/ui/skeleton';
import RequestDetailModal from '../components/RequestDetailModal';

const RequestStatusColors: Record<string, string> = {
  'pending': 'bg-yellow-500',
  'approved': 'bg-green-500',
  'rejected': 'bg-red-500',
  'in_progress': 'bg-blue-500',
  'completed': 'bg-gray-500'
};

export default function EquipmentLoanListPage() {
  const [loans, setLoans] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<ClientRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const response = await clientLoansApi.getMyEquipmentLoans();
      setLoans(response as ClientRequest[]);
    } catch (error) {
      console.error('Error loading loans:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (loan: ClientRequest): number | null => {
    if (loan.termInDays && loan.equipment?.rentalDailyRate) {
      return loan.termInDays * loan.equipment.rentalDailyRate;
    }
    return null;
  };

  const formatAmount = (loan: ClientRequest): string => {
    const amount = calculateAmount(loan);
    if (amount === null) return 'N/A';
    
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const handleViewDetail = (loan: ClientRequest) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Préstamos de Equipo</h1>
        <Button onClick={handleNewRequest} className="bg-primary text-white hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Préstamo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Monto Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow 
                  key={loan.id}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{loan.code}</TableCell>
                  <TableCell>{loan.equipment?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={RequestStatusColors[loan.status]}>
                      {loan.requestStatus.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{loan.termInDays || 'N/A'}</TableCell>
                  <TableCell>{formatAmount(loan)}</TableCell>
                  <TableCell>
                    {typeof loan.createdAt === 'string' 
                      ? format(new Date(loan.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetail(loan)}
                      className="hover:bg-gray-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">No tienes préstamos de equipo</p>
                    <Button
                      onClick={handleNewRequest}
                      variant="link"
                      className="mt-2 text-primary hover:text-primary/90"
                    >
                      Solicitar préstamo
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RequestDetailModal
        request={selectedLoan}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLoan(null);
        }}
      />
    </div>
  );
} 