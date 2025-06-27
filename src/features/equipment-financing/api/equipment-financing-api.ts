import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

interface FinancingStatus {
  id: string;
  name: string;
}

export interface EquipmentFinancingItem {
  id: string;
  clientId: string;
  clientName: string;
  equipmentId: string;
  equipmentName: string;
  totalAmount: number;
  downPayment: number;
  financedAmount: number;
  annualRate: number;
  term: number;
  startDate: string;
  status: FinancingStatus;
  requestId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentFinancingDto {
  clientId: string;
  equipmentId: string;
  totalAmount: number;
  downPayment: number;
}

export interface UpdateEquipmentFinancingDto extends CreateEquipmentFinancingDto {
  id: string;
}

export const equipmentFinancingApi = {
  getAll(): Promise<EquipmentFinancingItem[]> {
    return apiRequest(api.get('/equipment-financing'), {
      loading: 'Cargando financiamientos...',
      error: 'No se pudieron cargar los financiamientos',
    });
  },

  create(data: CreateEquipmentFinancingDto): Promise<EquipmentFinancingItem> {
    return apiRequest(api.post('/equipment-financing', data), {
      loading: 'Registrando...',
      success: 'Financiamiento creado',
      error: 'No se pudo crear el financiamiento',
    });
  },

  update(id: string, data: UpdateEquipmentFinancingDto): Promise<EquipmentFinancingItem> {
    return apiRequest(api.put(`/equipment-financing/${id}`, data), {
      loading: 'Actualizando...',
      success: 'Financiamiento actualizado',
      error: 'No se pudo actualizar el financiamiento',
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest(api.delete(`/equipment-financing/${id}`), {
      loading: 'Eliminando...',
      success: 'Financiamiento eliminado',
      error: 'No se pudo eliminar el financiamiento',
    });
  },
};
