import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Props {
  email: string;
  onClose: () => void;
  open: boolean;
}

export const EmailConflictModal = ({ email, onClose, open }: Props) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Correo electrónico existente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            El correo electrónico <strong>{email}</strong> ya está registrado en nuestro sistema.
          </p>
          <p>
            Para continuar con la solicitud, puedes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Iniciar sesión con tu cuenta existente</li>
            <li>Usar un correo electrónico diferente</li>
          </ul>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Usar otro correo
          </Button>
          <Button onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};