import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

interface Client {
  id: string;
  name: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  code: string;
  serial: string;
}

interface FinancingStatus {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface EquipmentFinancingFilters {
  clientId?: string;
  statusId?: string;
  equipmentId?: string;
}

export interface EquipmentFinancingItem {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  equipmentId: string;
  equipmentName: string;
  amount: number;
  termInMonths: number;
  interestRate: number;
  status: string;
  startDate: string;
  endDate: string;
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

interface PaymentNotes {
  notes?: string;
}

export const equipmentFinancingApi = {
  async getAll(filters: EquipmentFinancingFilters = {}): Promise<EquipmentFinancingItem[]> {
    return apiRequest(
      api.get('/equipment-financing', { params: filters }),
      {
        loading: 'Cargando financiamientos...',
        error: 'Error al cargar los financiamientos',
      }
    );
  },

  async getById(id: string): Promise<EquipmentFinancingItem> {
    return apiRequest(
      api.get(`/equipment-financing/${id}`),
      {
        loading: 'Cargando financiamiento...',
        error: 'Error al cargar el financiamiento',
      }
    );
  },

  async delete(id: string): Promise<void> {
    return apiRequest(
      api.delete(`/equipment-financing/${id}`),
      {
        loading: 'Eliminando financiamiento...',
        success: 'Financiamiento eliminado correctamente',
        error: 'Error al eliminar el financiamiento',
      }
    );
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

  async payInstallment(financingId: string, installmentId: string, data?: PaymentNotes) {
    return apiRequest(
      api.patch(`/financing-installments/${installmentId}/pay`, data),
      {
        loading: 'Procesando pago...',
        success: 'Pago realizado correctamente',
        error: 'Error al procesar el pago',
      }
    );
  },

  async payAll(financingId: string, data?: PaymentNotes) {
    return apiRequest(
      api.post(`/equipment-financing/${financingId}/pay-all`, data),
      {
        loading: 'Procesando pago total...',
        success: 'Pago total realizado correctamente',
        error: 'Error al procesar el pago total',
      }
    );
  },

  async generateVoucher(financingId: string): Promise<Blob> {
    return apiRequest<Blob>(
      api.post(`/equipment-financing-printer/${financingId}/voucher`, undefined, { responseType: 'blob' }),
      { 
        loading: 'Generando voucher...', 
        success: 'Voucher generado correctamente' 
      }
    );
  },

  async generateNoDebtCertificate(financingId: string): Promise<Blob> {
    return apiRequest<Blob>(
      api.post(`/equipment-financing-printer/${financingId}/no-debt-certificate`, undefined, { responseType: 'blob' }),
      { 
        loading: 'Generando constancia de no adeudo...', 
        success: 'Constancia de no adeudo generada correctamente' 
      }
    );
  }
};
