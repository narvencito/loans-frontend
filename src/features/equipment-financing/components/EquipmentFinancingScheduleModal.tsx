import React, { useMemo } from 'react';
import DialogAppCustom from "@/shared/components/DialogAppCustom";
import { EquipmentFinancingItem } from '../api/equipment-financing-api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { EquipmentFinancingStatusCode, EquipmentFinancingStatusLabel } from '../enums/equipment-financing-status.enum';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Wallet, Download } from 'lucide-react';
import RowApp from '@/shared/components/RowApp';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  open: boolean;
  onClose: () => void;
  financing: EquipmentFinancingItem | null;
  onPayInstallment?: (financing: EquipmentFinancingItem, installmentId: string) => void;
  onPayTotal?: (financing: EquipmentFinancingItem) => void;
  onDownloadSchedule?: (financing: EquipmentFinancingItem) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const getStatusColor = (status: string): string => {
  const statusCode = status as EquipmentFinancingStatusCode;
  switch (statusCode) {
    case EquipmentFinancingStatusCode.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case EquipmentFinancingStatusCode.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case EquipmentFinancingStatusCode.CANCELLED:
      return 'bg-red-100 text-red-800 border border-red-300';
    case EquipmentFinancingStatusCode.VOIDED:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
    case EquipmentFinancingStatusCode.COMPLETED:
      return 'bg-green-100 text-green-800 border border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const EquipmentFinancingScheduleModal = ({ 
  open, 
  onClose, 
  financing,
  onPayInstallment,
  onPayTotal,
  onDownloadSchedule
}: Props) => {
  if (!financing) return null;

  const showPaymentButtons = financing.status.code !== EquipmentFinancingStatusCode.CANCELLED && 
                           financing.status.code !== EquipmentFinancingStatusCode.COMPLETED;

  const remainingAmount = financing.installments
    .filter(i => i.status.code === 'PENDING' || i.status.code === 'OVERDUE')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <DialogAppCustom
      open={open}
      onClose={onClose}
      title="Cronograma de Financiamiento"
      maxWidth="lg"
      childrenFooter={
        <RowApp gap={2}>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </RowApp>
      }
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{financing.client.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipo</p>
                <p className="font-medium">{financing.equipment.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto Total</p>
                <p className="font-medium">{formatCurrency(financing.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cuota Inicial</p>
                <p className="font-medium">{formatCurrency(financing.downPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto Financiado</p>
                <p className="font-medium">{formatCurrency(financing.financedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa Anual</p>
                <p className="font-medium">{financing.annualRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plazo</p>
                <p className="font-medium">{financing.term} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha inicio</p>
                <p className="font-medium">
                  {format(new Date(financing.startDate), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge className={getStatusColor(financing.status.code)}>
                  {EquipmentFinancingStatusLabel[financing.status.code as EquipmentFinancingStatusCode] || financing.status.name}
                </Badge>
              </div>
            </div>

            {/* Tabla de cuotas */}
            {financing.installments && financing.installments.length > 0 ? (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cronograma de Pagos</h3>
                  <div className="flex gap-2">
                    {showPaymentButtons && onPayTotal && remainingAmount > 0 && (
                      <Button
                        variant="default"
                        onClick={() => onPayTotal(financing)}
                        className="gap-2"
                      >
                        <Wallet className="h-4 w-4" />
                        Pago Total ({formatCurrency(remainingAmount)})
                      </Button>
                    )}
                    {onDownloadSchedule && (
                      <Button
                        variant="outline"
                        onClick={() => onDownloadSchedule(financing)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Descargar Cronograma
                      </Button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Cuota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interés</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        {showPaymentButtons && onPayInstallment && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financing.installments.map((installment) => (
                        <tr key={installment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(installment.dueDate), 'dd/MM/yyyy', { locale: es })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(installment.capital)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(installment.interest)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(installment.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(installment.balance)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Badge className={getStatusColor(installment.status.code)}>
                              {installment.status.name}
                            </Badge>
                          </td>
                          {showPaymentButtons && onPayInstallment && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {(installment.status.code === 'PENDING' || installment.status.code === 'OVERDUE') && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onPayInstallment(financing, installment.id)}
                                      >
                                        <Wallet className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Pagar Cuota ({formatCurrency(installment.amount)})</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">No hay cuotas registradas</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </DialogAppCustom>
  );
};

export default EquipmentFinancingScheduleModal; 