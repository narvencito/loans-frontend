import { useEffect, useState } from 'react';
import { RequestStatusHistory as RequestStatusHistoryType } from '../api/request_api';
import { requestApi } from '../api/request_api';

interface Props {
  requestId: string;
}

export const RequestStatusHistory = ({ requestId }: Props) => {
  const [history, setHistory] = useState<RequestStatusHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await requestApi.getStatusHistory(requestId);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [requestId]);

  if (isLoading) {
    return <div className="p-4 text-center">Cargando historial...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Historial de Estados</h3>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={item.id} className="relative pl-8">
            {/* Timeline connector */}
            {index < history.length - 1 && (
              <div className="absolute left-[0.9375rem] top-6 w-0.5 h-full -ml-px bg-gray-200" />
            )}
            
            {/* Status point */}
            <div className="absolute left-0 w-4 h-4 rounded-full bg-blue-500 mt-1.5" />
            
            {/* Content */}
            <div className="bg-white rounded-lg border p-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{item.status.name}</span>
                  <p className="text-sm text-gray-500">
                    Por: {item.createdBy.name}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <p className="text-center text-gray-500">No hay historial disponible</p>
        )}
      </div>
    </div>
  );
}; 