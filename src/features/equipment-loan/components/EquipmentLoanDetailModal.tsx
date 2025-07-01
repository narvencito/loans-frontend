import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { EquipmentLoanItem } from "../api/equipment_loan_api";
import { formatCurrency } from "@/shared/utils/currencyUtils";

interface Props {
  loan: EquipmentLoanItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusColors: Record<string, string> = {
  'created': 'bg-yellow-100 text-yellow-700',
  'delivered': 'bg-green-100 text-green-700',
  'overdue': 'bg-red-100 text-red-700',
  'returned': 'bg-blue-100 text-blue-700',
  'cancelled': 'bg-gray-100 text-gray-700'
};

export default function EquipmentLoanDetailModal({ loan, isOpen, onClose }: Props) {
  if (!loan) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Detalle del Préstamo</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información General</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">ID:</span> {loan.id.slice(0, 8)}</p>
                  <p>
                    <span className="text-muted-foreground">Estado:</span>{" "}
                    <Badge className={StatusColors[loan.status.code]}>
                      {loan.status.name}
                    </Badge>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Fecha de Creación:</span>{" "}
                    {formatDate(loan.createdAt)}
                  </p>
                  {loan.status.code !== 'created' && (
                    <>
                      <p>
                        <span className="text-muted-foreground">Fecha de Entrega:</span>{" "}
                        {formatDate(loan.deliveryDate)}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Fecha de Devolución:</span>{" "}
                        {formatDate(loan.returnDate)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información Financiera</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Tarifa Diaria:</span>{" "}
                    {formatCurrency(loan.dailyRate)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Monto Total:</span>{" "}
                    {formatCurrency(loan.totalAmount)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Monto Inicial:</span>{" "}
                    {formatCurrency(loan.downPayment)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Monto Pendiente:</span>{" "}
                    {formatCurrency(loan.remainingAmount)}
                  </p>
                  {loan.status.code !== 'created' && (
                    <p>
                      <span className="text-muted-foreground">Días Pagados:</span>{" "}
                      {loan.paidDays}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información del Cliente</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Nombre:</span> {loan.client.fullName}</p>
                  <p><span className="text-muted-foreground">DNI:</span> {loan.client.document}</p>
                  <p><span className="text-muted-foreground">Email:</span> {loan.client.email}</p>
                  <p><span className="text-muted-foreground">Teléfono:</span> {loan.client.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Información del Equipo</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Nombre:</span> {loan.equipment.name}</p>
                  <p><span className="text-muted-foreground">Descripción:</span> {loan.equipment.description}</p>
                  <p>
                    <span className="text-muted-foreground">Tarifa Diaria:</span>{" "}
                    {formatCurrency(loan.equipment.rentalDailyRate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 