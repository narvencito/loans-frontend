import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { GeneralCategory } from "../types/general-category.types";

const BASE_URL = "/general-categories";

export interface CreateGeneralCategoryDto {
  name: string;
}

export interface UpdateGeneralCategoryDto {
  name: string;
}

export const generalCategoryApi = {
  getAll: async (): Promise<GeneralCategory[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getActive: async (): Promise<GeneralCategory[]> => {
    const response = await api.get(`${BASE_URL}`);
    return response.data;
  },

  create: async (data: { name: string }): Promise<GeneralCategory> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: { name: string }): Promise<GeneralCategory> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<GeneralCategory> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  restore(id: string): Promise<GeneralCategory> {
    return apiRequest(
      api.patch(`${BASE_URL}/${id}/restore`),
      {
        loading: 'Restaurando perfil de uso...',
        success: 'Perfil de uso restaurado exitosamente',
        error: 'Error al restaurar perfil de uso',
      }
    );
  }
}; 