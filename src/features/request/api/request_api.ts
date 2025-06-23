import { RequestTypeEnum } from '@/shared/enums/request-type.enum';
import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface CreateRequestDto {
  client: {
    name: string;
    document: string;
    email?: string;
    phone?: string;
    address?: string;
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
  client: {
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string;
  };
  requestTypeId: string;
  requestStatusId: string;
  equipmentId?: string;
  amount?: number;
  termInMonths?: number;
  termInDays?: number;
  interestRate?: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
  requestType: {
    name: string;
    code: string;
  };
  requestStatus: {
    name: string;
    code: string;
  };
}

export interface RequestStatusHistory {
  id: string;
  requestId: string;
  statusId: string;
  createdAt: string;
  status: {
    name: string;
    code: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
}

export const requestApi = {
  async create(data: CreateRequestDto): Promise<RequestItem> {
    console.log('🚀 Iniciando creación de solicitud:', {
      data,
      requestType: data.requestTypeId,
      clientInfo: data.client
    });

    return apiRequest<RequestItem>(
      api.post('/requests', data),
      {
        loading: 'Enviando solicitud...',
        success: 'Solicitud enviada correctamente',
        error: 'No se pudo enviar la solicitud',
      }
    ).then(response => {
      console.log('✅ Solicitud creada exitosamente:', response);
      return response;
    }).catch(error => {
      console.error('❌ Error al crear solicitud:', {
        error,
        errorMessage: error?.response?.data?.message,
        errorStatus: error?.response?.status
      });
      throw error;
    });
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

  async getAll(): Promise<RequestItem[]> {
    return apiRequest(
      api.get(`/requests`),
      {
        loading: 'Cargando solicitudes...',
        error: 'No se pudieron cargar las solicitudes',
      }
    );
  },

  async updateStatus(requestId: string, statusId: string): Promise<void> {
    return apiRequest(
      api.patch(`/requests/${requestId}/status`, { statusId }),
      {
        loading: 'Actualizando estado...',
        success: 'Estado actualizado correctamente',
        error: 'No se pudo actualizar el estado',
      }
    );
  },

  async convert(requestId: string): Promise<void> {
    return apiRequest(
      api.post(`/requests/${requestId}/convert`),
      {
        loading: 'Convirtiendo solicitud...',
        success: 'Solicitud convertida correctamente',
        error: 'No se pudo convertir la solicitud',
      }
    );
  },

  async getStatusHistory(requestId: string): Promise<RequestStatusHistory[]> {
    return apiRequest(
      api.get(`/requests/${requestId}/status-history`),
      {
        loading: 'Cargando historial...',
        error: 'No se pudo cargar el historial',
      }
    );
  },

  async getById(requestId: string): Promise<RequestItem> {
    return apiRequest(
      api.get(`/requests/${requestId}`),
      {
        loading: 'Cargando solicitud...',
        error: 'No se pudo cargar la solicitud',
      }
    );
  },

  async createPublic(data: {
    email: string;
    fullName: string;
    documentNumber: string;
    phone: string;
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
};
