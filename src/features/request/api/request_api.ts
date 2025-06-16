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

export interface RequestItem {
  id: string;
  clientId: string;
  requestTypeId: string;
  requestStatusId: string;
  message?: string;
  equipmentId?: string;
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

export const requestApi = {
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
};
