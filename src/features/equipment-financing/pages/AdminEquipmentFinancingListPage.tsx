import React, { useEffect, useState } from 'react';
import { equipmentFinancingApi, EquipmentFinancingItem } from '../api/equipment-financing-api';
import EquipmentFinancingTable from '../components/EquipmentFinancingTable';
import EquipmentFinancingScheduleModal from '../components/EquipmentFinancingScheduleModal';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EquipmentFinancingStatusCode, EquipmentFinancingStatusLabel } from '../enums/equipment-financing-status.enum';
import { useDialogStore } from '@/shared/utils/global-dialog';
import { generatePDF } from '@/shared/utils/pdfUtils';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ALL_STATUS = 'ALL';

const AdminEquipmentFinancingListPage = () => {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [financingSelected, setFinancingSelected] = useState<EquipmentFinancingItem | null>(null);
  const { showDialog } = useDialogStore();

  // Filtros visuales
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const searchFinancings = async () => {
    setLoading(true);
    try {
      const data = await equipmentFinancingApi.getAll({
        clientId: clientFilter ?? undefined,
        statusId: statusFilter === ALL_STATUS ? undefined : statusFilter ?? undefined,
      });
      setFinancings(data);
    } catch (error) {
      console.error("Error al cargar financiamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm('¿Estás seguro de eliminar este financiamiento?');
    if (!isConfirmed) return;
    try {
      await equipmentFinancingApi.delete(id);
      searchFinancings();
    } catch (error) {
      console.error("Error al eliminar financiamiento:", error);
    }
  };

  const handleViewSchedule = (id: string) => {
    const financing = financings.find((f) => f.id === id);
    if (financing) setFinancingSelected(financing);
  };

  const handlePayInstallment = async (financing: EquipmentFinancingItem, installmentId: string) => {
    const installment = financing.installments.find(i => i.id === installmentId);

    if (!installment) {
      showDialog({
        title: "Error",
        message: "No se encontró la cuota seleccionada",
        type: "error"
      });
      return;
    }

    showDialog({
      title: "Pagar Cuota",
      message: `¿Desea pagar la cuota ${installment.number} por ${formatCurrency(installment.amount)}?`,
      type: "confirm",
      onConfirm: async () => {
        try {
          await equipmentFinancingApi.payInstallment(financing.id, installmentId);
          showDialog({
            title: "Éxito",
            message: "Pago realizado correctamente",
            type: "success"
          });
          searchFinancings();
          // Actualizar el financiamiento seleccionado
          const updatedFinancing = await equipmentFinancingApi.getById(financing.id);
          setFinancingSelected(updatedFinancing);
        } catch (error) {
          showDialog({
            title: "Error",
            message: "No se pudo procesar el pago",
            type: "error"
          });
        }
      }
    });
  };

  const handlePayTotal = async (financing: EquipmentFinancingItem) => {
    const pendingAmount = financing.installments
      .filter(i => i.status.code === 'PENDING' || i.status.code === 'OVERDUE')
      .reduce((sum, i) => sum + i.amount, 0);

    showDialog({
      title: "Pago Total",
      message: `¿Desea realizar el pago total de ${formatCurrency(pendingAmount)}?`,
      type: "confirm",
      onConfirm: async () => {
        try {
          await equipmentFinancingApi.payAll(financing.id);
          showDialog({
            title: "Éxito",
            message: "Pago total realizado correctamente",
            type: "success"
          });
          searchFinancings();
          // Actualizar el financiamiento seleccionado
          const updatedFinancing = await equipmentFinancingApi.getById(financing.id);
          setFinancingSelected(updatedFinancing);
        } catch (error) {
          showDialog({
            title: "Error",
            message: "No se pudo procesar el pago total",
            type: "error"
          });
        }
      }
    });
  };

  const handleDownloadSchedule = async (financing: EquipmentFinancingItem) => {
    try {
      const headers = ['N° Cuota', 'Fecha Vencimiento', 'Capital', 'Interés', 'Cuota', 'Saldo', 'Estado'];
      const rows = financing.installments.map(installment => [
        installment.number.toString(),
        format(new Date(installment.dueDate), 'dd/MM/yyyy', { locale: es }),
        formatCurrency(installment.capital),
        formatCurrency(installment.interest),
        formatCurrency(installment.amount),
        formatCurrency(installment.balance),
        installment.status.name
      ]);

      await generatePDF({
        title: `Cronograma de Financiamiento - ${financing.client.fullName}`,
        subtitle: `Equipo: ${financing.equipment.name} | Monto: ${formatCurrency(financing.totalAmount)}`,
        headers,
        data: rows,
        filename: `cronograma_financiamiento_${financing.id}.pdf`
      });
    } catch (error) {
      showDialog({
        title: "Error",
        message: "No se pudo descargar el cronograma",
        type: "error"
      });
    }
  };

  useEffect(() => {
    searchFinancings();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Gestión de Financiamientos de Equipos</h1>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mb-6">
        {/* Filtros a la izquierda */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="w-full sm:w-64">
            <AsyncClientCombobox
              selectedClientId={clientFilter}
              onSelect={(id: string | null) => setClientFilter(id)}
              label="Filtrar por cliente"
            />
          </div>

          <div className="w-full sm:w-48">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={statusFilter || ALL_STATUS}
              onValueChange={(value) => setStatusFilter(value === ALL_STATUS ? null : value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={ALL_STATUS}>Todos los estados</SelectItem>
                {Object.entries(EquipmentFinancingStatusLabel).map(([code, label]) => (
                  <SelectItem key={code} value={code}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={searchFinancings}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Buscar
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <EquipmentFinancingTable
            financings={financings}
            onDelete={handleDelete}
            onViewSchedule={handleViewSchedule}
          />
        </div>
      )}

      <EquipmentFinancingScheduleModal
        open={!!financingSelected}
        onClose={() => setFinancingSelected(null)}
        financing={financingSelected}
        onPayInstallment={handlePayInstallment}
        onPayTotal={handlePayTotal}
        onDownloadSchedule={handleDownloadSchedule}
      />
    </div>
  );
};

export default AdminEquipmentFinancingListPage; 