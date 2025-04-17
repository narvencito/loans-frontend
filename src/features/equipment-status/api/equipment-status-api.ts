import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface EquipmentStatus {
  id: string;
  name: string;
  isActive: boolean;
}

export const equipmentStatusApi = {
  async getAll(): Promise<EquipmentStatus[]> {
    return apiRequest(api.get('/equipment-statuses'), {
      loading: 'Cargando estados...',
      error: 'Error al cargar estados',
    });
  },

  async create(data: { name: string }): Promise<EquipmentStatus> {
    return apiRequest(api.post('/equipment-statuses', data), {
      loading: 'Creando estado...',
      success: 'Estado creado correctamente',
      error: 'No se pudo crear el estado',
    });
  },

  async update(id: string, data: { name: string }): Promise<EquipmentStatus> {
    return apiRequest(api.put(`/equipment-statuses/${id}`, data), {
      loading: 'Actualizando estado...',
      success: 'Estado actualizado',
      error: 'No se pudo actualizar el estado',
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest(api.delete(`/equipment-statuses/${id}`), {
      loading: 'Eliminando estado...',
      success: 'Estado eliminado correctamente',
      error: 'No se pudo eliminar el estado',
    });
  },
};
