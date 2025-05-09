import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface EquipmentFeature {
  id: string;
  name: string;
  isActive: boolean;
  icon?: string;
}

export const equipmentFeatureApi = {
  async getAll(): Promise<EquipmentFeature[]> {
    return apiRequest(api.get('/equipment-features'), {
      loading: 'Cargando características...',
      error: 'Error al cargar características',
    });
  },

  async getAllActive(): Promise<EquipmentFeature[]> {
    return apiRequest(api.get('/equipment-features/active'), {
      loading: 'Cargando características activas...',
      error: 'Error al cargar características activas',
    });
  },

  async create(data: { name: string; icon?: string }): Promise<EquipmentFeature> {
    return apiRequest(api.post('/equipment-features', data), {
      loading: 'Creando característica...',
      success: 'Característica creada correctamente',
      error: 'No se pudo crear la característica',
    });
  },

  async update(id: string, data: { name?: string; icon?: string }): Promise<EquipmentFeature> {
    return apiRequest(api.patch(`/equipment-features/${id}`, data), {
      loading: 'Actualizando característica...',
      success: 'Característica actualizada',
      error: 'No se pudo actualizar la característica',
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest(api.patch(`/equipment-features/${id}/delete`), {
      loading: 'Actualizando característica...',
      success: 'Característica actualizada correctamente',
      error: 'No se pudo actualizar la característica',
    });
  },
};
