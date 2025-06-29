import { api } from "@/shared/utils/api";
import { apiRequest } from "@/shared/utils/apiHelper";

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
    return apiRequest(
      api.get('/equipment-loans/my-loans'),
      {
        loading: 'Cargando préstamos de equipo...',
        error: 'Error al cargar los préstamos de equipo',
      }
    );
  },

  // Financiamiento de equipo
  getMyEquipmentFinancing: () => {
    return apiRequest(
      api.get('/equipment-financing/my-financing'),
      {
        loading: 'Cargando financiamientos...',
        error: 'Error al cargar los financiamientos',
      }
    );
  },
}; 