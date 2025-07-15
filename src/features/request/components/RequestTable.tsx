import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getRequestTypeName } from '../utils/requestTypeUtils';
import { RequestItem } from '../api/request_api';
import { requestApi } from '../api/request_api';
import { RequestDetail } from './RequestDetail';
import { RequestStatusChangeDialog } from './RequestStatusChangeDialog';
import { RequestStatusCode } from '../enums/request-status.enum';
import { Badge } from "@/components/ui/badge";
import { BlueButton } from "@/components/common/ColorButtons";

interface Props {
  requests: RequestItem[];
  showActions?: boolean;
  onRefresh?: () => void;
  onAlert?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const RequestTable = ({ requests, showActions = false, onRefresh, onAlert }: Props) => {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDetail = (request: RequestItem) => {
    if (request.requestStatus.code === RequestStatusCode.PENDING && showActions) {
      setSelectedRequest(request);
      setShowStatusDialog(true);
    } else {
      setSelectedRequest(request);
      setShowDetailModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedRequest) return;

    try {
      setIsLoading(true);
      // Solo para solicitudes pendientes usamos el comentario automático
      const automaticComment = selectedRequest.requestStatus.code === RequestStatusCode.PENDING ? 
        'Cambio de estado automático por sistema' : undefined;
      
      await requestApi.updateStatus(
        selectedRequest.id, 
        RequestStatusCode.IN_REVIEW, 
        automaticComment
      );
      onAlert?.('La solicitud ha pasado a revisión', 'success');
      if (onRefresh) onRefresh();
      setShowStatusDialog(false);
      setSelectedRequest(null); // Limpiamos la solicitud seleccionada
    } catch (error) {
      onAlert?.('No se pudo actualizar el estado de la solicitud', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    if (onRefresh) onRefresh();
  };

  const getStatusStyle = (statusCode: string) => {
    switch (statusCode) {
      case RequestStatusCode.PENDING:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300'
        };
      case RequestStatusCode.IN_REVIEW:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300'
        };
      case RequestStatusCode.APPROVED:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300'
        };
      case RequestStatusCode.CONVERTED:
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-300'
        };
      case RequestStatusCode.REJECTED:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300'
        };
      case RequestStatusCode.CANCELLED:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300'
        };
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead>Cliente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right w-[200px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const statusStyle = getStatusStyle(request.requestStatus.code);
              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.client.fullName}</TableCell>
                  <TableCell>{request.client.document}</TableCell>
                  <TableCell>{getRequestTypeName(request.requestType.name)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {request.requestStatus.name}
                      </span>
                      <span className={`text-xs ${statusStyle.text}`}>
                        {request.requestStatus.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{request.equipment?.name || '-'}</TableCell>
                  <TableCell>
                    {request.amount ? `S/ ${request.amount.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex justify-end items-center gap-2">
                      <BlueButton
                        size="sm"
                        onClick={() => handleOpenDetail(request)}
                      >
                        Ver Solicitud
                      </BlueButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Detalles con Historial y Acciones */}
      <Dialog open={showDetailModal} onOpenChange={handleCloseDetail}>
        <DialogContent className="sm:max-w-5xl bg-white">
          <DialogHeader>
            <DialogTitle>Detalle de la Solicitud</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <RequestDetail
              request={selectedRequest}
              showActions={showActions}
              onStatusChange={onRefresh}
              onAlert={onAlert}
              isUserView={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación para cambio automático de estado */}
      {selectedRequest && (
        <RequestStatusChangeDialog
          open={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          onConfirm={handleStatusChange}
          title="Cambiar Estado de Solicitud"
          description="La solicitud pasará a estado 'En Revisión' automáticamente."
          confirmLabel="Confirmar"
          confirmColor="bg-blue-600 hover:bg-blue-700 text-white"
          currentStatus={selectedRequest.requestStatus.code as RequestStatusCode}
        />
      )}
    </div>
  );
};
