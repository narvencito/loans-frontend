import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { RequestItem, requestApi } from '@/features/request/api/request_api';
import { RequestStatusHistory } from '@/features/request/components/RequestStatusHistory';

export default function ClientRequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        const data = await requestApi.getById(requestId);
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  if (isLoading) {
    return <div className="p-8 text-center">Cargando solicitud...</div>;
  }

  if (!request) {
    return <div className="p-8 text-center">Solicitud no encontrada</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Detalle de Solicitud</h1>

      <div className="grid gap-6">
        {/* Estado actual */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Estado Actual</h2>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${request.requestStatus.code === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
              ${request.requestStatus.code === 'IN_REVIEW' && 'bg-blue-100 text-blue-800'}
              ${request.requestStatus.code === 'APPROVED' && 'bg-green-100 text-green-800'}
              ${request.requestStatus.code === 'CONVERTED' && 'bg-purple-100 text-purple-800'}
              ${request.requestStatus.code === 'REJECTED' && 'bg-red-100 text-red-800'}
            `}>
              {request.requestStatus.name}
            </span>
            <span className="text-gray-500">
              Actualizado: {new Date(request.updatedAt).toLocaleString()}
            </span>
          </div>
        </Card>

        {/* Detalles de la solicitud */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Detalles de la Solicitud</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo de Solicitud</p>
              <p className="font-medium">{request.requestType.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">{new Date(request.createdAt).toLocaleString()}</p>
            </div>
            {request.equipmentId && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Equipo</p>
                <p className="font-medium">{request.equipmentId}</p>
              </div>
            )}
            {request.message && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Mensaje/Detalles</p>
                <p className="font-medium">{request.message}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Historial de estados */}
        <Card className="p-6">
          <RequestStatusHistory requestId={request.id} />
        </Card>
      </div>
    </div>
  );
} 