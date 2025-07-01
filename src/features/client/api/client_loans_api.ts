import { api } from "@/shared/utils/api";
import { apiRequest } from "@/shared/utils/apiHelper";
import { ClientRequest } from "../types/request.types";
import { EquipmentLoanItem } from "@/features/equipment-loan/api/equipment_loan_api";
import { EquipmentFinancing } from "@/features/equipment-financing/types/equipment-financing.types";

export const clientLoansApi = {
  // Préstamos monetarios
  getMyCashLoans: () => {
    return apiRequest(
      api.get('/cash-loans/my-loans'),
      {
        loading: 'Cargando préstamos monetarios...',
        error: 'Error al cargar los préstamos monetarios',
      }
    );
  },

  // Préstamos de equipo
  getMyEquipmentLoans: () => {
    return apiRequest<EquipmentLoanItem[]>(
      api.get('/equipment-loans/my-loans'),
      {
        loading: 'Cargando préstamos de equipo...',
        error: 'Error al cargar los préstamos de equipo',
      }
    );
  },

  // Financiamiento de equipo
  getMyEquipmentFinancing: () => {
    return apiRequest<EquipmentFinancing[]>(
      api.get('/equipment-financing/my-financing'),
      {
        loading: 'Cargando financiamientos...',
        error: 'Error al cargar los financiamientos',
      }
    );
  },
}; 