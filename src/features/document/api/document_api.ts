import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';
import { Document, DocumentFilter, UploadDocumentDto } from '../types/document.types';

export interface PaginatedDocumentResponse {
  items: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const documentApi = {
  async upload(data: UploadDocumentDto): Promise<Document> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('entityType', data.entityType.toLowerCase());
    formData.append('entityId', data.entityId);
    if (data.description) {
      formData.append('description', data.description);
    }

    return apiRequest(
      api.post('/attachments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        loading: 'Subiendo documento...',
        error: 'Error al subir el documento',
        success: 'Documento subido exitosamente',
      }
    );
  },

  async getByFilter(filter: DocumentFilter): Promise<PaginatedDocumentResponse> {
    const params = new URLSearchParams({
      entityType: filter.entityType.toLowerCase(),
      entityId: filter.entityId,
      ...(filter.search ? { search: filter.search } : {}),
      ...(filter.page ? { page: filter.page.toString() } : {}),
      ...(filter.limit ? { limit: filter.limit.toString() } : {})
    });

    return apiRequest(
      api.get(`/attachments?${params.toString()}`),
      {
        loading: 'Cargando documentos...',
        error: 'Error al cargar documentos',
      }
    );
  },

  async delete(id: string): Promise<void> {
    return apiRequest(
      api.delete(`/attachments/${id}`),
      {
        loading: 'Eliminando documento...',
        error: 'Error al eliminar el documento',
        success: 'Documento eliminado exitosamente',
      }
    );
  },

  async download(id: string): Promise<Blob> {
    return apiRequest(
      api.get(`/attachments/${id}/download`, { responseType: 'blob' }),
      {
        loading: 'Descargando documento...',
        error: 'Error al descargar el documento',
      }
    );
  }
}; 