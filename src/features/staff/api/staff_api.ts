import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { StaffRoleEnum } from '../types/staff.types';

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffInfo {
  address: string;
  document: string;
  phone: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: Role;
  staff: StaffInfo;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  name: string;
  email: string;
  role: StaffRoleEnum;
  document: string;
  phone: string;
  address: string;
}

export interface UpdateStaffDto {
  name?: string;
  phone?: string;
  address?: string;
}

export interface StaffFilters {
  role?: StaffRoleEnum;
}

export const staffApi = {
  async create(data: CreateStaffDto): Promise<Staff> {
    return apiRequest(
      api.post('/staff', data),
      {
        loading: 'Registrando personal...',
        success: 'Personal registrado correctamente',
        error: 'No se pudo registrar el personal'
      }
    );
  },

  async getAll(filters?: StaffFilters): Promise<Staff[]> {
    const query = new URLSearchParams();
    
    if (filters?.role) {
      query.append('role', filters.role);
    }

    return apiRequest(
      api.get(`/staff${query.toString() ? `?${query.toString()}` : ''}`),
      {
        loading: 'Cargando personal...',
        error: 'No se pudo cargar la lista de personal'
      }
    );
  },

  async update(id: string, data: UpdateStaffDto): Promise<Staff> {
    return apiRequest(
      api.put(`/staff/${id}`, data),
      {
        loading: 'Actualizando personal...',
        success: 'Personal actualizado correctamente',
        error: 'No se pudo actualizar el personal'
      }
    );
  },

  async toggleStatus(id: string): Promise<Staff> {
    return apiRequest(
      api.patch(`/staff/${id}/toggle-status`),
      {
        loading: 'Actualizando estado...',
        success: 'Estado actualizado correctamente',
        error: 'No se pudo actualizar el estado'
      }
    );
  }
}; 