import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { ClientRequest, RequestFilters } from '../types/request.types';

export const clientRequestsApi = {
  // Temporalmente deshabilitados los filtros
  async getMyRequests(/*filters?: RequestFilters*/): Promise<ClientRequest[]> {
    /*const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);

    const queryString = params.toString();
    const url = `/requests/my-requests${queryString ? `?${queryString}` : ''}`;*/

    return apiRequest(
      api.get('/requests/my-requests'),
      {
        loading: 'Cargando solicitudes...',
        error: 'Error al cargar las solicitudes',
      }
    );
  },

  async getRequestById(id: string): Promise<ClientRequest> {
    return apiRequest(
      api.get(`/requests/${id}`),
      {
        loading: 'Cargando detalle de solicitud...',
        error: 'Error al cargar el detalle de la solicitud',
      }
    );
  },

  // Préstamos monetarios
  getMyCashLoans: () => {
    return apiRequest(
      api.get('/cash-loans/my-loans'),
      {
        loading: 'Cargando préstamos monetarios...',
        error: 'Error al cargar los préstamos monetarios',
      }
    );
  },

  // Préstamos de equipo
  getMyEquipmentLoans: () => {
    return apiRequest(
      api.get('/equipment-loans/my-loans'),
      {
        loading: 'Cargando préstamos de equipo...',
        error: 'Error al cargar los préstamos de equipo',
      }
    );
  },

  // Financiamiento de equipo
  getMyEquipmentFinancing: () => {
    return apiRequest(
      api.get('/equipment-financing/my-financing'),
      {
        loading: 'Cargando financiamientos...',
        error: 'Error al cargar los financiamientos',
      }
    );
  },
}; 