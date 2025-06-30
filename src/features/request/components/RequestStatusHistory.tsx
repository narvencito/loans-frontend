import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { requestApi } from '../api/request_api';

interface StatusHistoryItem {
  id: string;
  status: {
    code: string;
    name: string;
  };
  createdAt: string;
  comments?: string;
  user: {
    id: string;
    name: string;
    role: {
      name: string;
    }
  };
}

interface StatusHistoryResponse {
  statusHistory: StatusHistoryItem[];
}

interface RequestStatusHistoryProps {
  requestId: string;
}

export const RequestStatusHistory = ({ requestId }: RequestStatusHistoryProps) => {
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!requestId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response: StatusHistoryResponse = await requestApi.getStatusHistory(requestId);
        if (response.statusHistory) {
          // Ordenamos el historial de más reciente a más antiguo
          const sortedHistory = [...response.statusHistory].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setHistory(sortedHistory);
        } else {
          setError('No se pudo obtener el historial');
        }
      } catch (error) {
        setError('No se pudo cargar el historial');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [requestId]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center h-[200px] space-y-2">
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-gray-500">ID de solicitud: {requestId}</p>
        </div>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">No hay historial disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Historial de Estados</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={item.id}
              className={`relative pl-8 pb-4 ${
                index !== history.length - 1 ? "border-l-2 border-gray-200" : ""
              }`}
            >
              {/* Círculo indicador */}
              <div
                className={`absolute left-[-5px] w-3 h-3 rounded-full ${
                  index === 0
                    ? "bg-green-500" // Estado más reciente en verde
                    : "bg-gray-400" // Estados anteriores en gris
                }`}
              />
              
              <div className="bg-gray-50 rounded-lg p-4">
                {/* Encabezado con estado y fecha */}
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-medium ${
                      index === 0
                        ? "text-green-600" // Texto del estado más reciente en verde
                        : "text-gray-600" // Texto de estados anteriores en gris
                    }`}
                  >
                    {item.status.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                
                {/* Usuario, rol y comentario */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      {item.user.name}
                    </p>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {item.user.role.name}
                    </span>
                  </div>
                  {item.comments && (
                    <p className="text-sm text-gray-600 mt-1">{item.comments}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}; 