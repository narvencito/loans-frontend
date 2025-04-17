import toast from 'react-hot-toast';
import { AxiosPromise } from 'axios';

interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
}

export async function apiRequest<T>(
  promise: AxiosPromise<T>,
  messages?: ToastMessages,
): Promise<T> {
  let toastId: string | undefined;

  if (messages?.loading) {
    toastId = toast.loading(messages.loading);
  }

  try {
    const res = await promise;

    if (messages?.success) {
      if (toastId) toast.success(messages.success, { id: toastId });
      else toast.success(messages.success);
    } else if (toastId) {
      toast.dismiss(toastId);
    }

    return res.data;
  } catch (error: any) {
    const defaultMessage = messages?.error || 'Ocurrió un error inesperado';

    const message =
      error?.response?.data?.message || error?.message || defaultMessage;

    if (toastId) {
      toast.error(message, { id: toastId });
    } else {
      toast.error(message);
    }

    throw error;
  }
}
