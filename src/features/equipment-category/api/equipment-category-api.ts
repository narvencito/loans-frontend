import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { EquipmentCategory } from "../types/equipment-category.types";

const BASE_URL = "/equipment-categories";

export const equipmentCategoryApi = {
  getAll: async (): Promise<EquipmentCategory[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getActive: async (): Promise<EquipmentCategory[]> => {
    const response = await api.get(`${BASE_URL}`);
    return response.data;
  },

  getById: async (id: string): Promise<EquipmentCategory> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: { name: string }): Promise<EquipmentCategory> => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: { name: string }): Promise<EquipmentCategory> => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<EquipmentCategory> => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
