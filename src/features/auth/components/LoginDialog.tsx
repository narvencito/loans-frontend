import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from './LoginForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Iniciar sesión</DialogTitle>
        </DialogHeader>
        <LoginForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
