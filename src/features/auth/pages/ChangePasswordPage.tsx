import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';
import { showError, showSuccess } from '@/shared/utils/global-dialog-utils';
import { useAuthStore } from '../store/auth.store';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/shared/components/PasswordInput';

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const handleSubmit = async () => {
    if (!password || !confirm) {
      showError('Por favor, completa ambos campos');
      return;
    }

    if (password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirm) {
      showError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword({ newPassword: password, userId });
      localStorage.removeItem('tempToken');
      showSuccess('Contraseña actualizada correctamente');
      console.log("estas redirigiendo");
      logout();
      navigate('/');
    } catch (error: any) {
      showError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutAndReturnHome = () => {
    logout();
    localStorage.removeItem('tempToken');
    navigate('/');
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-screen bg-cover bg-center bg-no-repeat" >
      <div className="relative z-10 w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-5">
        <h2 className="text-xl font-bold text-center text-primary">
          Cambiar contraseña
        </h2>

        <PasswordInput
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          placeholder="Confirmar nueva contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-between gap-2 mt-6">
          <Button type="button" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Cambiar contraseña'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleLogoutAndReturnHome}
          >
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
}
