type DialogType = 'success' | 'error' | 'info';

type DialogOptions = {
  type?: DialogType;
  title: string;
  message: string;
};

type ConfirmDialogOptions = DialogOptions;

let showDialogInternal: ((opts: DialogOptions) => Promise<void>) | null = null;
let confirmDialogInternal: ((opts: ConfirmDialogOptions) => Promise<boolean>) | null = null;

export const setGlobalDialog = (fn: (opts: DialogOptions) => Promise<void>) => {
  showDialogInternal = fn;
};

export const setConfirmDialog = (fn: (opts: ConfirmDialogOptions) => Promise<boolean>) => {
  confirmDialogInternal = fn;
};

export const showGlobalDialog = async (opts: DialogOptions): Promise<void> => {
  if (!showDialogInternal) throw new Error('GlobalDialog not initialized');
  return showDialogInternal(opts);
};

export const confirmDialog = async (opts: ConfirmDialogOptions): Promise<boolean> => {
  if (!confirmDialogInternal) throw new Error('ConfirmDialog not initialized');
  return confirmDialogInternal(opts);
};
