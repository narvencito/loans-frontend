import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface PublicEquipmentFilters {
  name?: string;
  brandIds?: string[];
  categoryIds?: string[];
  generalCategoryIds?: string[];
  statusId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  serial?: string;
  code?: string;
}

export interface PublicEquipmentItem {
  id: string;
  code: string;
  name: string;
  description: string;
  serial: string;
  number: string | number;
  purchasePrice: number;
  salePrice: number;
  rentalDailyRate: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    isActive: boolean;
  };
  generalCategoryId: string;
  generalCategory: {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  brandId: string;
  brandRelation: {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  statusId: string;
  statusName: string;
  location?: string;
  isActive: boolean;
  features: {
    id: string;
    name: string;
    value: string;
  }[];
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const equipmentPublicApi = {
  getByFilter(filters: PublicEquipmentFilters): Promise<PublicEquipmentItem[]> {
    console.log('listado de equipos publicos ');
    console.log(filters);
    return apiRequest(
      api.post('/public/equipment/filter', filters),
      {
        loading: 'Cargando equipos...',
        error: 'Error al cargar equipos',
      }
    );
  },

  getById(id: string): Promise<PublicEquipmentItem> {
    return apiRequest(
      api.get(`/public/equipment/${id}`),
      {
        loading: 'Cargando equipo...',
        error: 'Error al cargar equipo',
      }
    );
  }
};