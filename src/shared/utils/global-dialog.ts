type DialogType = 'success' | 'error' | 'info';

type DialogOptions = {
  type?: DialogType;
  title: string;
  message: string;
};

type ConfirmDialogOptions = DialogOptions;

let showDialogInternal: ((opts: DialogOptions) => void) | null = null;
let confirmDialogInternal: ((opts: ConfirmDialogOptions) => Promise<boolean>) | null = null;

export const setGlobalDialog = (fn: (opts: DialogOptions) => void) => {
  showDialogInternal = fn;
};

export const setConfirmDialog = (fn: (opts: ConfirmDialogOptions) => Promise<boolean>) => {
  confirmDialogInternal = fn;
};

export const showGlobalDialog = (opts: DialogOptions) => {
  showDialogInternal?.(opts);
};

export const confirmDialog = (opts: ConfirmDialogOptions): Promise<boolean> => {
  if (!confirmDialogInternal) throw new Error('ConfirmDialog not initialized');
  return confirmDialogInternal(opts);
};
