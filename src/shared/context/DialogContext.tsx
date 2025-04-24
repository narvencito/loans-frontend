import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { setConfirmDialog, setGlobalDialog } from '@/shared/utils/global-dialog';

type DialogType = 'success' | 'error' | 'info';

type DialogState =
  | {
      title: string;
      message: string;
      type?: DialogType;
      onClose?: () => void;
    }
  | null;

type ConfirmState = {
  title: string;
  message: string;
  resolve: (val: boolean) => void;
} | null;

export const GlobalDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  useEffect(() => {
    setGlobalDialog((opts) => setDialog(opts));
    setConfirmDialog(({ title, message }) => {
      return new Promise((resolve) => {
        setConfirm({ title, message, resolve });
      });
    });
  }, []);

  const closeDialog = () => {
    dialog?.onClose?.();
    setDialog(null);
  };

  const handleConfirm = () => {
    confirm?.resolve(true);
    setConfirm(null);
  };

  const handleCancel = () => {
    confirm?.resolve(false);
    setConfirm(null);
  };

  return (
    <>
      {children}

      {/* Simple Dialog */}
      {dialog &&
        createPortal(
          <Dialog open onOpenChange={closeDialog}>
            <DialogContent className="w-full max-w-sm p-6 rounded shadow-lg bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold mb-2">{dialog.title}</DialogTitle>
                <DialogDescription className="mb-4 text-sm">{dialog.message}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button onClick={closeDialog} className="bg-blue-600 text-white hover:bg-blue-700">
                  Cerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>,
          document.body
        )}

      {/* Confirm Dialog */}
      {confirm &&
        createPortal(
          <Dialog open onOpenChange={handleCancel}>
            <DialogContent className="w-full max-w-sm p-6 rounded shadow-lg bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold mb-2">{confirm.title}</DialogTitle>
                <DialogDescription className="mb-4 text-sm">{confirm.message}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="default" onClick={handleCancel} className="bg-yellow-400 text-black">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </Dialog>,
          document.body
        )}
    </>
  );
};
