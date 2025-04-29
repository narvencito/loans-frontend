import { apiRequest } from '@/shared/utils/apiHelper';
import { api } from '@/shared/utils/api';

export interface CreateCashLoanDto {
  clientId: string;
  amount: number;
  rate: number;
  term: number;
  startDate: Date;
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
  state: string;
  stateId: string;
}

export interface InstallmentItem {
  nro: number;
  fecha: string;
  interes: number;
  capital: number;
  saldo: number;
  cuota: number;
  status: string;
  id: string;
}

export interface CashLoanScheduleResponse {
  cuotas: InstallmentItem[];
  deudaTotal: number;
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

  async getCashLoansFiltered(filters: { clientId?: string; statusId?: string }) {
    const query = new URLSearchParams();
    if (filters.clientId) query.append("clientId", filters.clientId);
    if (filters.statusId) query.append("statusId", filters.statusId == 'all' ? '' : filters.statusId);
  
    return apiRequest<CashLoanItem[]>(
      api.get(`/cash-loans/filtered?${query.toString()}`),
      {
        loading: "Buscando préstamos...",
        error: "Error al buscar préstamos",
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

  async getSchedule(loanId: string): Promise<CashLoanScheduleResponse> {
    return apiRequest(
      api.get(`/cash-loans/${loanId}/schedule`),
      {
        loading: 'Cargando cronograma...',
        error: 'Error al obtener cronograma',
      }
    );
  },

  async payAllInstallments(loanId: string) {
    return api.patch(`/cash-loans/${loanId}/pay-all`);
  },

   async generateVoucherForLoan (loanId: string): Promise<Blob>  {
    return apiRequest<Blob>(
      api.post(`/cash-loans-printer/${loanId}/voucher`, undefined, { responseType: 'blob' } ),
      { loading: 'Generando voucher total...', success: 'Voucher total generado.' },
      
    );
  },
  
  async generateNoDebtCertificate (loanId: string): Promise<Blob> {
    return apiRequest<Blob>(
      api.post(`/cash-loans-printer/${loanId}/no-debt-certificate`, undefined, { responseType: 'blob' } ),
      { loading: 'Generando constancia de no adeudo...', success: 'Constancia de no adeudo generada.' }
    );
  },

};
