import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface CreateEquipmentDto {
  code: string;
  name: string;
  categoryId: string;
  statusId: string;
  location?: string;
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {
  id: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  categoryName: string;
  statusId: string;
  statusName: string;
  location?: string;
  isActive: boolean;
}

export const equipmentApi = {
  async getAll(): Promise<EquipmentItem[]> {
    return apiRequest(
      api.get('/equipment'),
      {
        loading: 'Cargando equipos...',
        error: 'No se pudieron cargar los equipos',
      }
    );
  },

  async create(data: CreateEquipmentDto): Promise<EquipmentItem> {
    return apiRequest(
      api.post('/equipment', data),
      {
        loading: 'Registrando equipo...',
        success: 'Equipo creado correctamente',
        error: 'No se pudo registrar el equipo',
      }
    );
  },

  async update(id: string, data: UpdateEquipmentDto): Promise<EquipmentItem> {
    return apiRequest(
      api.put(`/equipment/${id}`, data),
      {
        loading: 'Actualizando equipo...',
        success: 'Equipo actualizado correctamente',
        error: 'No se pudo actualizar el equipo',
      }
    );
  },

  async delete(id: string): Promise<void> {
    return apiRequest(
      api.delete(`/equipment/${id}`),
      {
        loading: 'Eliminando equipo...',
        success: 'Equipo eliminado correctamente',
        error: 'No se pudo eliminar el equipo',
      }
    );
  },
};
