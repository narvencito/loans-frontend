import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RequestItem } from '../api/request_api';
import { RequestStatusHistory } from './RequestStatusHistory';
import { useRequestStore } from '../store/request.store';
import { useState } from 'react';

interface Props {
  requests: RequestItem[];
  onView?: (request: RequestItem) => void;
  showActions?: boolean;
}

const RequestTable = ({ requests, onView, showActions = true }: Props) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { updateRequestStatus, convertRequest } = useRequestStore();

  const handleStatusChange = async (requestId: string, newStatusId: string) => {
    await updateRequestStatus(requestId, newStatusId);
  };

  const handleConvert = async (requestId: string) => {
    await convertRequest(requestId);
  };

  const getStatusActions = (request: RequestItem) => {
    switch (request.requestStatus.code) {
      case 'PENDING':
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              onClick={() => handleStatusChange(request.id, 'IN_REVIEW')}
            >
              Revisar
            </Button>
          </>
        );
      case 'IN_REVIEW':
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="bg-green-100 hover:bg-green-200 text-green-800 mr-2"
              onClick={() => handleStatusChange(request.id, 'APPROVED')}
            >
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-100 hover:bg-red-200 text-red-800"
              onClick={() => handleStatusChange(request.id, 'REJECTED')}
            >
              Rechazar
            </Button>
          </>
        );
      case 'APPROVED':
        return (
          <Button
            size="sm"
            variant="outline"
            className="bg-purple-100 hover:bg-purple-200 text-purple-800"
            onClick={() => handleConvert(request.id)}
          >
            Convertir
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden min-w-[600px] w-full">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.client.name}</TableCell>
                <TableCell>{r.requestType.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${r.requestStatus.code === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
                      ${r.requestStatus.code === 'IN_REVIEW' && 'bg-blue-100 text-blue-800'}
                      ${r.requestStatus.code === 'APPROVED' && 'bg-green-100 text-green-800'}
                      ${r.requestStatus.code === 'CONVERTED' && 'bg-purple-100 text-purple-800'}
                      ${r.requestStatus.code === 'REJECTED' && 'bg-red-100 text-red-800'}
                    `}>
                      {r.requestStatus.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedRequestId(r.id)}
                    >
                      <HistoryIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{r.equipmentId ? r.equipmentId : '-'}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {showActions && getStatusActions(r)}
                    {onView && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => onView(r)}
                      >
                        Ver Detalle
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRequestId} onOpenChange={() => setSelectedRequestId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historial de Estados</DialogTitle>
          </DialogHeader>
          {selectedRequestId && <RequestStatusHistory requestId={selectedRequestId} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default RequestTable;
