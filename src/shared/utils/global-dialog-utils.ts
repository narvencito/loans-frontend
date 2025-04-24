import {
  showGlobalDialog,
  confirmDialog,
} from './global-dialog';

export const showError = (message: string, title = '❌ Error') =>
  showGlobalDialog({ type: 'error', title, message });

export const showSuccess = (message: string, title = '✅ Éxito') =>
  showGlobalDialog({ type: 'success', title, message });

export const showInfo = (message: string, title = 'ℹ️ Información') =>
  showGlobalDialog({ type: 'info', title, message });

export const showConfirm = (
  message: string,
  title = '⚠️ Confirmar acción'
): Promise<boolean> =>
  confirmDialog({ title, message });
