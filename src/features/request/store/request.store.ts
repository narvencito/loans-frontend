import { create } from 'zustand';
import { RequestItem, requestApi } from '../api/request_api';

interface RequestStore {
  requests: RequestItem[];
  isLoading: boolean;
  error: string | null;
  selectedRequest: RequestItem | null;
  fetchRequests: () => Promise<void>;
  updateRequestStatus: (requestId: string, statusId: string) => Promise<void>;
  convertRequest: (requestId: string) => Promise<void>;
  setSelectedRequest: (request: RequestItem | null) => void;
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  selectedRequest: null,

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const requests = await requestApi.getAll();
      set({ requests, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar las solicitudes', isLoading: false });
    }
  },

  updateRequestStatus: async (requestId: string, statusId: string) => {
    set({ isLoading: true, error: null });
    try {
      await requestApi.updateStatus(requestId, statusId);
      // Refresh requests after update
      await get().fetchRequests();
    } catch (error) {
      set({ error: 'Error al actualizar el estado', isLoading: false });
    }
  },

  convertRequest: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      await requestApi.convert(requestId);
      // Refresh requests after conversion
      await get().fetchRequests();
    } catch (error) {
      set({ error: 'Error al convertir la solicitud', isLoading: false });
    }
  },

  setSelectedRequest: (request: RequestItem | null) => {
    set({ selectedRequest: request });
  },
})); 