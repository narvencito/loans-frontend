import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export interface PublicEquipmentFilters {
  search?: string;
  brandIds?: string[];
  categoryIds?: string[];
  generalCategoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export interface PublicEquipmentItem {
  id: string;
  name: string;
  description: string;
  salePrice: number;
  rentalDailyRate: number;
  status: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  generalCategoryId: string;
  generalCategoryName: string;
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
}

export const equipmentPublicApi = {
  getByFilter(filters: PublicEquipmentFilters): Promise<PublicEquipmentItem[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.brandIds?.length) params.append('brandIds', filters.brandIds.join(','));
    if (filters.categoryIds?.length) params.append('categoryIds', filters.categoryIds.join(','));
    if (filters.generalCategoryIds?.length) params.append('generalCategoryIds', filters.generalCategoryIds.join(','));
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.status) params.append('status', filters.status);

    return apiRequest(
      api.get(`/public/equipment?${params.toString()}`),
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