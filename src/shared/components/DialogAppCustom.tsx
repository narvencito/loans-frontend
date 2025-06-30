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

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

const maxWidthClasses: Record<MaxWidth, string> = {
  'sm': 'sm:max-w-[640px]',
  'md': 'sm:max-w-[768px]',
  'lg': 'sm:max-w-[1024px]',
  'xl': 'sm:max-w-[1280px]',
  '2xl': 'sm:max-w-[1400px]',
  '3xl': 'sm:max-w-[1600px]',
  '4xl': 'sm:max-w-[1800px]',
  '5xl': 'sm:max-w-[1920px]',
  '6xl': 'sm:max-w-[2048px]',
  '7xl': 'sm:max-w-[2200px]'
};

interface DialogAppCustomProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  childrenFooter: ReactNode;
  loading?: boolean;
  maxWidth?: MaxWidth;
  bgColor?: string;
}

const DialogAppCustom = ({
  open,
  onClose,
  title,
  children,
  childrenFooter,
  maxWidth = 'sm',
  bgColor = 'bg-white',
}: DialogAppCustomProps) => {
  const widthClass = maxWidthClasses[maxWidth];

  return (
    <Dialog open={open}>
      <DialogContent className={`${widthClass} ${bgColor} max-h-[90vh] flex flex-col p-0 overflow-hidden`}>
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
          {childrenFooter}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAppCustom;
