import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { PaginatedResponse } from '@/shared/types/pagination.types';
import { EquipmentLoanStatusCode } from '../enums/equipment-loan-status.enum';

export interface EquipmentLoanFilters {
  clientId?: string;
  statusCode?: string;
}

export interface Client {
  id: string;
  name: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  phone: string;
  address: string | null;
  document: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  salePrice: number;
  rentalDailyRate: number;
}

export interface LoanStatus {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface EquipmentLoanItem {
  id: string;
  clientId: string;
  equipmentId: string;
  requestId: string;
  deliveryDate: string | null;
  returnDate: string | null;
  dailyRate: number;
  totalAmount: number;
  downPayment: number;
  paidDays: number;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  equipment: Equipment;
  client: Client;
  status: LoanStatus;
}

export interface EquipmentLoanSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  baseAmount: number;
  penaltyAmount: number;
  paidAmount: number;
  pendingAmount: number;
  accumulatedAmount: number;
  initialPayment: number;
  dailyRate: number;
  totalDays: number;
  paidDays: number;
  pendingDays: number;
  delayDays: number;
  deliveryDate?: string;
  returnDate?: string;
  equipment: {
    id: string;
    name: string;
    description: string;
    salePrice: number;
    rentalDailyRate: number;
  };
  client: {
    id: string;
    name: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    fullName: string;
    document: string;
    email: string;
    phone: string;
  };
  payments: {
    id: string;
    date: string;
    amount: number;
    type: string;
    status: string;
  }[];
  installments: {
    number: number;
    dueDate: string;
    amount: number;
    status: string;
  }[];
}

export interface CreateEquipmentLoanDto {
  clientId: string;
  equipmentId: string;
  dailyRate: number;
  startDate: string;
  endDate: string;
}

export interface DeliverEquipmentDto {
  deliveryDate: string;
  initialPayment: number;
}

export interface PaymentDto {
  date: string;
  amount: number;
}

export interface ReturnEquipmentDto {
  returnDate: string;
  finalPayment?: number;
}

export interface LoanPaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  accumulatedAmount: number;
}

export interface PaymentResponse {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
}

export interface DeliverLoanRequest {
  deliveryDate: string;
  document: File;
}

export interface ReturnLoanRequest {
  returnDate: string;
}

export interface ChangeStatusDto {
  status: EquipmentLoanStatusCode;
  advancePayment?: number;
  notes: string;
  date?: string;
}

export const equipmentLoanApi = {
  getAll: async (filters: EquipmentLoanFilters = {}): Promise<EquipmentLoanItem[]> => {
    return apiRequest(
      api.post('/equipment-loans/search', filters),
      {
        loading: 'Cargando préstamos...',
        error: 'Error al cargar préstamos',
      }
    );
  },

  getById: async (id: string): Promise<EquipmentLoanItem> => {
    return apiRequest(
      api.get(`/equipment-loans/${id}`),
      {
        loading: 'Cargando préstamo...',
        error: 'Error al cargar préstamo',
      }
    );
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(
      api.delete(`/equipment-loans/${id}`),
      {
        loading: 'Eliminando préstamo...',
        success: 'Préstamo eliminado correctamente',
        error: 'Error al eliminar el préstamo',
      }
    );
  },

  getSchedule: async (id: string): Promise<EquipmentLoanSchedule> => {
    return apiRequest(
      api.get(`/equipment-loans/${id}/schedule`),
      {
        loading: 'Cargando cronograma...',
        error: 'Error al cargar cronograma',
      }
    );
  },

  create: async (data: CreateEquipmentLoanDto): Promise<EquipmentLoanItem> => {
    return apiRequest(
      api.post('/equipment-loans', data),
      {
        loading: 'Creando préstamo...',
        success: 'Préstamo creado exitosamente',
        error: 'Error al crear préstamo',
      }
    );
  },

  deliver: async (id: string, data: DeliverLoanRequest): Promise<EquipmentLoanItem> => {
    const formData = new FormData();
    formData.append('deliveryDate', data.deliveryDate);
    formData.append('document', data.document);

    return apiRequest(
      api.post(`/equipment-loans/${id}/deliver`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        loading: 'Entregando equipo...',
        success: 'Equipo entregado exitosamente',
        error: 'Error al entregar equipo',
      }
    );
  },

  makePayment: async (id: string, data: PaymentDto): Promise<PaymentResponse> => {
    return apiRequest(
      api.post(`/equipment-loans/${id}/payments`, data),
      {
        loading: 'Registrando pago...',
        success: 'Pago registrado exitosamente',
        error: 'Error al registrar pago',
      }
    );
  },

  return: async (id: string, data: ReturnLoanRequest): Promise<EquipmentLoanItem> => {
    return apiRequest(
      api.post(`/equipment-loans/${id}/return`, data),
      {
        loading: 'Registrando devolución...',
        success: 'Devolución registrada exitosamente',
        error: 'Error al registrar devolución',
      }
    );
  },

  changeStatus: async (id: string, data: ChangeStatusDto): Promise<EquipmentLoanItem> => {
    return apiRequest(
      api.patch(`/equipment-loans/${id}/status`, data),
      {
        loading: 'Actualizando estado...',
        success: 'Estado actualizado exitosamente',
        error: 'Error al actualizar el estado',
      }
    );
  },

  payInstallment: async (id: string): Promise<void> => {
    return apiRequest(
      api.post(`/equipment-loans/${id}/pay-installment`),
      {
        loading: 'Procesando pago...',
        success: 'Pago realizado correctamente',
        error: 'Error al procesar el pago',
      }
    );
  },

  payTotal: async (id: string): Promise<void> => {
    return apiRequest(
      api.post(`/equipment-loans/${id}/pay-total`),
      {
        loading: 'Procesando pago total...',
        success: 'Pago total realizado correctamente',
        error: 'Error al procesar el pago total',
      }
    );
  },
}; 