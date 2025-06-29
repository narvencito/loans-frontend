import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ClientRequest } from "../types/request.types";
import { Badge } from "@/components/ui/badge";

interface RequestDetailModalProps {
  request: ClientRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

export default function RequestDetailModal({ request, isOpen, onClose }: RequestDetailModalProps) {
  if (!request) return null;

  const calculateAmount = (): number | null => {
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

  const amount = calculateAmount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Detalle de Solicitud {request.code}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información General</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Código:</span> {request.code}</p>
                  <p>
                    <span className="text-muted-foreground">Tipo:</span> {RequestTypeLabels[request.requestType.name]}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Estado:</span>{" "}
                    <Badge className={RequestStatusColors[request.status]}>
                      {request.requestStatus.name}
                    </Badge>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Fecha:</span>{" "}
                    {typeof request.createdAt === 'string'
                      ? format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'N/A'}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Monto:</span>{" "}
                    {amount ? formatCurrency(amount) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información del Cliente</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Nombre:</span> {request.client.fullName}</p>
                  <p><span className="text-muted-foreground">DNI:</span> {request.client.document}</p>
                  <p><span className="text-muted-foreground">Email:</span> {request.client.email}</p>
                  <p><span className="text-muted-foreground">Teléfono:</span> {request.client.phone}</p>
                  <p><span className="text-muted-foreground">Código de estudiante:</span> {request.client.codeStudent}</p>
                </div>
              </div>
            </div>
          </div>

          {request.equipment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información del Equipo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Nombre:</span> {request.equipment.name}</p>
                    <p><span className="text-muted-foreground">Código:</span> {request.equipment.code}</p>
                    <p><span className="text-muted-foreground">Serial:</span> {request.equipment.serial}</p>
                    <p><span className="text-muted-foreground">Ubicación:</span> {request.equipment.location}</p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">Precio de venta:</span>{" "}
                      {formatCurrency(request.equipment.salePrice)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Tarifa diaria:</span>{" "}
                      {formatCurrency(request.equipment.rentalDailyRate)}
                    </p>
                    {request.requestType.name === 'equipment-loan' && request.termInDays && (
                      <p><span className="text-muted-foreground">Días de préstamo:</span> {request.termInDays}</p>
                    )}
                    {request.requestType.name === 'equipment-financing' && (
                      <p>
                        <span className="text-muted-foreground">Adelanto:</span>{" "}
                        {request.downPayment ? formatCurrency(request.downPayment) : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {request.message && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Mensaje</h3>
                <p className="text-sm">{request.message}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 