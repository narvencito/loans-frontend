import { AxiosPromise } from 'axios';
import { showGlobalDialog } from '@/shared/utils/global-dialog'; // asegúrate que el path sea correcto
import { showError, showSuccess } from './global-dialog-utils';

interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
}

export async function apiRequest<T>(
  promise: AxiosPromise<T>,
  messages?: ToastMessages
): Promise<T> {
  try {
    const res = await promise;

    if (messages?.success) {
      showSuccess(messages.success );
    }

    return res.data;
  } catch (error: any) {
    const defaultMessage = messages?.error || 'Ocurrió un error inesperado';

    const message =
      error?.response?.data?.message || error?.message || defaultMessage;
    showError(message);

    throw error;
  }
}
