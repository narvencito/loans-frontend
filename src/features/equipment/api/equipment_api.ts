import { EquipmentFeature, ImageApp } from '@/features/equipment-feature/api/equipment-feature-api';
import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface CreateEquipmentDto {
  code: string;
  name: string;
  categoryId: string;
  statusId: string;
  location?: string;
  serial?: string;
  number?: string;
  purchasePrice: number,
  salePrice: number,
  featureIds?: string[];
  images?: ImageApp[];
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {
  id: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  serial: string;
  number: string;
  purchasePrice: number;
  salePrice: number;
  categoryId: string;
  categoryName: string;
  statusId: string;
  statusName: string;
  location?: string;
  isActive: boolean;
  features: EquipmentFeature[];
  images: ImageApp[];
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

  async create(data: FormData): Promise<EquipmentItem> {
    return apiRequest(
      api.post('/equipment', data),
      {
        loading: 'Registrando equipo...',
        success: 'Equipo creado correctamente',
        error: 'No se pudo registrar el equipo',
      }
    );
  },

  async update(id: string, data: FormData): Promise<EquipmentItem> {
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

  async getById(id: string): Promise<EquipmentItem> {
    return apiRequest(api.get(`/equipment/${id}`), {
      loading: 'Cargando equipo...',
      error: 'No se pudo cargar el equipo',
    });
  },

  async searchByNameOrCode(query: string): Promise<EquipmentItem[]> {
    return apiRequest(api.get(`/equipment/search?query=${encodeURIComponent(query)}`), {
      loading: 'Buscando equipos...',
      error: 'No se pudieron buscar los equipos',
    });
  },

   async deleteImageByUrl(url: string): Promise<void> {
    return apiRequest(
      api.delete('/equipment/images/by-url', { params: { url } }),
      {
        loading: 'Eliminando imagen...',
        success: 'Imagen eliminada correctamente',
        error: 'No se pudo eliminar la imagen',
      }
    );
  },
};
