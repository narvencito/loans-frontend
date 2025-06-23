import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { RequestItem, requestApi } from '@/features/request/api/request_api';
import RequestTable from '@/features/request/components/RequestTable';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { User } from '@/features/auth/types/auth.types';

export default function ClientRequestListPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.clientId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await requestApi.getByClient(user.clientId);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user?.clientId]);

  const handleViewRequest = (request: RequestItem) => {
    navigate(`/client/requests/${request.id}`);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Cargando solicitudes...</div>;
  }

  if (!user?.clientId) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: No se encontró la información del cliente
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Solicitudes</h1>
      </div>

      <Card className="p-6">
        {requests.length > 0 ? (
          <RequestTable
            requests={requests}
            onView={handleViewRequest}
            showActions={false}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tienes solicitudes activas</p>
            <button
              onClick={() => navigate('/request')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Crear nueva solicitud
            </button>
          </div>
        )}
      </Card>
    </div>
  );
} 