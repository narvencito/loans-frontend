import { api } from '@/shared/utils/api';
import { AxiosResponse } from 'axios';

export interface CountResponse {
  totalClients: number;
  totalLoans: number;
  totalInstallments: number;
}

export interface LatestLoan {
  client: string;
  amount: number;
  type: string;
  createdAt: string;
}

export const dashboardApi = {
  async getClientCount(): Promise<number> {
    const res: AxiosResponse<{ totalClients: number }> = await api.get('/admin-dashboard/clients/count');
    return res.data.totalClients;
  },

  async getLoanCount(): Promise<number> {
    const res: AxiosResponse<{ totalLoans: number }> = await api.get('/admin-dashboard/loans/count');
    return res.data.totalLoans;
  },

  async getInstallmentCount(): Promise<number> {
    const res: AxiosResponse<{ totalInstallments: number }> = await api.get('/admin-dashboard/installments/count');
    return res.data.totalInstallments;
  },

  async getLatestLoans(): Promise<LatestLoan[]> {
    const res: AxiosResponse<{ latestLoans: LatestLoan[] }> = await api.get('/admin-dashboard/loans/latest');
    return res.data.latestLoans;
  },
};
