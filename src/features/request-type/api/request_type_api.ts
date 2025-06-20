import { apiRequest } from '@/shared/utils/apiHelper';
import { api } from '@/shared/utils/api';

export interface RequestType {
  id: string;
  name: string;
  code: string;
}

export const RequestTypeApi = {
  async getAll(): Promise<RequestType[]> {
    return apiRequest(
      api.get('/request-types'),
      {
        loading: 'Cargando tipos de solicitud...',
        error: 'No se pudieron cargar los tipos de solicitud',
      }
    );
  },
};
