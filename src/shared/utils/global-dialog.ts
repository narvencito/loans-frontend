import { create } from 'zustand';

export type DialogType = 'error' | 'success' | 'info' | 'confirm';

interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: DialogType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogStore extends DialogState {
  showDialog: (dialog: Omit<DialogState, 'isOpen'>) => void;
  hideDialog: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useDialogStore = create<DialogStore>((set, get) => ({
  isOpen: false,
  title: '',
  message: '',
  type: undefined,
  onConfirm: undefined,
  onCancel: undefined,

  showDialog: (dialog) => {
    set({
      isOpen: true,
      ...dialog,
    });
  },

  hideDialog: () => {
    set({
      isOpen: false,
      title: '',
      message: '',
      type: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    });
  },

  handleConfirm: () => {
    const { onConfirm, hideDialog } = get();
    if (onConfirm) onConfirm();
    hideDialog();
  },

  handleCancel: () => {
    const { onCancel, hideDialog } = get();
    if (onCancel) onCancel();
    hideDialog();
  },
}));

export const showGlobalDialog = (props: Omit<DialogState, 'isOpen'>) => {
  useDialogStore.getState().showDialog(props);
};

type DialogOptions = {
  type?: DialogType;
  title: string;
  message: string;
};

export const confirmDialog = (opts: DialogOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    showGlobalDialog({
      ...opts,
      type: 'confirm',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
};
