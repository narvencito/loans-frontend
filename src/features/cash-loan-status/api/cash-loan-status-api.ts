import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface CashLoanStatus {
  id: string;
  name: string;
  isActive: boolean;
}

export const CashLoanStatusApi = {
  async getAll(): Promise<CashLoanStatus[]> {
    return apiRequest(api.get('/cash-loan-statuses'), {
      loading: 'Cargando estados...',
      error: 'Error al cargar estados',
    });
  },

  async create(data: { name: string }): Promise<CashLoanStatus> {
    return apiRequest(api.post('/CashLoan-statuses', data), {
      loading: 'Creando estado...',
      success: 'Estado creado correctamente',
      error: 'No se pudo crear el estado',
    });
  },

  async update(id: string, data: { name: string }): Promise<CashLoanStatus> {
    return apiRequest(api.put(`/CashLoan-statuses/${id}`, data), {
      loading: 'Actualizando estado...',
      success: 'Estado actualizado',
      error: 'No se pudo actualizar el estado',
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest(api.delete(`/CashLoan-statuses/${id}`), {
      loading: 'Eliminando estado...',
      success: 'Estado eliminado correctamente',
      error: 'No se pudo eliminar el estado',
    });
  },
};
