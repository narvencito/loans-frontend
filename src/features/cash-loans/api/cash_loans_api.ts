import { apiRequest } from '@/shared/utils/apiHelper';
import { api } from '@/shared/utils/api';

export interface CreateCashLoanDto {
  clientId: string;
  amount: number;
  rate: number;
  term: number;
  startDate: string;
}

export interface CashLoanItem {
  id: string;
  clientName: string;
  clientId: string;
  amount: number;
  rate: number;
  term: number;
  startDate: string;
  isActive: boolean;
}

export interface InstallmentItem {
  nro: number;
  fecha: string;
  capital: number;
  interes: number;
  saldo: number;
  cuota: number;
}

export const cashLoanApi = {
  async getCashLoans(): Promise<CashLoanItem[]> {
    return apiRequest(
      api.get('/cash-loans'),
      {
        loading: 'Cargando préstamos...',
        error: 'Error al cargar préstamos',
      }
    );
  },

  async createCashLoan(data: CreateCashLoanDto) {
    return apiRequest(
      api.post('/cash-loans', data),
      {
        loading: 'Creando préstamo...',
        success: 'Préstamo creado correctamente',
        error: 'No se pudo crear el préstamo',
      }
    );
  },

  async deleteCashLoan(id: string) {
    return apiRequest(
      api.delete(`/cash-loans/${id}`),
      {
        loading: 'Eliminando préstamo...',
        success: 'Préstamo eliminado correctamente',
        error: 'Error al eliminar préstamo',
      }
    );
  },

  async getSchedule(loanId: string): Promise<InstallmentItem[]> {
    return apiRequest(
      api.get(`/cash-loans/${loanId}/schedule`),
      {
        loading: 'Cargando cronograma...',
        error: 'Error al obtener cronograma',
      }
    );
  },

};
