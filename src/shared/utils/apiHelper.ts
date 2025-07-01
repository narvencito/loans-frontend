import { AxiosPromise } from 'axios';
import { showGlobalDialog } from '@/shared/utils/global-dialog'; // asegúrate que el path sea correcto
import { showError, showSuccess } from './global-dialog-utils';
import { useLoaderStore } from '../store/loader.store';

// Estructura base de respuesta del API
interface BaseApiResponse {
  success: boolean;
  message?: string;
}

interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
}

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export async function apiRequest<T>(
  promise: AxiosPromise<T & BaseApiResponse>,
  messages?: ToastMessages
): Promise<T> {
  const { show: showLoader, hide: hideLoader } = useLoaderStore.getState();
  
  try {
    if (messages?.loading) {
      showLoader();
    }

    const res = await promise;

    if (messages?.loading) {
      hideLoader();
    }

    // Verificar primero el código de estado HTTP
    if (res.status < 200 || res.status >= 300) {
      const message = res.data?.message || messages?.error || 'Error en la respuesta del servidor';
      showError("Error", message);
      throw new Error(message);
    }

    // Si el status es correcto, verificamos el success interno
    if (res.data?.success === false) {
      const message = res.data.message || messages?.error || 'Ocurrió un error inesperado';
      showError("Error", message);
      throw new Error(message);
    }

    if (messages?.success) {
      showSuccess("Éxito", messages.success);
    }

    // Retornamos la respuesta completa ya que viene con la estructura correcta
    return res.data;
  } catch (error: any) {
    if (messages?.loading) {
      hideLoader();
    }
    
    // Manejar errores HTTP específicos
    if (error.response) {
      const status = error.response.status;
      // Intentamos obtener el mensaje del backend primero
      const backendMessage = error.response.data?.message;
      let message = backendMessage || messages?.error || 'Error desconocido';

      // Solo usamos mensajes por defecto si no hay mensaje del backend
      if (!backendMessage) {
        switch (status) {
          case HTTP_STATUS.BAD_REQUEST:
            message = 'Datos inválidos en la solicitud';
            break;
          case HTTP_STATUS.UNAUTHORIZED:
            message = 'Sesión expirada o no autorizada';
            // Aquí podrías agregar lógica para redireccionar al login
            break;
          case HTTP_STATUS.FORBIDDEN:
            message = 'No tiene permisos para realizar esta acción';
            break;
          case HTTP_STATUS.NOT_FOUND:
            message = 'El recurso solicitado no existe';
            break;
          case HTTP_STATUS.CONFLICT:
            message = 'Conflicto con el estado actual del recurso';
            break;
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            message = 'Error interno del servidor';
            break;
          default:
            if (status >= 500) {
              message = 'Error en el servidor';
            } else if (status >= 400) {
              message = 'Error en la solicitud';
            }
        }
      }

      showError("Error", message);
      throw new Error(message);
    }

    // Si es un error de red u otro tipo
    const message = error.message || messages?.error || 'Error de conexión';
    showError("Error", message);
    throw error;
  }
}
