import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientRequest } from '../types/request.types';
import { clientRequestsApi } from '../api/client_requests_api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RequestTypeLabels = {
  'cash': 'Préstamo en efectivo',
  'equipment-loan': 'Préstamo de equipo',
  'equipment-financing': 'Financiamiento de equipo'
};

const RequestStatusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-500',
  'APPROVED': 'bg-green-500',
  'REJECTED': 'bg-red-500',
  'IN_PROGRESS': 'bg-blue-500',
  'COMPLETED': 'bg-gray-500'
};

const ClientRequestDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      loadRequestDetail(requestId);
    }
  }, [requestId]);

  const loadRequestDetail = async (id: string) => {
    try {
      const data = await clientRequestsApi.getRequestById(id);
      setRequest(data);
    } catch (error) {
      console.error('Error loading request detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Solicitud no encontrada</h1>
        <p>La solicitud que buscas no existe o no tienes acceso a ella.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de Solicitud</h1>
        <Badge className={RequestStatusColors[request.requestStatusId]}>
          {request.requestStatusId}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Código</p>
              <p className="font-medium">{request.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo de Solicitud</p>
              <p className="font-medium">{RequestTypeLabels[request.requestTypeId]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">
                {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
              </p>
            </div>
            {request.message && (
              <div>
                <p className="text-sm text-gray-500">Mensaje</p>
                <p className="font-medium">{request.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Financiera */}
        <Card>
          <CardHeader>
            <CardTitle>Información Financiera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.amount && (
              <div>
                <p className="text-sm text-gray-500">Monto</p>
                <p className="font-medium">{formatCurrency(request.amount)}</p>
              </div>
            )}
            {request.downPayment && (
              <div>
                <p className="text-sm text-gray-500">Cuota Inicial</p>
                <p className="font-medium">{formatCurrency(request.downPayment)}</p>
              </div>
            )}
            {request.interestRate && (
              <div>
                <p className="text-sm text-gray-500">Tasa de Interés</p>
                <p className="font-medium">{request.interestRate}%</p>
              </div>
            )}
            {request.termInMonths && (
              <div>
                <p className="text-sm text-gray-500">Plazo en Meses</p>
                <p className="font-medium">{request.termInMonths} meses</p>
              </div>
            )}
            {request.termInDays && (
              <div>
                <p className="text-sm text-gray-500">Plazo en Días</p>
                <p className="font-medium">{request.termInDays} días</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Equipo (si aplica) */}
        {request.equipment && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nombre del Equipo</p>
                <p className="font-medium">{request.equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-medium">{request.equipment.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Precio de Venta</p>
                  <p className="font-medium">{formatCurrency(request.equipment.salePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tarifa Diaria de Alquiler</p>
                  <p className="font-medium">{formatCurrency(request.equipment.rentalDailyRate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientRequestDetailPage; 