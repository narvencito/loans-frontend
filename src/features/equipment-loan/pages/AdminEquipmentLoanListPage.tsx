import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentLoanTable } from "../components/EquipmentLoanTable";
import EquipmentLoanScheduleModal from "../components/EquipmentLoanScheduleModal";
import { equipmentLoanApi, EquipmentLoanItem } from "../api/equipment_loan_api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentLoanStatusCode, EquipmentLoanStatusLabel } from "../enums/equipment-loan-status.enum";
import AsyncClientCombobox from "@/features/client/components/AsyncClientCombobox";

type StatusFilterType = keyof typeof EquipmentLoanStatusCode | "all";

export const AdminEquipmentLoanListPage = () => {
  const [selectedLoan, setSelectedLoan] = useState<EquipmentLoanItem | null>(null);
  const [allLoans, setAllLoans] = useState<EquipmentLoanItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("all");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchLoans = async () => {
    try {
      const filters = {
        clientId: selectedClientId || undefined,
        statusCode: selectedStatus === "all" ? undefined : selectedStatus,
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

  return (
    <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Gestión de Préstamos de Equipos</h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mb-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 flex-grow">
            <div className="w-full sm:w-72">
              <AsyncClientCombobox
                selectedClientId={selectedClientId}
                onSelect={handleClientChange}
                label="Filtrar por cliente"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(EquipmentLoanStatusLabel).map(([code, label]) => (
                    <SelectItem key={code} value={code}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <EquipmentLoanTable
          loans={paginatedLoans}
          onViewSchedule={handleViewSchedule}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
        />

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