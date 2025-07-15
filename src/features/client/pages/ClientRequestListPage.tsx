import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClientRequest } from '../types/request.types';
import { clientRequestsApi } from '../api/client_requests_api';
import { Skeleton } from '@/components/ui/skeleton';
import RequestDetailModal from '../components/RequestDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { REQUEST_STATUS_STYLES } from '@/features/request/constants/request-status.constants';
import { RequestStatusCode } from '@/features/request/enums/request-status.enum';
import { BlueButton, YellowButton } from '@/components/common/ColorButtons';

const RequestTypeLabels: Record<string, string> = {
  'cash': 'Préstamo en efectivo',
  'equipment-loan': 'Préstamo de equipo',
  'equipment-financing': 'Financiamiento de equipo'
};

const RequestStatusColors: Record<string, string> = {
  'pending': 'bg-yellow-500',
  'approved': 'bg-green-500',
  'rejected': 'bg-red-500',
  'in_progress': 'bg-blue-500',
  'completed': 'bg-gray-500'
};

export default function ClientRequestListPage() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await clientRequestsApi.getMyRequests();
      setRequests(response || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (request: ClientRequest): number | null => {
    switch (request.requestType.name) {
      case 'equipment-loan':
        if (request.termInDays && request.equipment?.rentalDailyRate) {
          return request.termInDays * request.equipment.rentalDailyRate;
        }
        return null;
      
      case 'equipment-financing':
        if (request.equipment?.salePrice) {
          const downPayment = request.downPayment || 0;
          return request.equipment.salePrice - downPayment;
        }
        return null;
      
      case 'cash':
        return request.amount || null;
      
      default:
        return null;
    }
  };

  const formatAmount = (request: ClientRequest): string => {
    const amount = calculateAmount(request);
    if (amount === null) return 'N/A';
    
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const handleViewDetail = (request: ClientRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const getFilteredRequests = () => {
    if (activeTab === 'all') return requests;
    return requests.filter(request => request.requestType.name === activeTab);
  };

  const getRequestCount = (type: string) => {
    if (type === 'all') return requests.length;
    return requests.filter(request => request.requestType.name === type).length;
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

  const RequestTable = ({ requests }: { requests: ClientRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow 
            key={request.id}
            className="hover:bg-gray-100"
          >
            <TableCell>{request.code}</TableCell>
            <TableCell>{RequestTypeLabels[request.requestType.name]}</TableCell>
            <TableCell>
              <Badge 
                className={`${REQUEST_STATUS_STYLES[request.status as RequestStatusCode]?.bg} ${REQUEST_STATUS_STYLES[request.status as RequestStatusCode]?.text} border ${REQUEST_STATUS_STYLES[request.status as RequestStatusCode]?.border}`}
              >
                {request.requestStatus.name}
              </Badge>
            </TableCell>
            <TableCell>{formatAmount(request)}</TableCell>
            <TableCell>
              {typeof request.createdAt === 'string' 
                ? format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                : 'N/A'
              }
            </TableCell>
            <TableCell className="text-right">
              <BlueButton
                size="icon"
                onClick={() => handleViewDetail(request)}
                className="hover:bg-gray-200"
              >
                <Eye className="h-4 w-4" />
              </BlueButton>
            </TableCell>
          </TableRow>
        ))}
        {requests.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <p className="text-gray-500">No se encontraron solicitudes</p>
              <YellowButton
                onClick={() => navigate('/general/request-wizard')}
                className="mt-4"
              >
                Crear nueva solicitud
              </YellowButton>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Solicitudes</h1>
        <YellowButton
          onClick={() => navigate('/general/request-wizard')}
        >
          Nueva Solicitud
        </YellowButton>
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Todas ({getRequestCount('all')})
          </TabsTrigger>
          <TabsTrigger 
            value="cash"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Préstamos en efectivo ({getRequestCount('cash')})
          </TabsTrigger>
          <TabsTrigger 
            value="equipment-loan"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Préstamos de equipo ({getRequestCount('equipment-loan')})
          </TabsTrigger>
          <TabsTrigger 
            value="equipment-financing"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Financiamiento de equipo ({getRequestCount('equipment-financing')})
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <RequestTable requests={getFilteredRequests()} />
          </CardContent>
        </Card>
      </Tabs>

      <RequestDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
} 