import { api } from "@/shared/utils/api";
import { apiRequest } from "@/shared/utils/apiHelper";

export interface RequestType {
  id: string;
  name: string;
  code: string;
}

export const requestTypeApi = {
  async getAll(): Promise<RequestType[]> {
    return apiRequest(
      api.get('/public/request-types'),
      {
        loading: 'Cargando tipos de solicitud...',
        error: 'No se pudieron cargar los tipos de solicitud',
      }
    );
  },
};