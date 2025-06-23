import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestStatusHistory } from "./RequestStatusHistory";
import { requestApi, RequestItem } from '../api/request_api';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequestStatusChangeDialog } from './RequestStatusChangeDialog';
import { RequestStatusCode } from '../enums/request-status.enum';
import { CancelButton, ConfirmButton } from '@/components/common/ActionButtons';
import { getRequestTypeName } from '../utils/requestTypeUtils';

interface RequestDetailProps {
  request: RequestItem;
  showActions?: boolean;
  onStatusChange?: () => void;
  onAlert?: (message: string, type: 'success' | 'error') => void;
  isUserView?: boolean;
}

export const RequestDetail = ({ request, showActions = false, onStatusChange, onAlert, isUserView = false }: RequestDetailProps) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'convert' | 'cancel' | null>(null);

  // Verificamos si se pueden mostrar acciones
  const canShowActions = showActions && 
    request.requestStatus.code !== RequestStatusCode.CONVERTED &&
    request.requestStatus.code !== RequestStatusCode.CANCELLED &&
    request.requestStatus.code !== RequestStatusCode.REJECTED;

  const handleStatusChange = async (comments?: string) => {
    if (!showActions || !actionType || !comments) return;

    let newStatus: RequestStatusCode;
    let actionText = '';

    switch (actionType) {
      case 'approve':
        newStatus = RequestStatusCode.APPROVED;
        actionText = 'aprobada';
        break;
      case 'reject':
        newStatus = RequestStatusCode.REJECTED;
        actionText = 'rechazada';
        break;
      case 'convert':
        newStatus = RequestStatusCode.CONVERTED;
        actionText = 'convertida a préstamo';
        break;
      case 'cancel':
        newStatus = RequestStatusCode.CANCELLED;
        actionText = 'cancelada';
        break;
      default:
        return;
    }

    try {
      setIsLoading(true);
      await requestApi.updateStatus(request.id, newStatus, comments);
      onAlert?.(`La solicitud ha sido ${actionText}`, 'success');
      if (onStatusChange) onStatusChange();
      setShowStatusDialog(false);
      setActionType(null);
    } catch (error) {
      onAlert?.('No se pudo actualizar el estado de la solicitud', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openStatusDialog = (type: 'approve' | 'reject' | 'convert' | 'cancel') => {
    setActionType(type);
    setShowStatusDialog(true);
  };

  const getStatusStyle = (statusCode: string) => {
    switch (statusCode) {
      case RequestStatusCode.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case RequestStatusCode.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case RequestStatusCode.APPROVED:
        return 'bg-green-100 text-green-800';
      case RequestStatusCode.CONVERTED:
        return 'bg-purple-100 text-purple-800';
      case RequestStatusCode.REJECTED:
        return 'bg-red-100 text-red-800';
      case RequestStatusCode.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDialogConfig = () => {
    if (!actionType) return {
      title: '',
      description: '',
      confirmLabel: '',
    };

    const configs = {
      approve: {
        title: 'Aprobar Solicitud',
        description: 'Por favor, ingrese un comentario para aprobar la solicitud.',
        confirmLabel: 'Aprobar',
      },
      reject: {
        title: 'Rechazar Solicitud',
        description: 'Por favor, ingrese un comentario para rechazar la solicitud.',
        confirmLabel: 'Rechazar',
      },
      convert: {
        title: 'Convertir a Préstamo',
        description: 'Por favor, ingrese un comentario para convertir la solicitud a préstamo.',
        confirmLabel: 'Convertir',
      },
      cancel: {
        title: 'Cancelar Solicitud',
        description: 'Por favor, ingrese un comentario para cancelar la solicitud.',
        confirmLabel: 'Cancelar',
      }
    };

    return configs[actionType];
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      {/* Estado actual y Acciones */}
      <Card className="p-4 sticky top-0 bg-white z-10 shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold mb-2">Estado Actual</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(request.requestStatus.code)}`}>
                {request.requestStatus.name}
              </span>
            </div>
            <CancelButton
              onClick={() => setShowHistoryModal(true)}
              className="shrink-0"
            >
              Ver Historial
            </CancelButton>
          </div>

          {/* Acciones según estado */}
          {canShowActions && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Acciones Disponibles</h4>
              
              {/* Vista de usuario - Solo puede cancelar solicitudes pendientes o en revisión */}
              {isUserView && (request.requestStatus.code === RequestStatusCode.PENDING || 
                request.requestStatus.code === RequestStatusCode.IN_REVIEW) && (
                <div className="flex gap-2">
                  <CancelButton
                    onClick={() => openStatusDialog('cancel')}
                    disabled={isLoading}
                  >
                    Cancelar Solicitud
                  </CancelButton>
                </div>
              )}

              {/* Vista de admin - Puede rechazar, aprobar y convertir */}
              {!isUserView && (
                <>
                  {request.requestStatus.code === RequestStatusCode.IN_REVIEW && (
                    <div className="flex gap-2">
                      <CancelButton
                        onClick={() => openStatusDialog('reject')}
                        disabled={isLoading}
                      >
                        Rechazar Solicitud
                      </CancelButton>
                      <ConfirmButton
                        onClick={() => openStatusDialog('approve')}
                        disabled={isLoading}
                      >
                        Aprobar Solicitud
                      </ConfirmButton>
                    </div>
                  )}
                  {request.requestStatus.code === RequestStatusCode.APPROVED && (
                    <div className="flex">
                      <ConfirmButton
                        onClick={() => openStatusDialog('convert')}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Convertir a Préstamo
                      </ConfirmButton>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Información de la solicitud */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Información de la Solicitud</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Tipo de Solicitud</p>
            <p className="font-medium">{getRequestTypeName(request.requestType.name)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fecha de Creación</p>
            <p className="font-medium">{new Date(request.createdAt).toLocaleString()}</p>
          </div>
          {request.amount && (
            <div>
              <p className="text-xs text-gray-500">Monto</p>
              <p className="font-medium">S/ {request.amount.toLocaleString()}</p>
            </div>
          )}
          {request.termInMonths && (
            <div>
              <p className="text-xs text-gray-500">Plazo (meses)</p>
              <p className="font-medium">{request.termInMonths}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Información del cliente */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Información del Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Cliente</p>
            <p className="font-medium">{request.client.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Documento</p>
            <p className="font-medium">{request.client.document}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Correo</p>
            <p className="font-medium">{request.client.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <p className="font-medium">{request.client.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Dirección</p>
            <p className="font-medium">{request.client.address}</p>
          </div>
        </div>
      </Card>

      {/* Información del equipo */}
      {request.equipment && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Información del Equipo</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Equipo</p>
              <p className="font-medium">{request.equipment.name}</p>
              {request.equipment.description && (
                <p className="text-sm text-gray-600 mt-1">{request.equipment.description}</p>
              )}
            </div>
            {request.equipment.code && (
              <div>
                <p className="text-xs text-gray-500">Código</p>
                <p className="font-medium">{request.equipment.code}</p>
              </div>
            )}
            {request.equipment.serial && (
              <div>
                <p className="text-xs text-gray-500">Serial</p>
                <p className="font-medium">{request.equipment.serial}</p>
              </div>
            )}
            {request.equipment.salePrice && (
              <div>
                <p className="text-xs text-gray-500">Precio de Venta</p>
                <p className="font-medium">S/ {request.equipment.salePrice.toLocaleString()}</p>
              </div>
            )}
            {request.equipment.location && (
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="font-medium">{request.equipment.location}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Mensaje o detalles adicionales */}
      {request.message && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Mensaje/Detalles Adicionales</h3>
          <p className="text-sm">{request.message}</p>
        </Card>
      )}

      {/* Modal de Historial */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>Historial de Estados</DialogTitle>
          </DialogHeader>
          <RequestStatusHistory requestId={request.id} />
        </DialogContent>
      </Dialog>

      {/* Modal de Cambio de Estado */}
      {actionType && (
        <RequestStatusChangeDialog
          open={showStatusDialog}
          onClose={() => {
            setShowStatusDialog(false);
            setActionType(null);
          }}
          onConfirm={handleStatusChange}
          {...getDialogConfig()}
          currentStatus={request.requestStatus.code as RequestStatusCode}
        />
      )}
    </div>
  );
}; 