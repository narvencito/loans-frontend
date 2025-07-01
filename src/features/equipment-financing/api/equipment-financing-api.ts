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

  payInstallment(financingId: string, installmentId: string): Promise<EquipmentFinancingItem> {
    return apiRequest(
      api.post(`/equipment-financing/${financingId}/installments/${installmentId}/pay`),
      {
        loading: 'Procesando pago...',
        success: 'Cuota pagada exitosamente',
        error: 'No se pudo procesar el pago',
      }
    );
  },

  payAllInstallments(financingId: string): Promise<EquipmentFinancingItem> {
    return apiRequest(
      api.post(`/equipment-financing/${financingId}/pay-all`),
      {
        loading: 'Procesando pago total...',
        success: 'Pago total realizado exitosamente',
        error: 'No se pudo procesar el pago total',
      }
    );
  },

  generatePaymentVoucher(financingId: string, installmentId: string): Promise<Blob> {
    return apiRequest(
      api.get(`/equipment-financing/${financingId}/installments/${installmentId}/voucher`, { responseType: 'blob' }),
      {
        loading: 'Generando comprobante...',
        error: 'No se pudo generar el comprobante',
      }
    );
  },

  generateNoDebtCertificate(financingId: string): Promise<Blob> {
    return apiRequest(
      api.get(`/equipment-financing/${financingId}/no-debt-certificate`, { responseType: 'blob' }),
      {
        loading: 'Generando certificado...',
        error: 'No se pudo generar el certificado',
      }
    );
  }
};
