import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

const maxWidthClassMap: Record<MaxWidth, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
  '7xl': 'sm:max-w-7xl',
};

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

interface DialogAppProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  loading?: boolean;
  maxWidth?: MaxWidth;
  bgColor?: string;
}

const DialogApp = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Guardar',
  loading = false,
  maxWidth = 'sm',
  bgColor = 'bg-white',
}: DialogAppProps) => {
  const widthClass = maxWidthClassMap[maxWidth];

  return (
    <Dialog open={open}>
      <DialogContent className={`${widthClass} ${bgColor}  flex flex-col p-0 overflow-hidden`}>
        <DialogHeader className="sticky top-0 z-50 bg-white px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {children}

        <DialogFooter className="flex justify-end gap-2 sticky bottom-0 bg-white z-50 pb-2 px-6 pt-4 border-t">
          <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Guardando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogApp;
