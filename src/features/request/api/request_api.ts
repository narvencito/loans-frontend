import { RequestTypeEnum } from '@/shared/enums/request-type.enum';
import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { RequestStatusCode } from "../enums/request-status.enum";

export interface CreateRequestDto {
  client: {
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    name: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    codeStudent: string;
  };
  requestTypeId: string;
  equipmentId?: string;
  message?: string;
}

export interface CreateRequestAdminDto {
  clientId: string;
  requestTypeId: RequestTypeEnum;
  equipmentId?: string;
  amount?: number;
  termInMonths?: number;
  interestRate?: number;
  termInDays?: number;
  message?: string;
}

export interface RequestItem {
  id: string;
  clientId: string;
  equipmentId: string | null;
  requestTypeId: string;
  requestStatusId: string;
  message: string;
  status: string;
  interestRate: number | null;
  amount: number | null;
  termInMonths: number | null;
  termInDays: number | null;
  createdAt: string;
  requestType: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  };
  requestStatus: {
    id: string;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  client: {
    id: string;
    name: string;
    fullName: string;
    paternalSurname: string;
    maternalSurname: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    userId: string;
    codeStudent: string;
  };
  equipment?: {
    id: string;
    name: string;
    description: string;
    code: string;
    number: number;
    serial: string;
    location: string;
    purchasePrice: number;
    salePrice: number;
    generalCategoryId: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    statusId: string;
    installmentStatusId: string | null;
    categoryId: string;
  };
}

export interface StatusHistoryItem {
  id: string;
  requestId: string;
  statusId: string;
  previousStatusId: string | null;
  comments: string;
  createdAt: string;
  createdBy: string;
  status: {
    id: string;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  previousStatus: {
    id: string;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StatusHistoryResponse {
  request: RequestItem;
  statusHistory: StatusHistoryItem[];
}

interface RequestFilters {
  clientId?: string;
  type?: string;
  status?: string;
}

interface ConvertRequestDto {
  downPayment?: number;
}

export const requestApi = {
  async getAll(): Promise<RequestItem[]> {
    return apiRequest(
      api.get('/requests'),
      {
        loading: 'Cargando solicitudes...',
        error: 'No se pudieron cargar las solicitudes',
      }
    );
  },

  async getById(id: string): Promise<RequestItem> {
    return apiRequest(
      api.get(`/requests/${id}`),
      {
        loading: 'Cargando solicitud...',
        error: 'No se pudo cargar la solicitud',
      }
    );
  },

  async create(data: CreateRequestDto): Promise<RequestItem> {
    return apiRequest(
      api.post('/requests', data),
      {
        loading: 'Enviando solicitud...',
        success: 'Solicitud enviada correctamente',
        error: 'No se pudo enviar la solicitud',
      }
    );
  },

  async update(id: string, data: Partial<CreateRequestDto>): Promise<RequestItem> {
    return apiRequest(
      api.patch(`/requests/${id}`, data),
      {
        loading: 'Actualizando solicitud...',
        success: 'Solicitud actualizada correctamente',
        error: 'No se pudo actualizar la solicitud',
      }
    );
  },

  async delete(id: string): Promise<void> {
    return apiRequest(
      api.delete(`/requests/${id}`),
      {
        loading: 'Eliminando solicitud...',
        success: 'Solicitud eliminada correctamente',
        error: 'No se pudo eliminar la solicitud',
      }
    );
  },

  async createPublic(data: {
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    document: string;
    email: string;
    phone: string;
    address: string;
    codeStudent: string;
    type: RequestTypeEnum;
    equipmentId?: string;
    message?: string;
  }): Promise<RequestItem> {
    return apiRequest(
      api.post('/requests/public', data),
      {
        loading: 'Enviando solicitud...',
        success: 'Solicitud enviada correctamente',
        error: 'No se pudo enviar la solicitud',
      }
    );
  },

  async createAdmin(data: CreateRequestAdminDto): Promise<RequestItem> {
    return apiRequest(
      api.post('/requests/admin', data),
      {
        loading: 'Creando solicitud...',
        success: 'Solicitud creada correctamente',
        error: 'No se pudo crear la solicitud',
      }
    );
  },

  async getByClient(clientId: string): Promise<RequestItem[]> {
    return apiRequest(
      api.get(`/requests/client/${clientId}`),
      {
        loading: 'Cargando tus solicitudes...',
        error: 'No se pudieron cargar las solicitudes',
      }
    );
  },

  async updateStatus(requestId: string, status: RequestStatusCode, comments?: string): Promise<void> {
    return apiRequest(
      api.post(`/requests/${requestId}/status`, { 
        status,
        comments 
      })
    );
  },

  async convert(requestId: string, data?: ConvertRequestDto): Promise<void> {
    return apiRequest(
      api.post(`/requests/${requestId}/convert`, data),
      {
        loading: 'Convirtiendo solicitud...',
        success: 'Solicitud convertida correctamente',
      }
    );
  },

  async getStatusHistory(requestId: string): Promise<StatusHistoryResponse> {
    return apiRequest(
      api.get(`/requests/${requestId}/status-history`),
      {
        loading: 'Cargando historial...',
        error: 'No se pudo cargar el historial',
      }
    );
  },

  async getByFilter(filters: RequestFilters): Promise<RequestItem[]> {
    const query = new URLSearchParams();
    
    if (filters.clientId) {
      query.append('clientId', filters.clientId);
    }
    if (filters.type && filters.type !== 'all') {
      query.append('type', filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      query.append('status', filters.status);
    }

    return apiRequest(
      api.get(`/requests?${query.toString()}`),
      {
        loading: 'Buscando solicitudes...',
        error: 'No se pudieron buscar las solicitudes',
      }
    );
  },
};
