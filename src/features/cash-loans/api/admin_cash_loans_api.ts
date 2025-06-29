import { api } from '@/shared/utils/api';

export interface CashLoanItem {
  id: string;
  clientId: string;
  client: {
    id: string;
    fullName: string;
  };
  amount: number;
  term: number;
  rate: number;
  startDate: string;
  status: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateCashLoanDto {
  clientId: string;
  amount: number;
  term: number;
  rate: number;
  startDate: string;
}

export interface CashLoanScheduleItem {
  number: number;
  dueDate: string;
  amount: number;
  interest: number;
  principal: number;
  balance: number;
  status: string;
}

const BASE_URL = '/admin/cash-loans';

export const adminCashLoanApi = {
  getCashLoansFiltered: async (filters: { clientId?: string; statusId?: string }) => {
    const response = await api.get<CashLoanItem[]>(BASE_URL, { params: filters });
    return response.data;
  },

  createCashLoan: async (data: CreateCashLoanDto) => {
    const response = await api.post<CashLoanItem>(BASE_URL, data);
    return response.data;
  },

  getSchedule: async (loanId: string) => {
    const response = await api.get<CashLoanScheduleItem[]>(`${BASE_URL}/${loanId}/schedule`);
    return response.data;
  },

  toggleStatus: async (loanId: string) => {
    const response = await api.patch<CashLoanItem>(`${BASE_URL}/${loanId}/toggle-status`);
    return response.data;
  }
}; 