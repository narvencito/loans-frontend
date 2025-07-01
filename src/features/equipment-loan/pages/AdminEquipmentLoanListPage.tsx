import { useEffect, useState, useMemo } from "react";
import { EquipmentLoanTable } from "../components/EquipmentLoanTable";
import EquipmentLoanScheduleModal from "../components/EquipmentLoanScheduleModal";
import { equipmentLoanApi, EquipmentLoanItem } from "../api/equipment_loan_api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentLoanStatusCode, EquipmentLoanStatusLabel } from "../enums/equipment-loan-status.enum";
import AsyncClientCombobox from "@/features/client/components/AsyncClientCombobox";
import RowApp from "@/shared/components/RowApp";
import ColumnApp from "@/shared/components/ColumnApp";
import { Label } from "@radix-ui/react-label";
import { useDialogStore } from "@/shared/utils/global-dialog";
import { generatePDF } from "@/shared/utils/pdfUtils";
import { formatCurrency } from "@/shared/utils/currencyUtils";

type StatusFilterType = keyof typeof EquipmentLoanStatusCode | "ALL";

export const AdminEquipmentLoanListPage = () => {
  const [selectedLoan, setSelectedLoan] = useState<EquipmentLoanItem | null>(null);
  const [allLoans, setAllLoans] = useState<EquipmentLoanItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("ALL");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { showDialog } = useDialogStore();

  const fetchLoans = async () => {
    try {
      const filters = {
        clientId: selectedClientId || undefined,
        statusCode: selectedStatus === "ALL" ? undefined : selectedStatus,
      };
      const response = await equipmentLoanApi.getAll(filters);
      setAllLoans(response);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [selectedClientId, selectedStatus]);

  // Calcular préstamos paginados y total
  const { paginatedLoans, total } = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      paginatedLoans: allLoans.slice(startIndex, endIndex),
      total: allLoans.length
    };
  }, [allLoans, page, limit]);

  const handleViewSchedule = (loan: EquipmentLoanItem) => {
    setSelectedLoan(loan);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleModalClose = () => {
    setIsScheduleModalOpen(false);
    setSelectedLoan(null);
    fetchLoans();
  };

  const handleClientChange = (clientId: string | null) => {
    setSelectedClientId(clientId);
    setPage(1); // Resetear página al cambiar filtros
  };

  const handleStatusChange = (status: StatusFilterType) => {
    setSelectedStatus(status);
    setPage(1); // Resetear página al cambiar filtros
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePayInstallment = async (loan: EquipmentLoanItem) => {
    showDialog({
      title: "Pagar Cuota",
      message: "¿Desea proceder con el pago de la cuota?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await equipmentLoanApi.payInstallment(loan.id);
          showDialog({
            title: "Éxito",
            message: "Pago realizado correctamente",
            type: "success"
          });
          fetchLoans();
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

  const handlePayTotal = async (loan: EquipmentLoanItem) => {
    showDialog({
      title: "Pago Total",
      message: `¿Desea realizar el pago total de ${formatCurrency(loan.remainingAmount)}?`,
      type: "confirm",
      onConfirm: async () => {
        try {
          await equipmentLoanApi.payTotal(loan.id);
          showDialog({
            title: "Éxito",
            message: "Pago total realizado correctamente",
            type: "success"
          });
          fetchLoans();
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

  const handleDownloadSchedule = async (loan: EquipmentLoanItem) => {
    try {
      const schedule = await equipmentLoanApi.getSchedule(loan.id);
      const headers = ['N° Cuota', 'Fecha Vencimiento', 'Monto', 'Estado'];
      const rows = schedule.installments.map(installment => [
        installment.number.toString(),
        installment.dueDate,
        formatCurrency(installment.amount),
        installment.status
      ]);
      await generatePDF({
        title: `Cronograma de Préstamo - ${loan.client.fullName}`,
        headers,
        data: rows,
        filename: `cronograma_prestamo_${loan.id}.pdf`
      });
    } catch (error) {
      showDialog({
        title: "Error",
        message: "No se pudo descargar el cronograma",
        type: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Préstamos de Equipos</h1>
      </div>

      <ColumnApp gap={6}>
        {/* Filtros */}
        <RowApp gap={4} className="items-end">
          <ColumnApp className="w-full sm:w-72">
            <AsyncClientCombobox
              selectedClientId={selectedClientId}
              onSelect={handleClientChange}
              placeholder="Seleccionar cliente"
            />
          </ColumnApp>

          <ColumnApp className="w-full sm:w-48">
            <Label>Estado</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">Todos</SelectItem>
                {Object.entries(EquipmentLoanStatusLabel).map(([code, label]) => (
                  <SelectItem key={code} value={code}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ColumnApp>
        </RowApp>

        <EquipmentLoanTable
          loans={paginatedLoans}
          onViewSchedule={handleViewSchedule}
          onPayInstallment={handlePayInstallment}
          onPayTotal={handlePayTotal}
          onDownloadSchedule={handleDownloadSchedule}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </ColumnApp>

      {selectedLoan && (
        <EquipmentLoanScheduleModal
          loan={selectedLoan}
          open={isScheduleModalOpen}
          onClose={handleScheduleModalClose}
        />
      )}
    </div>
  );
};

export default AdminEquipmentLoanListPage; 