import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RequestStatusCode } from '../enums/request-status.enum';
import { GrayButton, GreenButton } from '@/components/common/ColorButtons';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (comments?: string) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: string;
  hideComments?: boolean;
  currentStatus?: RequestStatusCode;
}

export const RequestStatusChangeDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmColor,
  hideComments = false,
  currentStatus
}: Props) => {
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determinar si se deben ocultar los comentarios
  const shouldHideComments = hideComments || currentStatus === RequestStatusCode.PENDING;

  const handleConfirm = async () => {
    if (!shouldHideComments && !comments.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(shouldHideComments ? undefined : comments);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          {!shouldHideComments && (
            <div className="space-y-2">
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                placeholder="Ingrese un comentario sobre el cambio de estado..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px] bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <GrayButton
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </GrayButton>
          <GreenButton
            onClick={handleConfirm}
            disabled={isLoading || (!shouldHideComments && !comments.trim())}
            loading={isLoading}
            className={confirmColor}
          >
            {confirmLabel}
          </GreenButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 