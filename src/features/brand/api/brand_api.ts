import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateBrandDto {
  name: string;
}

export interface UpdateBrandDto {
  name: string;
}

export const brandApi = {
  getAll(): Promise<Brand[]> {
    return apiRequest(
      api.get('/brands'),
      {
        loading: 'Cargando marcas...',
        error: 'Error al cargar marcas',
      }
    );
  },

  getActive(): Promise<Brand[]> {
    return apiRequest(
      api.get('/brands?active=true'),
      {
        loading: 'Cargando marcas...',
        error: 'Error al cargar marcas',
      }
    );
  },

  create(data: CreateBrandDto): Promise<Brand> {
    return apiRequest(
      api.post('/brands', data),
      {
        loading: 'Creando marca...',
        success: 'Marca creada exitosamente',
        error: 'Error al crear marca',
      }
    );
  },

  update(id: string, data: UpdateBrandDto): Promise<Brand> {
    return apiRequest(
      api.put(`/brands/${id}`, data),
      {
        loading: 'Actualizando marca...',
        success: 'Marca actualizada exitosamente',
        error: 'Error al actualizar marca',
      }
    );
  },

  delete(id: string): Promise<void> {
    return apiRequest(
      api.delete(`/brands/${id}`),
      {
        loading: 'Eliminando marca...',
        success: 'Marca eliminada exitosamente',
        error: 'Error al eliminar marca',
      }
    );
  },

  restore(id: string): Promise<Brand> {
    return apiRequest(
      api.patch(`/brands/${id}/restore`),
      {
        loading: 'Restaurando marca...',
        success: 'Marca restaurada exitosamente',
        error: 'Error al restaurar marca',
      }
    );
  }
}; 