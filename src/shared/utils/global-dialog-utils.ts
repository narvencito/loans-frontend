import {
  showGlobalDialog,
  confirmDialog,
} from './global-dialog';

export const showError = async (title: string, message: string): Promise<void> => {
  return showGlobalDialog({ type: 'error', title: `❌ ${title}`, message });
};

export const showSuccess = async (title: string, message: string): Promise<void> => {
  return showGlobalDialog({ type: 'success', title: `✅ ${title}`, message });
};

export const showInfo = async (title: string, message: string): Promise<void> => {
  return showGlobalDialog({ type: 'info', title: `ℹ️ ${title}`, message });
};

export const showConfirm = (
  title: string,
  message: string
): Promise<boolean> => {
  return confirmDialog({ title: `⚠️ ${title}`, message });
};
