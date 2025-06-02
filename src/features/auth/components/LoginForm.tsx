import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../services/authService';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showError } from '@/shared/utils/global-dialog-utils';

const loginSchema = z.object({
  email: z.string().min(3, { message: 'Usuario requerido' }).email('email incorrecto'),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      setAuth({
        token: response.token,
        user: response.user,
      });
      onClose();

      const role = response.user.role.name.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'CLIENT') {
        navigate('/client/dashboard');
      } else if (role === 'WORKER'){
        navigate('/worker/dashboard');
      }else{
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      showError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className="text-sm">Usuario</Label>
        <Input
          {...register('email')}
          type="text"
          placeholder="Tu usuario"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label className="text-sm">Contraseña</Label>
        <Input
          {...register('password')}
          type="password"
          placeholder="Tu contraseña"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Entrar'}
      </Button>
    </form>
  );
}
