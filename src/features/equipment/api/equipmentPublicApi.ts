import { api } from '@/shared/utils/api';
import { AxiosResponse } from 'axios';
import { EquipmentItem } from './equipment_api';

export const equipmentPublicApi = {
  async getAll(): Promise<EquipmentItem[]> {
    const res: AxiosResponse<EquipmentItem[]> = await api.get('/public/equipment');
    return res.data;
  },

  async getById(id: string): Promise<EquipmentItem> {
    const res: AxiosResponse<EquipmentItem> = await api.get(`/public/equipment/${id}`);
    return res.data;
  },
};