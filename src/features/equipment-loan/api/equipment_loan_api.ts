import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface EquipmentLoanItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  accumulatedAmount: number;
  initialPayment: number;
  dailyRate: number;
  deliveryDate?: string;
  returnDate?: string;
}

export interface EquipmentLoanFilters {
  clientId?: string;
  equipmentId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

export const equipmentLoanApi = {
  getByFilter(filters: EquipmentLoanFilters): Promise<EquipmentLoanItem[]> {
    return apiRequest(
      api.post('/equipment-loans/search', filters),
      {
        loading: 'Cargando préstamos...',
        error: 'Error al cargar préstamos',
      }
    );
  },

  getById(id: string): Promise<EquipmentLoanItem> {
    return apiRequest(
      api.get(`/equipment-loans/${id}`),
      {
        loading: 'Cargando préstamo...',
        error: 'No se pudo cargar el préstamo',
      }
    );
  },

  getSchedule(id: string): Promise<EquipmentLoanSchedule> {
    return apiRequest(
      api.get(`/equipment-loans/${id}/schedule`),
      {
        loading: 'Cargando cronograma...',
        error: 'Error al cargar cronograma',
      }
    );
  },

  create(data: any): Promise<EquipmentLoanItem> {
    return apiRequest(
      api.post('/equipment-loans', data),
      {
        loading: 'Creando préstamo...',
        success: 'Préstamo creado exitosamente',
        error: 'Error al crear préstamo',
      }
    );
  },

  deliver(id: string, data: DeliverEquipmentDto): Promise<EquipmentLoanItem> {
    return apiRequest(
      api.post(`/equipment-loans/${id}/deliver`, data),
      {
        loading: 'Entregando equipo...',
        success: 'Equipo entregado exitosamente',
        error: 'Error al entregar equipo',
      }
    );
  },

  makePayment(id: string, data: PaymentDto): Promise<PaymentResponse> {
    return apiRequest(
      api.post(`/equipment-loans/${id}/payments`, data),
      {
        loading: 'Registrando pago...',
        success: 'Pago registrado exitosamente',
        error: 'Error al registrar pago',
      }
    );
  },

  returnEquipment(id: string, data: ReturnEquipmentDto): Promise<EquipmentLoanItem> {
    return apiRequest(
      api.post(`/equipment-loans/${id}/return`, data),
      {
        loading: 'Retornando equipo...',
        success: 'Equipo retornado exitosamente',
        error: 'Error al retornar equipo',
      }
    );
  },
}; 