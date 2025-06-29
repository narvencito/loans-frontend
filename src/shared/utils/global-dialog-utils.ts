import { showGlobalDialog } from './global-dialog';

export const showError = (title: string, message: string) => {
  showGlobalDialog({
    title: `❌ ${title}`,
    message,
    type: 'error',
  });
};

export const showSuccess = (title: string, message: string) => {
  showGlobalDialog({
    title: `✅ ${title}`,
    message,
    type: 'success',
  });
};

export const showInfo = (title: string, message: string) => {
  showGlobalDialog({
    title: `ℹ️ ${title}`,
    message,
    type: 'info',
  });
};

export const showConfirm = (message: string, title: string = 'Confirmar'): Promise<boolean> => {
  return new Promise((resolve) => {
    showGlobalDialog({
      title: `⚠️ ${title}`,
      message,
      type: 'confirm',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
};
