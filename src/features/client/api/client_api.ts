import { api } from "@/shared/utils/api";
import { apiRequest } from "@/shared/utils/apiHelper";

export interface CreateClientDto {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientItem {
  id: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
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

  async searchClientsByNameDocument(search: string) {
    return apiRequest<[ClientItem]>(
      api.get(`/clients/search?query=${search}`),
      {
        loading: 'Buscando clientes...',
        error: 'No se pudo buscar clientes',
      }
    );
  },

  async getClientById(id: string) {
    console.log("estamos llamando a la busqueda de cliente por id");
    return apiRequest<ClientItem>(
      api.get(`/clients/${id}`),
      {
        loading: 'Cargando cliente...',
        error: 'No se pudo obtener el cliente',
      }
    );
  },
};