import { api } from '@/shared/utils/api';
import { AxiosResponse } from 'axios';
import { EquipmentDto } from '../model/EquipmentDto';

export const equipmentPublicApi = {
  async getAll(): Promise<EquipmentDto[]> {
    const res: AxiosResponse<EquipmentDto[]> = await api.get('/public/equipment');
    return res.data;
  },

  async getById(id: string): Promise<EquipmentDto> {
    const res: AxiosResponse<EquipmentDto> = await api.get(`/public/equipment/${id}`);
    return res.data;
  },
};