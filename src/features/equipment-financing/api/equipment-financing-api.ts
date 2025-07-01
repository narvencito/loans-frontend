import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

interface Client {
  id: string;
  name: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  document: string;
  email: string;
  phone: string;
  address: string | null;
  codeStudent: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  userId: string;
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  code: string;
  serial: string;
  location: string;
  number: number;
  purchasePrice: number;
  salePrice: number;
  rentalDailyRate: number;
  usageTypeId: string;
  brand: string;
  brandId: string;
  categoryId: string;
  generalCategoryId: string;
  statusId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FinancingStatus {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InstallmentStatus {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Installment {
  id: string;
  financingId: string;
  number: number;
  dueDate: string;
  amount: number;
  capital: number;
  interest: number;
  balance: number;
  statusId: string;
  paymentDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  status: InstallmentStatus;
}

export interface EquipmentFinancingFilters {
  clientId?: string;
  statusId?: string;
  equipmentId?: string;
}

export interface EquipmentFinancingItem {
  id: string;
  clientId: string;
  equipmentId: string;
  totalAmount: number;
  downPayment: number;
  financedAmount: number;
  annualRate: number;
  term: number;
  startDate: string;
  requestId: string;
  statusId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  client: Client;
  status: FinancingStatus;
  equipment: Equipment;
  installments: Installment[];
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
