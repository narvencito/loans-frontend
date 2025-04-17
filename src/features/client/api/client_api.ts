import { api } from "@/shared/utils/api";
import { apiRequest } from "@/shared/utils/apiHelper";

export interface CreateClientDto {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientItem {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export const clientApi = {
  async getClients() {
    return apiRequest<[ClientItem]>(
      api.get('/clients'),
      {
        loading: 'Cargando clientes...',
        error: 'Error al cargar clientes',
      }
    );
  },

  async toggleStatus(id: string) {
    return apiRequest(
      api.delete(`/clients/${id}`),
      {
        loading: 'Actualizando estado...',
        success: 'cliente eliminado correctamente',
        error: 'No se pudo eliminar el cliente',
      }
    );
  },

  async createClient(data: CreateClientDto) {
    return apiRequest(
      api.post('/clients', data),
      {
        loading: 'Creando cliente...',
        success: 'Cliente creado correctamente',
        error: 'No se pudo crear el cliente',
      }
    );
  },
};