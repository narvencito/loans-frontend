import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "../utils/global-dialog";

export default function DialogApp() {
  const { isOpen, title, message, type, handleConfirm, handleCancel } = useDialogStore();

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'confirm':
        return '⚠️';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-surface border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2">
            <span className="text-xl">{getIcon()}</span>
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-primary/80">{message}</DialogDescription>
        </DialogHeader>
        {type === 'confirm' && (
          <DialogFooter className="flex justify-end gap-2">
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              className="transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              onClick={handleConfirm}
              className="transition-all duration-200"
            >
              Confirmar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
