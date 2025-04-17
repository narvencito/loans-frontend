import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface EquipmentCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const equipmentCategoryApi = {
  async getAll(): Promise<EquipmentCategory[]> {
    return apiRequest(api.get('/equipment-categories'), {
      loading: 'Cargando categorías...',
      error: 'Error al cargar categorías',
    });
  },

  async create(data: { name: string }): Promise<EquipmentCategory> {
    return apiRequest(api.post('/equipment-categories', data), {
      loading: 'Creando categoría...',
      success: 'Categoría creada correctamente',
      error: 'No se pudo crear la categoría',
    });
  },

  async update(id: string, data: { name: string }): Promise<EquipmentCategory> {
    return apiRequest(api.put(`/equipment-categories/${id}`, data), {
      loading: 'Actualizando categoría...',
      success: 'Categoría actualizada',
      error: 'No se pudo actualizar la categoría',
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest(api.delete(`/equipment-categories/${id}`), {
      loading: 'Eliminando categoría...',
      success: 'Categoría eliminada correctamente',
      error: 'No se pudo eliminar la categoría',
    });
  },
};
